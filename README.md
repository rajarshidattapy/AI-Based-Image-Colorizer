# AI-Based Image Colorizer

## 📌 Overview
This project is an AI-powered web app that colorizes black-and-white images using **DeOldify** (a pre-trained deep learning model). The app is built with **Flask** for the backend and a simple **HTML/CSS frontend** for user interaction.

---

## 🛠 Tech Stack
- **Frontend:** HTML, CSS
- **Backend:** Flask (Python)
- **AI Model:** DeOldify (Pre-trained model for image colorization)
- **Deployment:** Google Colab / Hugging Face Spaces

---

## 📂 Project Structure
```
/ai-image-colorizer
│── /static
│   │── styles.css        # CSS for frontend styling
│   │── output.jpg        # Placeholder for colorized images
│── /templates
│   │── index.html        # Main frontend UI
│── /models
│   │── DeOldify/         # Pre-trained model
│── app.py               # Flask backend
│── requirements.txt      # Dependencies
│── README.md            # Documentation
```

---

## 📌 Setup & Installation

### 🔹 1️⃣ Clone the Repository
```sh
git clone https://github.com/rajarshidattapy/AI-Based-Image-Colorizer.git
cd ai-image-colorizer
```

### 🔹 2️⃣ Create a Virtual Environment (Optional but Recommended)
```sh
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows
```

### 🔹 3️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 🔹 4️⃣ Download & Setup DeOldify Model
```sh
!git clone https://github.com/jantic/DeOldify.git
cd DeOldify && git checkout stable
pip install -r requirements-colab.txt
```

### 🔹 5️⃣ Run the Flask App
```sh
python app.py
```

### 🔹 6️⃣ Open the Web App in Your Browser
Visit: **http://127.0.0.1:5000/**

---

## 🎨 How It Works
1. **Upload a black-and-white image** from the UI.
2. The **Flask backend** sends the image to DeOldify.
3. The AI model **colorizes** the image.
4. The **colorized image** is displayed on the frontend.

---

## 📌 API Endpoints
| Endpoint       | Method | Description |
|---------------|--------|-------------|
| `/`           | GET    | Loads the web app UI |
| `/colorize`   | POST   | Accepts image, processes it, and returns colorized output |

---

## 📌 Future Enhancements
✅ Improve UI with Bootstrap/TailwindCSS  
✅ Deploy using Hugging Face Spaces  
✅ Optimize model inference for faster processing  
✅ Add batch image processing feature  

---

