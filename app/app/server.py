from flask import jsonify, request, Response
from flask_cors import CORS
from app.core.imageFinder import ImageFinder
from app.core.imageHandler import ImageHandler
import requests
import threading
import os
import sentry_sdk
from app.utils import ensure_schema

from app import app

api_key = os.getenv("WORLDVIEW_API_KEY")
environment = os.getenv("ENVIRONMENT")
# sentry_sdk.init(os.getenv("SENTRY_DSN"), environment=environment, ignore_errors=["UNIQUE constraint failed:"])


ensure_schema()

def thread_function():
    collections = os.getenv("COLLECTIONS")
    finder = ImageFinder(collections)
    print("Starting image finder")
    finder.startLoop()

imageFinderThread = threading.Thread(target=thread_function)
imageFinderThread.start()

imageHandler = ImageHandler()

@app.route("/images")
def index():
    print("Hello")
    image_count = request.args["count"]
    images = imageHandler.grabRandomImages(image_count)
    return jsonify(images)

@app.route("/download", methods=["POST"])
def download():
    json = request.get_json()
    image_id = json["image_id"]
    try:
        requests.get("https://api.unsplash.com/photos/" + image_id + "/download?client_id=" + api_key)
    except Exception as e:
        Response(status=500)

    return Response(status=200)
