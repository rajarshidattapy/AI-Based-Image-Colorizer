document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadForm = document.getElementById('upload-form');
    const imageUpload = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const colorizeBtn = document.getElementById('colorize-btn');
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');
    const comparisonContainer = document.getElementById('comparison-container');
    const originalImage = document.getElementById('original-image');
    const colorizedImage = document.getElementById('colorized-image');
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');
    const downloadBtn = document.getElementById('download-btn');
    const newUploadBtn = document.getElementById('new-upload-btn');

    // Update filename display when file is selected
    imageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileNameDisplay.textContent = file.name;
            colorizeBtn.disabled = false;
            
            // Preview the original image
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            colorizeBtn.disabled = true;
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!imageUpload.files || !imageUpload.files[0]) {
            showError('Please select an image first');
            return;
        }
        
        // Show the result section and loader
        resultContainer.style.display = 'block';
        loader.style.display = 'block';
        comparisonContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        downloadBtn.style.display = 'none';
        
        // Scroll to result section
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Create form data
        const formData = new FormData();
        formData.append('file', imageUpload.files[0]);
        
        // Send API request
        fetch('/colorize', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Server error');
                });
            }
            return response.json();
        })
        .then(data => {
            // Hide loader and show comparison
            loader.style.display = 'none';
            comparisonContainer.style.display = 'flex';
            
            // Set image sources with cache-busting
            const timestamp = new Date().getTime();
            originalImage.src = `${data.original}?t=${timestamp}`;
            colorizedImage.src = `${data.colorized}?t=${timestamp}`;
            
            // Setup download button
            downloadBtn.style.display = 'inline-block';
            downloadBtn.addEventListener('click', function() {
                const a = document.createElement('a');
                a.href = data.colorized;
                a.download = 'colorized_image.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        })
        .catch(error => {
            loader.style.display = 'none';
            showError(error.message || 'An error occurred during colorization');
        });
    });
    
    // Handle "Colorize Another Image" button
    newUploadBtn.addEventListener('click', function() {
        // Reset form
        uploadForm.reset();
        fileNameDisplay.textContent = 'No file chosen';
        colorizeBtn.disabled = true;
        
        // Hide result section
        resultContainer.style.display = 'none';
        
        // Scroll back to upload section
        document.querySelector('.upload-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Helper function to show error messages
    function showError(message) {
        errorContainer.style.display = 'block';
        errorText.textContent = message;
    }
});