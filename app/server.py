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

@app.route("/worldview/download", methods=["POST"])
def download():
    json = request.get_json()
    image_id = json["image_id"]
    image_url = json["image_url"]
    imagebytes = None
    try:
        requests.get("https://api.unsplash.com/photos/" + image_id + "/download?client_id=" + api_key)
        imagebytes = requests.get(image_url).content
    except Exception as e:
        logger.warn(e)

    return Response(headers={"Content-Disposition": "attachment", "Content-Type": "application/octet-stream"}, response=imagebytes)