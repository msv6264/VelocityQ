# 🚦 VelocitiQ: AI-Powered Smart Junction System

VelocitiQ is an intelligent traffic management system designed to optimize urban mobility. By leveraging real-time computer vision and deep learning, the system dynamically controls traffic signals based on actual vehicle density, prioritizing high-volume roads and emergency vehicles.

---

## 📺 Project Demo
> **Note:** Due to free-tier deployment limitations for computer vision models, the live backend may occasionally take time to respond. A complete working demo video has been attached for evaluation.

---

## 🚀 Key Features
- **Real-Time AI Detection:** Uses YOLOv8 to identify and count cars, buses, trucks, and motorcycles from live camera feeds.
- **Dynamic Signal Logic:** Automatically adjusts green-light durations based on live traffic volume, reducing idle wait times.
- **Emergency Vehicle Priority:** Instantly detects emergency vehicles (e.g., ambulances) and triggers a "Green Corridor" to ensure they pass through without delay.
- **Interactive Dashboard:** A premium React-based visualization showing real-time traffic data, vehicle breakdowns, and live AI vision streams.
- **Scalable Architecture:** Designed with a decoupled Backend (Python/Flask) and Frontend (React/Vite) for maximum flexibility.

---

## 🛠️ Tech Stack
- **AI/ML:** YOLOv8 (Ultralytics), OpenCV
- **Backend:** Python, Flask, Flask-CORS, Gunicorn
- **Frontend:** React.js, Tailwind CSS, Vite
- **Deployment:** Render (Backend), Vercel (Frontend)

---

## 📂 Project Structure
```text
VelocitiQ/
├── Backend/          # Python Flask server & YOLO logic
├── Frontend/         # React dashboard & UI components
├── datasets/         # Video samples for AI processing
└── .gitignore        # Optimized Git ignore rules
```

---

## ⚙️ Setup & Installation

### Backend Setup
1. Navigate to `Backend/`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to `Frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```text
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```
4. Run the dashboard:
   ```bash
   npm run dev
   ```

---

## 🧠 How it Works
1. **Detection:** The backend processes video frames using YOLOv8, identifying vehicle types and density.
2. **Analysis:** The traffic logic compares the volume between roads. If an ambulance is detected or if one road has significantly higher volume, the signal state is updated.
3. **Communication:** The backend serves this data via a JSON API and streams the AI vision feed using MJPEG.
4. **Visualization:** The React frontend polls the API every 500ms and updates the traffic signals and vehicle queues on the dashboard instantly.

---

## 👨‍💻 Developed By
### **Sri Vaishnavi** 
