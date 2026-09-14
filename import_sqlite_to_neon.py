import sqlite3
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

dsn = os.getenv("DATABASE_URL")
if not dsn:
    raise RuntimeError("DATABASE_URL manquant dans .env")

sqlite_db = os.path.join(os.getcwd(), "agp.sqlite")
if not os.path.exists(sqlite_db):
    raise FileNotFoundError(f"Base SQLite introuvable : {sqlite_db}")

def sqlite_type_to_pg(sqlite_type):
    t = (sqlite_type or "").upper().strip()
    if t.startswith("INT"):
        return "INTEGER"
    if t.startswith("REAL") or t.startswith("FLOAT") or t.startswith("DOUBLE"):
        return "DOUBLE PRECISION"
    if "BOOL" in t:
        return "BOOLEAN"
    if "BLOB" in t:
        return "BYTEA"
    if "CHAR" in t or "TEXT" in t or "CLOB" in t:
        return "TEXT"
    if "DATE" in t or "TIME" in t:
        return "TIMESTAMP"
    if "NUMERIC" in t or "DECIMAL" in t:
        return "NUMERIC"
    return "TEXT"

def list_tables(conn_sqlite):
    cur = conn_sqlite.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )
    return [row[0] for row in cur.fetchall()]

def list_columns(conn_sqlite, table):
    cur = conn_sqlite.execute(f'PRAGMA table_info("{table}")')
    return cur.fetchall()

def create_table(conn_pg, table, columns):
    defs = []
    for col in columns:
        _, name, ctype, notnull, dflt_value, pk = col
        pg_type = sqlite_type_to_pg(ctype)
        expr = f'"{name}" {pg_type}'
        if pk:
            expr += " PRIMARY KEY"
        elif notnull:
            expr += " NOT NULL"
        if dflt_value is not None and dflt_value != "":
            expr += f" DEFAULT {dflt_value}"
        defs.append(expr)

    ddl = f'CREATE TABLE IF NOT EXISTS "{table}" ({", ".join(defs)});'
    with conn_pg.cursor() as cur:
        cur.execute(ddl)

def import_table(conn_sqlite, conn_pg, table):
    cols = list_columns(conn_sqlite, table)
    names = [c[1] for c in cols]
    quoted = [f'"{n}"' for n in names]
    placeholders = ", ".join(["%s"] * len(names))
    sql = f'INSERT INTO "{table}" ({", ".join(quoted)}) VALUES ({placeholders})'

    rows = conn_sqlite.execute(f'SELECT * FROM "{table}"').fetchall()
    if not rows:
        return

    with conn_pg.cursor() as cur:
        for row in rows:
            cur.execute(sql, row)

def main():
    conn_sqlite = sqlite3.connect(sqlite_db)
    conn_pg = psycopg2.connect(dsn, sslmode='require')

    try:
        tables = list_tables(conn_sqlite)
        print("Tables SQLite :", tables)

        for table in tables:
            cols = list_columns(conn_sqlite, table)
            create_table(conn_pg, table, cols)
            with conn_pg.cursor() as cur:
                cur.execute(f'TRUNCATE TABLE "{table}" RESTART IDENTITY CASCADE;')
            import_table(conn_sqlite, conn_pg, table)
            print(f"Import OK : {table}")

        conn_pg.commit()
        print(f"Migration terminée : {len(tables)} tables importées.")
    finally:
        conn_pg.close()
        conn_sqlite.close()

if __name__ == "__main__":
    main()