from flask import Flask
from flask_cors import CORS
from app.core.imageHandler import ImageHandler
import asyncio

app = Flask(__name__)
CORS(app)




@app.route("/")
def index():
    collections = ["437316", "1155333"]
    handler =  ImageHandler(collections)
    handler.startLoop()

    return "hi"
