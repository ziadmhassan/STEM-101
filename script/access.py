from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

daily_access_count = 0
last_access_date = datetime.now().date()

@app.route('/set_access_count')
def set_access_count():
    global daily_access_count
    global last_access_date
    current_date = datetime.now().date()
    if current_date > last_access_date:
        daily_access_count = 1
        last_access_date = current_date
    else:
        daily_access_count += 1
    return jsonify({"result": 1})

@app.route('/get_access_count')
def get_access_count():
    return jsonify({'daily_access_count': daily_access_count})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
