from flask import jsonify
from flask_cors import CORS
from app.core.imageFinder import ImageFinder
from app.core.imageHandler import ImageHandler
import threading
import os
import sentry_sdk
from app.utils import ensure_schema

from app import app
environment = os.getenv("ENVIRONMENT")
sentry_sdk.init(os.getenv("SENTRY_DSN"), environment=environment)

ensure_schema()

def thread_function():
    collections = os.getenv("COLLECTIONS")
    finder = ImageFinder(collections)
    finder.startLoop()

imageFinderThread =  threading.Thread(target=thread_function)
imageFinderThread.start()

imageHandler = ImageHandler()

@app.route("/worldview/images")
def index():
    images = imageHandler.grabRandomImages("15")
    return jsonify(images)
