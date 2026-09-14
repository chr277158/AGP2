import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL est manquante dans le fichier .env');
}

const sqlitePath = 'agp.sqlite';
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

const sqlite = new DatabaseSync(sqlitePath);

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function normalizeSqliteType(type) {
  const raw = String(type || '').trim();
  if (!raw) return 'TEXT';
  if (/^INTEGER|INT$/i.test(raw)) return 'INTEGER';
  if (/^REAL|FLOAT|DOUBLE/i.test(raw)) return 'DOUBLE PRECISION';
  if (/^NUMERIC|DECIMAL/i.test(raw)) return 'NUMERIC';
  if (/^BOOLEAN/i.test(raw)) return 'BOOLEAN';
  if (/^BLOB/i.test(raw)) return 'BYTEA';
  if (/^DATE|TIMESTAMP/i.test(raw)) return 'TIMESTAMP';
  return 'TEXT';
}

function normalizeValue(value) {
  if (value === undefined) return null;
  if (typeof value === 'number' && Number.isNaN(value)) return null;
  if (value === null) return null;
  if (typeof value === 'boolean') return value;
  if (Buffer.isBuffer(value)) return value;
  return value;
}

function renderColumn(column) {
  const columnName = quoteIdentifier(column.name);
  const type = normalizeSqliteType(column.type);
  const isPk = Number(column.pk) > 0;
  let sql = `${columnName} ${type}`;

  if (isPk) {
    sql += ' PRIMARY KEY';
  }

  if (Number(column.notnull) === 1 && !isPk) {
    sql += ' NOT NULL';
  }

  if (column.dflt_value !== null && column.dflt_value !== undefined && column.dflt_value !== '') {
    const defaultValue = String(column.dflt_value).trim();
    const defaultExpression = defaultValue === 'NULL' ? 'NULL' : defaultValue;
    sql += ` DEFAULT ${defaultExpression}`;
  }

  return sql;
}

async function ensureTable(tableName) {
  const tableInfo = sqlite.prepare(`PRAGMA table_info(${quoteIdentifier(tableName)})`).all();
  if (!tableInfo.length) {
    return;
  }

  const columns = tableInfo.map(renderColumn);
  const createTableSql = `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(tableName)} (${columns.join(', ')});`;
  await pool.query(createTableSql);
}

async function importTable(tableName) {
  const rows = sqlite.prepare(`SELECT * FROM ${quoteIdentifier(tableName)}`).all();
  if (!rows.length) {
    return;
  }

  const columns = Object.keys(rows[0]);
  const columnList = columns.map((column) => quoteIdentifier(column)).join(', ');
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  const insertSql = `INSERT INTO ${quoteIdentifier(tableName)} (${columnList}) VALUES (${placeholders});`;

  for (const row of rows) {
    const values = columns.map((column) => normalizeValue(row[column]));
    await pool.query(insertSql, values);
  }
}

async function main() {
  const tables = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all()
    .map((row) => row.name);

  for (const table of tables) {
    await ensureTable(table);
    await pool.query(`TRUNCATE TABLE ${quoteIdentifier(table)} RESTART IDENTITY CASCADE;`);
    await importTable(table);
    console.log(`Import OK: ${table}`);
  }

  console.log(`Migration terminée. ${tables.length} table(s) importée(s).`);
}

try {
  await main();
} catch (error) {
  console.error('Erreur pendant la migration :', error);
  process.exitCode = 1;
} finally {
  await pool.end();
  sqlite.close();
}
