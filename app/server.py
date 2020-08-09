from flask import jsonify, request
from flask_cors import CORS
from app.core.imageFinder import ImageFinder
from app.core.imageHandler import ImageHandler
import threading
import os
import sentry_sdk
from app.utils import ensure_schema

from app import app
environment = os.getenv("ENVIRONMENT")
sentry_sdk.init(os.getenv("SENTRY_DSN"), environment=environment, ignore_errors=["UNIQUE constraint failed:"])

ensure_schema()

def thread_function():
    collections = os.getenv("COLLECTIONS")
    finder = ImageFinder(collections)
    finder.startLoop()

imageFinderThread = threading.Thread(target=thread_function)
imageFinderThread.start()

imageHandler = ImageHandler()

@app.route("/worldview/images")
def index():
    image_count = request.args["count"]
    images = imageHandler.grabRandomImages(image_count)
    return jsonify(images)
