import sqlite3
import os
from app import logger

def cursor_to_dict(cursor):
    results = []
    columns = [desc[0] for desc in cursor.description]
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    return results

def ensure_schema():
    logger.info("ensuring schema")
    sql = read_sql_file("./app/sql/images_table.sql")
    conn = sqlite3.connect(os.getenv("DBFILE_PATH"))
    c = conn.cursor()
    c.execute("SELECT sql FROM sqlite_master WHERE name = 'Images'")
    result = c.fetchone()
    if result != None:
        curent_schema_sql = result[0].replace(" ","")
        new_schema_sql = sql.replace(" ", "").replace(";","")
        if curent_schema_sql != new_schema_sql:
            c.execute("DROP TABLE Images")
            c.execute(sql)
    else:
        c.execute(sql)
    conn.close()


def read_sql_file(filename: str) -> str:
    fd = open(filename, 'r')
    sql = fd.read().replace('\n', '')
    fd.close()
    return sql