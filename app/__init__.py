from flask import Flask
from flask_cors import CORS
import logging

logger = logging.getLogger("worldview")

app = Flask(__name__)
CORS(app)

from app import server