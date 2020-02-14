import sqlite3
from app.utils import cursor_to_dict
class ImageHandler:
    def __init__(self):
        self.randomImageQuery = "SELECT * FROM Images ORDER BY RANDOM() LIMIT 8;"
    
    def grabRandomImages(self):
        conn = sqlite3.connect("index.db")
        c = conn.cursor()
        c.execute(self.randomImageQuery)
        records = cursor_to_dict(c)
        return records

