import requests
import os
import datetime
import time
import sqlite3

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
        print("Starting main loop...")
        api_requests = 0
        while(True):
            if(api_requests > 15):
                tuples = []
                for image in self.images:
                    tuples.append((image["url"], image["location"], image["gps"]["latitude"], image["gps"]["longitude"], image["userName"], image["portfolio"], image["unsplash_profile"]))
                print(tuples)
                conn = sqlite3.connect("index.db")
                
                c = conn.cursor()
                for image in tuples:
                    try:
                        c.execute("INSERT INTO Images VALUES(?, ?, ?, ?, ?, ?, ?)", image)
                        print(image)
                        conn.commit()
                    except Exception as e:
                        print(e)
                conn.close()
                self.images = []
                print("imageFinder is sleeping...")
                time.sleep(1800)
                print("imageFinder is awake...")
            imgData = self.fetchImage()
            api_requests+=1
            if(imgData != None):
                self.images = self.images + imgData
            time.sleep(1)
            


