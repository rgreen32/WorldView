import requests
import os
import datetime
import time
import sqlite3
from app import logger

class ImageFinder:
    def __init__(self, collections):
        self.key = os.getenv("WORLDVIEW_API_KEY")
        self.images = []
        self.collections = collections
        self.unsplashURL = "https://api.unsplash.com/photos/random/?collections=" + ",".join(collections) + "&orientation=landscape&count=30&client_id=" + self.key

    def fetchImage(self):
        res = requests.get(self.unsplashURL).json()
        images = []
        for image in res:
            if(image["location"]["position"]["latitude"] != None and image["location"]["position"]["longitude"] != None):
               images.append({"url": image["urls"]["regular"],"location":image["location"]["name"] ,"gps":image["location"]["position"], "userName": image["user"]["name"], "portfolio":image["user"]["portfolio_url"], "unsplash_profile":image["user"]["links"]["html"]})
        return images
            
    
    def startLoop(self):
        logger.info("Starting main loop...")
        api_requests = 0
        dbfile_path = os.getenv("DBFILE_PATH")
        while(True):
            # fetching from environment in loop to make the values hot-swappable.
            request_limit = int(os.getenv("REQUEST_LIMIT"))
            sleep_duration = int(os.getenv("IMAGEFINDER_SLEEP_DURATION_SECONDS"))
            if(api_requests >= request_limit):
                tuples = []
                for image in self.images:
                    tuples.append((image["url"], image["location"], image["gps"]["latitude"], image["gps"]["longitude"], image["userName"], image["portfolio"], image["unsplash_profile"]))
                conn = sqlite3.connect(dbfile_path)
                
                c = conn.cursor()
                logger.info("Saving images..")
                for image in tuples:
                    try:
                        c.execute("INSERT INTO Images VALUES(?, ?, ?, ?, ?, ?, ?)", image)
                        conn.commit()
                    except Exception as e:
                        logger.warn(e)
                conn.close()
                self.images = []
                logger.info("imageFinder is sleeping...")
                time.sleep(sleep_duration)
                logger.info("restarting request cycle...")
                api_requests = 0
            imgData = self.fetchImage()
            api_requests+=1
            if(imgData != None):
                self.images = self.images + imgData
            time.sleep(1)
            


