import sqlite3
from app.utils import cursor_to_dict
import os
class ImageHandler:
    def __init__(self):
        self.randomImageQuery = "SELECT * FROM Images WHERE disabled = 0 ORDER BY RANDOM() LIMIT (?)"
    
    def grabRandomImages(self, numberOfImages):
        conn = sqlite3.connect(os.getenv("DBFILE_PATH"))
        c = conn.cursor()
        c.execute(self.randomImageQuery, (numberOfImages,))
        records = cursor_to_dict(c)
        return records

