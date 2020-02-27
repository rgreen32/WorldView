from flask import Flask, jsonify, send_file
from flask_cors import CORS
app = Flask(__name__)
CORS(app)