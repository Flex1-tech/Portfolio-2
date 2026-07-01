/**
 * Database Configuration & Initialization
 * Handles PostgreSQL database connection and setup
 */

import "dotenv/config";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
export const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 // Supabase pooler requires SSL in all environments (including dev)
 ssl: { rejectUnauthorized: false },
});

/**
 * Initialize database schema
 */
export async function initializeDatabase(): Promise<void> {
 try {
 // Create projects table
 await pool.query(`
 CREATE TABLE IF NOT EXISTS projects (
 id SERIAL PRIMARY KEY,
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 short_desc TEXT NOT NULL,
 core_problem TEXT NOT NULL,
 technical_solution TEXT NOT NULL,
 tech_stack TEXT NOT NULL,
 github_link TEXT,
 live_demo_link TEXT,
 image_url TEXT,
 video_url TEXT,
 status TEXT CHECK(status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'completed',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 // Create events table
 await pool.query(`
 CREATE TABLE IF NOT EXISTS events (
 id SERIAL PRIMARY KEY,
 title TEXT NOT NULL,
 organization TEXT NOT NULL,
 year TEXT NOT NULL,
 role TEXT CHECK(role IN ('participant', 'mentor', 'speaker')) NOT NULL,
 description TEXT NOT NULL,
 image_url TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 // Create certifications table
 await pool.query(`
 CREATE TABLE IF NOT EXISTS certifications (
 id SERIAL PRIMARY KEY,
 platform TEXT NOT NULL,
 title TEXT NOT NULL,
 status TEXT CHECK(status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'completed',
 credential_url TEXT,
 image_url TEXT,
 date_earned DATE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 // Create admin users table for authentication
 await pool.query(`
 CREATE TABLE IF NOT EXISTS admin_users (
 id SERIAL PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 email TEXT UNIQUE,
 last_login TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 console.log(" Database schema initialized successfully");
 } catch (error) {
 console.error(" Error initializing database schema:", error);
 throw error;
 }
}

/**
 * Get database connection pool
 */
export function getDatabase(): Pool {
 return pool;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
 await pool.end();
 console.log(" Database connection closed");
}
