import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'lottery.db')

const db = new Database(dbPath)

// 初始化数据库表
db.exec(`
  -- 主题表
  CREATE TABLE IF NOT EXISTS themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    password TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- 人员配置表
  CREATE TABLE IF NOT EXISTS person_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
  );

  -- 奖品配置表
  CREATE TABLE IF NOT EXISTS prize_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
  );

  -- 全局配置表
  CREATE TABLE IF NOT EXISTS global_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
  );

  -- 指纹记录表（防止重复加入）
  CREATE TABLE IF NOT EXISTS fingerprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    person_name TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(theme_id, fingerprint),
    FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
  );
`)

// 数据库迁移：为已存在的表添加新列
try {
  // 检查 themes 表是否有 password 列
  const tableInfo = db.prepare("PRAGMA table_info(themes)").all()
  const hasPassword = tableInfo.some(col => col.name === 'password')
  
  if (!hasPassword) {
    console.log('[DB] Adding password column to themes table...')
    db.exec("ALTER TABLE themes ADD COLUMN password TEXT DEFAULT ''")
    console.log('[DB] Password column added successfully')
  }
} catch (error) {
  console.error('[DB] Migration error:', error.message)
}

export default db
