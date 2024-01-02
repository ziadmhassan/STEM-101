from flask import Flask, render_template, jsonify, request, redirect, url_for
import requests
import face_recognition
import numpy as np
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__)

# Load and encode faces
# Replace with your actual file paths and ensure at least one image is encoded
image_of_bishoy = face_recognition.load_image_file("../assets/bishoy.jpg")
bishoy_face_encoding = face_recognition.face_encodings(image_of_bishoy)[0]

# Populate the known face encodings and their names
known_face_encodings = [bishoy_face_encoding]
known_face_names = ["Bishoy"]

# Mapping names to MP3 file numbers
name_to_file_number = {
    "Bishoy": 1,
    # Add more mappings as needed
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trigger_capture')
def trigger_capture():
    # ESP32-CAM server URL to trigger the capture
    esp_cam_url = "http://<ESP32-CAM-IP-ADDRESS>/capture"

    try:
        # Send a request to the ESP32-CAM to capture an image
        response = requests.get(esp_cam_url, stream=True)

        if response.status_code == 200:
            # Process the image for face recognition
            return process_image(response.content)
        else:
            return jsonify({"error": "Failed to capture image"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_image(image_data):
    image = Image.open(BytesIO(image_data))
    image_array = np.array(image)

    face_locations = face_recognition.face_locations(image_array)
    face_encodings = face_recognition.face_encodings(image_array, face_locations)

    name = "Unknown"
    file_number = 0

    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
            file_number = name_to_file_number.get(name, 0)
            break

    # Send command to ESP32 to play corresponding sound file
    play_sound_on_esp(file_number)

    # Convert PIL image to base64 for HTML display
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return render_template('result.html', name=name, image_data=img_str)

def play_sound_on_esp(file_number):
    # ESP32 endpoint to trigger sound playback
    esp_play_sound_url = "http://<ESP32-IP-ADDRESS>/play_sound?file_number=" + str(file_number)
    try:
        requests.get(esp_play_sound_url)
    except Exception as e:
        print(f"Error sending play sound command to ESP: {e}")

#@app.route('/result')
#def result():
    # This route can display recognition results
#    return render_template('result.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)