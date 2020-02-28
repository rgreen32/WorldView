from flask import jsonify
from flask_cors import CORS
from app.core.imageFinder import ImageFinder
from app.core.imageHandler import ImageHandler
import threading

from app import app

def thread_function():
    collections = ["641217" "228275", "370126", "3129418"]
    finder = ImageFinder(collections)
    finder.startLoop()

imageFinderThread =  threading.Thread(target=thread_function)
imageFinderThread.start()

imageHandler = ImageHandler()

@app.route("/worldview/images")
def index():
    images = imageHandler.grabRandomImages("15")
    return jsonify(images)
