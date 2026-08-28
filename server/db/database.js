import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { supabase, isSupabaseReady } from './supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'school.db');
const db = new sqlite3.Database(dbPath);

// Helper promise wrapper for sqlite queries with Supabase fallback/sync
export const query = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database tables & seed initial data
export const initDb = async () => {
  if (isSupabaseReady()) {
    console.log('[Supabase Cloud] Đã kích hoạt cơ sở dữ liệu Supabase: https://miufsostxxqeoeljwzmi.supabase.co');
  }

  db.serialize(async () => {
    // 1. Users table (Supports Admin account granting & Member registration approval)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'GIAO_VIEN',
        email TEXT,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT
      )
    `);

    // 3. Articles (Tin tức - Sự kiện) table
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        categoryId INTEGER,
        categoryName TEXT,
        summary TEXT,
        content TEXT,
        image TEXT,
        fileUrl TEXT DEFAULT '',
        externalLink TEXT DEFAULT '',
        author TEXT DEFAULT 'Ban Biên Tập THCS Đồng Tân',
        isFeatured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 120,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    // 4. Documents (Văn bản chỉ đạo) table
    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'Thông tư BGD&ĐT',
        issueDate TEXT NOT NULL,
        signer TEXT,
        fileUrl TEXT DEFAULT '',
        externalLink TEXT DEFAULT '',
        views INTEGER DEFAULT 4500,
        downloads INTEGER DEFAULT 1700,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Media Videos table
    db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        youtubeId TEXT NOT NULL,
        thumbnailUrl TEXT,
        externalLink TEXT DEFAULT '',
        views INTEGER DEFAULT 890,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. School Announcements table
    db.run(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        link TEXT,
        priority INTEGER DEFAULT 1,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Thư viện Albums ảnh (albums) table
    db.run(`
      CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT DEFAULT '08/08/2026',
        photosCount INTEGER DEFAULT 10,
        cover TEXT DEFAULT '',
        description TEXT DEFAULT '',
        fileUrl TEXT DEFAULT '',
        externalLink TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed initial users if empty
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
      if (!err && row.count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          `INSERT INTO users (username, password, fullName, role, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
          ['admin', hashedPassword, 'Thầy Hiệu Trưởng - THCS Đồng Tân', 'BGH', 'bgh.thcsdongtan@langson.edu.vn', 'ACTIVE']
        );
        db.run(
          `INSERT INTO users (username, password, fullName, role, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
          ['giaovien', hashedPassword, 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', 'GIAO_VIEN', 'hoanguyen@thcsdongtan.edu.vn', 'ACTIVE']
        );
        db.run(
          `INSERT INTO users (username, password, fullName, role, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
          ['hocsinh01', hashedPassword, 'Em Nguyễn Văn An - Học sinh 9A1', 'HOC_SINH', 'an.nguyen@thcsdongtan.edu.vn', 'PENDING']
        );
      }
    });

    // Seed initial Categories if empty
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (!err && row.count === 0) {
        const categories = [
          { name: 'Tin tức - Sự kiện', slug: 'tin-tuc-su-kien', icon: 'Newspaper' },
          { name: 'Hoạt động chuyên môn', slug: 'hoat-dong-chuyen-mon', icon: 'BookOpen' },
          { name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', icon: 'Users' },
          { name: 'Hoạt động ngoại khóa', slug: 'hoat-dong-ngoai-khoa', icon: 'Sparkles' },
          { name: 'Câu lạc bộ', slug: 'cau-lac-bo', icon: 'Trophy' }
        ];
        categories.forEach(c => {
          db.run(`INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)`, [c.name, c.slug, c.icon]);
        });
      }
    });

    // Seed initial Albums if empty
    db.get('SELECT COUNT(*) as count FROM albums', (err, row) => {
      if (!err && row && row.count === 0) {
        db.run(
          `INSERT INTO albums (title, date, photosCount, cover, description) VALUES (?, ?, ?, ?, ?)`,
          [
            'Album: Lễ Khai giảng năm học 2026 - 2027 THCS Đồng Tân',
            '05/09/2026',
            18,
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
            'Hình ảnh rực rỡ cờ hoa trong ngày hội Khai trường chào đón các em học sinh khối 6 mới trúng tuyển.'
          ]
        );
      }
    });
  });
};

export default db;
