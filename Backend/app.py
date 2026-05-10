from flask import Flask, jsonify, Response
from flask_cors import CORS
import threading
from ultralytics import YOLO
import cv2

app = Flask(__name__)
CORS(app)

# Global variables for real-time traffic data from AI model
traffic_data = {
    "mainRoad": 0,
    "incomingRoad": 0,
    "mainRoadBreakdown": {"car": 0, "bus": 0, "truck": 0, "motorcycle": 0},
    "incomingRoadBreakdown": {"car": 0, "bus": 0, "truck": 0, "motorcycle": 0},
    "trafficLevel": "LOW",
    "signal": "RED",
    "greenTime": 20,
    "prediction": "Traffic Stable",
    "ambulance": False
}

# Global frame buffer for video streaming
current_frame = None


def run_ai_model():
    global traffic_data, current_frame
    
    # Load YOLO model
    model = YOLO("yolov8n.pt")
    vehicle_classes = ["car", "bus", "truck", "motorcycle"]
    
    cap1 = cv2.VideoCapture("../datasets/traffic1.mp4")
    cap2 = cv2.VideoCapture("../datasets/traffic2.mp4")
    
    while True:
        # Skip frames to speed up video playback and match real-time
        for _ in range(2):
            cap1.read()
            cap2.read()
            
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()
        
        # Loop video indefinitely
        if not ret1 or not ret2:
            cap1.set(cv2.CAP_PROP_POS_FRAMES, 0)
            cap2.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
            
        # ---------------- CAMERA 1 ----------------
        results1 = model(frame1, conf=0.2, verbose=False)
        count1 = 0
        breakdown1 = {"car": 0, "bus": 0, "truck": 0, "motorcycle": 0, "ambulance": 0}
        for r in results1:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                class_name = model.names[cls_id]
                if class_name in vehicle_classes:
                    count1 += 1
                    breakdown1[class_name] += 1
            frame1 = r.plot()
            
        # ---------------- CAMERA 2 ----------------
        results2 = model(frame2, conf=0.2, verbose=False)
        count2 = 0
        breakdown2 = {"car": 0, "bus": 0, "truck": 0, "motorcycle": 0, "ambulance": 0}
        ambulance_detected = False
        for r in results2:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                class_name = model.names[cls_id]
                
                # Treat truck as ambulance for demonstration since YOLOv8 COCO lacks an ambulance class
                if class_name == "truck":
                    ambulance_detected = True
                    count2 += 1
                    breakdown2["ambulance"] += 1
                elif class_name in vehicle_classes:
                    count2 += 1
                    breakdown2[class_name] += 1
            frame2 = r.plot()
            
        # ---------------- TRAFFIC ANALYSIS ----------------
        total_traffic = count1 + count2
        
        if ambulance_detected:
            prediction = "Emergency Vehicle Priority"
            traffic_level = "HIGH"
            signal_main = "RED"
            signal_incoming = "GREEN"
            active_lane = "Incoming Road"
            green_time = 60
        elif count1 > count2 + 2:
            prediction = "Main Road Priority"
            traffic_level = "HIGH" if count1 > 20 else "MEDIUM"
            signal_main = "GREEN"
            signal_incoming = "RED"
            active_lane = "Main Road"
            green_time = min(60, max(20, count1 * 2))
        elif count2 > count1 + 2:
            prediction = "Incoming Road Priority"
            traffic_level = "HIGH" if count2 > 20 else "MEDIUM"
            signal_main = "RED"
            signal_incoming = "GREEN"
            active_lane = "Incoming Road"
            green_time = min(60, max(20, count2 * 2))
        else:
            prediction = "Balanced Traffic"
            traffic_level = "LOW" if total_traffic < 15 else "MEDIUM"
            signal_main = "GREEN"
            signal_incoming = "RED"
            active_lane = "Main Road"
            green_time = 30
            
        # Update global state for Flask to read
        traffic_data = {
            "mainRoad": count1,
            "incomingRoad": count2,
            "mainRoadBreakdown": breakdown1,
            "incomingRoadBreakdown": breakdown2,
            "trafficLevel": traffic_level,
            "signalMain": signal_main,
            "signalIncoming": signal_incoming,
            "activeLane": active_lane,
            "greenTime": green_time,
            "prediction": prediction,
            "ambulance": ambulance_detected
        }
        
        # Resize frames first so text scales perfectly on both
        frame1 = cv2.resize(frame1, (800, 800))
        frame2 = cv2.resize(frame2, (800, 800))

        # ---------------- DISPLAY TEXT ----------------
        font_scale = 1
        thickness = 2
        
        cv2.putText(frame1, f"Main Road Vehicles: {count1}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 255, 0), thickness)
        cv2.putText(frame2, f"Incoming Road Vehicles: {count2}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 255, 255), thickness)
        cv2.putText(frame1, f"Prediction: {prediction}", (20, 100), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 0, 0), thickness)
        cv2.putText(frame1, f"Traffic Level: {traffic_level}", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 0), thickness)
        cv2.putText(frame1, f"Signal (Main): {signal_main}", (20, 200), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 255, 255), thickness)
        cv2.putText(frame1, f"Green Time: {green_time}s", (20, 250), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), thickness)
        
        combined = cv2.hconcat([frame1, frame2])
        
        # Encode the combined frame to JPEG and store it globally
        ret_encode, buffer = cv2.imencode('.jpg', combined)
        if ret_encode:
            current_frame = buffer.tobytes()
            
    cap1.release()
    cap2.release()

# Start AI model processing in a background thread
threading.Thread(target=run_ai_model, daemon=True).start()

@app.route("/traffic")
def traffic():
    # Return the real-time AI-processed data
    return jsonify(traffic_data)

@app.route("/video_feed")
def video_feed():
    def generate():
        import time
        while True:
            if current_frame is not None:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + current_frame + b'\r\n')
                time.sleep(0.05) # Cap at 20 FPS to reduce CPU usage
            else:
                time.sleep(0.1)
                
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    # use_reloader=False is critical to prevent threading issues
    app.run(debug=True, use_reloader=False)