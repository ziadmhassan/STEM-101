import React, {useState} from 'react';
export function captureImage() {
    // Update the status message
    // document.getElementById('status').textContent = 'Capturing...';
    // document.getElementById('status').classList.remove('error');
    // Make the request to the Flask server to trigger ESP32-CAM capture
    fetch('http://localhost:5000/trigger_capture')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);   
            }
            return response.json();
        })
        .then(data => {
            // If there's an error, show it in the status div
            if (data.error) {
                throw new Error(data.error);
            } else {
                // If successful, store the results and redirect to the results page
                // sessionStorage.setItem('personName', data.name);
                // sessionStorage.setItem('personImage', data.image_data); // Adjusted to match Flask's response key
                //window.location.href = '/result'; // Adjusted to the correct route
                setCaptureResult({
                    name: data.name,
                    imageSrc: data.image_data,
                });
            }
        })
        .catch(error => {
            // If there's an error in the request, show it in the status div
            //  document.getElementById('status').textContent = 'Error: ' + error.message;
            //  document.getElementById('status').classList.add('error');
            alert('Error: ' + error.message);
        });
  }
  /*
  window.addEventListener('DOMContentLoaded', (event) => {
    const name = sessionStorage.getItem('personName');
    const imageSrc = sessionStorage.getItem('personImage');
    
    if (name && imageSrc) {
        document.getElementById('resultsName').textContent = name;
        document.getElementById('resultsImage').src = 'data:image/jpeg;base64,' + imageSrc;
    }
  });*/

  export default function Result() {
    const [captureResult, setCaptureResult] = useState({
        name: null,
        imageSrc: null,
    });

    return (
        <div>
            {captureResult.name && captureResult.imageSrc ? (
                <>
                    <h1>{captureResult.name}</h1>
                    <img src={`data:image/jpeg;base64,${captureResult.imageSrc}`} alt="Person" />
                </>
            ) : (
                <label
                htmlFor="output"
                style={{ fontFamily: 'Lato', fontSize: '1.5rem' }}
                >
                Results are displayed here
                </label>
            )}
        </div>
    );
}