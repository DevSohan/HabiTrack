import psycopg2
import psycopg2.extras

def get_connection():
    return psycopg2.connect(
        dbname="gisdb",
        user="gisuser",
        password="gispass",
        host="localhost",
        port="5432"
    )