/**
 * Database Configuration & Initialization
 * Handles SQLite database connection and setup
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.DATABASE_PATH ||
  (process.env.RENDER ? "/opt/render/project/data/portfolio.db" : path.join(__dirname, "..", "..", "data", "portfolio.db"));

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
export const db: Database.Database = new Database(DB_PATH, { verbose: console.log });

// Enable foreign keys
db.pragma("foreign_keys = ON");

/**
 * Initialize database schema
 */
export function initializeDatabase(): void {
  try {
    // Create projects table
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        short_desc TEXT NOT NULL,
        core_problem TEXT NOT NULL,
        technical_solution TEXT NOT NULL,
        tech_stack TEXT NOT NULL,
        github_link TEXT,
        live_demo_link TEXT,
        status TEXT CHECK(status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        year TEXT NOT NULL,
        role TEXT CHECK(role IN ('participant', 'mentor', 'speaker')) NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create certifications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT CHECK(status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'completed',
        credential_url TEXT,
        date_earned DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin users table for authentication
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✓ Database schema initialized successfully");
  } catch (error) {
    console.error("✗ Error initializing database schema:", error);
    throw error;
  }
}

/**
 * Get database connection
 */
export function getDatabase(): Database.Database {
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  db.close();
  console.log("✓ Database connection closed");
}
