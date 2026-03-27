import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'integr8.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS drills (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      style       TEXT    NOT NULL DEFAULT 'General',
      focus       TEXT    NOT NULL,
      difficulty  TEXT    NOT NULL DEFAULT 'beginner',
      duration    INTEGER NOT NULL DEFAULT 5,
      instructions TEXT   NOT NULL DEFAULT '',
      equipment   TEXT    NOT NULL DEFAULT '',
      createdAt   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plans (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT    NOT NULL,
      coachName       TEXT    NOT NULL,
      location        TEXT    NOT NULL,
      ageGroup        TEXT    NOT NULL,
      style           TEXT    NOT NULL,
      quarterlyTheme  TEXT    NOT NULL,
      classDuration   INTEGER NOT NULL DEFAULT 60,
      focusNotes      TEXT    NOT NULL DEFAULT '',
      phases          TEXT    NOT NULL DEFAULT '[]',
      status          TEXT    NOT NULL DEFAULT 'draft',
      weekStart       TEXT    NOT NULL,
      submittedAt     TEXT,
      approvedAt      TEXT,
      createdAt       TEXT    NOT NULL DEFAULT (datetime('now')),
      updatedAt       TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
