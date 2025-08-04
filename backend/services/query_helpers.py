import asyncio
from db.connection import get_connection
import psycopg2
from psycopg2.extras import DictCursor
from typing import List



def make_nearby_query(table: str, columns: List[str], radius: int) -> str:
    column_str = ", ".join(columns)
    return f"""
        SELECT {column_str}, ST_AsGeoJSON(geometry)::json AS geometry
        FROM {table}
        WHERE ST_DWithin(geometry::geography, ST_GeogFromText(%s), {radius});
    """

async def query_nearby_async(sql: str, point_wkt: str) -> list[dict]:
    def _query():
        conn = get_connection()
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(sql, (point_wkt,))
            return cur.fetchall()
    return await asyncio.to_thread(_query)

def query_nearby(sql: str, point_wkt: str) -> list[dict]:
    conn = get_connection()
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(sql, (point_wkt,))
        return cur.fetchall()