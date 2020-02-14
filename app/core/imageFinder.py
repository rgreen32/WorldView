import requests
import os
import datetime
import time
import sqlite3

class ImageFinder:
    def __init__(self, collections):
        self.key = os.getenv("API_KEY")
        self.images = []
        self.collections = collections
        self.unsplashURL = "https://api.unsplash.com/photos/random/?collections=" + ",".join(collections) + "&client_id=" + self.key

    def fetchImage(self):
        res = requests.get(self.unsplashURL).json()
        if(res["location"]["position"]["latitude"] != None and res["location"]["position"]["longitude"] != None ):
            return {"url": res["urls"]["regular"],"location":res["location"]["name"] ,"gps":res["location"]["position"], "userName": res["user"]["name"], "portfolio":res["user"]["portfolio_url"], "unsplash_profile":res["user"]["links"]["html"]}
        else:
            return None
            
    
    def startLoop(self):
        print("Starting main loop...")
        api_requests = 0
        while(True):
            if(api_requests > 7):
                tuples = []
                for image in self.images:
                    tuples.append((image["url"], image["location"], image["gps"]["latitude"], image["gps"]["longitude"], image["userName"], image["portfolio"], image["unsplash_profile"]))
                print(tuples)
                conn = sqlite3.connect("index.db")
                try:
                    c = conn.cursor()
                    c.executemany("INSERT INTO Images VALUES(?, ?, ?, ?, ?, ?, ?)", tuples)
                    conn.commit()
                except Exception as e:
                    print(e)
                finally:
                    conn.close()
                    self.images = []
                print("imageFinder is sleeping...")
                time.sleep(1800)
                print("imageFinder is awake...")
            imgData = self.fetchImage()
            api_requests+=1
            if(imgData != None):
                self.images.append(imgData)
            time.sleep(1)
            


