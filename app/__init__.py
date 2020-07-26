from flask import Flask
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logger = logging.getLogger("worldview")

from app import server