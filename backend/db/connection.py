import os
import psycopg2

def get_connection():
    host = os.getenv("POSTGRES_HOST", "postgis")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    db   = os.getenv("POSTGRES_DB", "gisdb3")
    user = os.getenv("POSTGRES_USER", "gisuser")
    pwd  = os.getenv("POSTGRES_PASSWORD", "gispass")

    return psycopg2.connect(
        host=host,
        port=port,
        dbname=db,
        user=user,
        password=pwd,
        connect_timeout=5,
    )
