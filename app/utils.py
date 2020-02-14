def cursor_to_dict(cursor):
    results = []
    columns = [desc[0] for desc in cursor.description]
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    return results