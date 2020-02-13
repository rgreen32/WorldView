import requests
import os
import datetime
import time
import sqlite3

class ImageHandler:
    def __init__(self, collections):
        self.key = os.getenv("WORLDVIEW_API_KEY")
        self.images = []
        self.collections = collections
        self.unsplashURL = "https://api.unsplash.com/photos/random/?collections=" + ",".join(collections) + "&client_id=" + self.key

    def fetchImage(self):
        res = requests.get(self.unsplashURL).json()
        if(res["location"]["position"]["latitude"] != None and res["location"]["position"]["longitude"] != None ):
            return {"url": res["urls"]["regular"],"gps":res["location"]["position"]}
        else:
            return None
            
    
    def startLoop(self):
        print("Starting main loop...")
        api_requests = 0
        while(True):
            if(api_requests > 10):
                print(self.images)
                conn = sqlite3.connect("index.db")
                c = conn.cursor()
                image = self.images[0]
                c.execute("INSERT INTO Images VALUES(?, ?, ? )", (image.url, image.gps.latitude, image.gps.longitude))
                conn.commit()
                conn.close()
                time.sleep(1800)
            imgData = self.fetchImage()
            api_requests+=1
            if(imgData != None):
                self.images.append(imgData)
            


