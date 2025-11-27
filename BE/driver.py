from flask import Flask, jsonify, request, abort, send_from_directory
from flask_cors import CORS
from datetime import datetime, timezone
import os
import json

from blueprints import resources_app

app = Flask(__name__)
app.register_blueprint(resources_app, url_prefix="/api")

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)