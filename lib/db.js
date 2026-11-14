import { neon } from '@neondatabase/serverless';

let _sql;

export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquant dans Vercel');
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

export async function ensureSchema() {
  const sql = db();
  await sql.query(`CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    source_id TEXT NOT NULL,
    source TEXT NOT NULL,
    regions TEXT NOT NULL,
    topics TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    lang TEXT NOT NULL DEFAULT 'fr'
  )`);
  await sql.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS lang TEXT NOT NULL DEFAULT 'fr'`);
  await sql.query(`CREATE INDEX IF NOT EXISTS articles_pub_idx ON articles (published_at DESC, id DESC)`);
  await sql.query(`CREATE TABLE IF NOT EXISTS source_status (
    source_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ok BOOLEAN NOT NULL,
    last_ok TIMESTAMPTZ,
    last_error TEXT,
    items INT NOT NULL DEFAULT 0,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await sql.query(`CREATE TABLE IF NOT EXISTS tips (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    platform TEXT NOT NULL DEFAULT 'autre',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
}
