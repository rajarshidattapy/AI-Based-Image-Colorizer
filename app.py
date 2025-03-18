import os
from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import torch
from deoldify import device
from deoldify.device_id import DeviceId
from deoldify.visualize import *

# Create Flask app with explicit static folder
app = Flask(__name__, 
            static_url_path='/static', 
            static_folder='static',
            template_folder='templates')

# Configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
app.config['RESULTS_FOLDER'] = 'static/results/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Create directories if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULTS_FOLDER'], exist_ok=True)
os.makedirs('static/css', exist_ok=True)
os.makedirs('static/js', exist_ok=True)

# Check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Initialize DeOldify model
def initialize_model():
    # Use CPU if CUDA not available
    if not torch.cuda.is_available():
        device.set(device=DeviceId.CPU)
    
    # Initialize the artistic model
    colorizer = get_image_colorizer(artistic=True)
    return colorizer

# Global model instance
colorizer = initialize_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/colorize', methods=['POST'])
def colorize_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Save the uploaded file
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(input_path)
        
        # Generate result filename
        result_filename = f"colorized_{filename}"
        output_path = os.path.join(app.config['RESULTS_FOLDER'], result_filename)
        
        # Process the image with DeOldify
        try:
            colorizer.plot_transformed_image(
                path=input_path,
                render_factor=35,  # Adjust this based on your needs (higher = better quality but slower)
                compare=False,
                watermarked=False
            )
            
            # DeOldify saves the result in the same directory as the input
            # Rename and move it to the results folder
            base_filename = os.path.splitext(filename)[0]
            deoldify_result = os.path.join(app.config['UPLOAD_FOLDER'], f"{base_filename}_colorized.png")
            
            if os.path.exists(deoldify_result):
                os.rename(deoldify_result, output_path)
            else:
                return jsonify({'error': 'Colorization failed'}), 500
                
            # Return paths for display
            return jsonify({
                'original': input_path,
                'colorized': output_path
            })
            
        except Exception as e:
            return jsonify({'error': f'Error during colorization: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    # Add debug=True for development
    app.run(debug=True)