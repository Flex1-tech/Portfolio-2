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
 order_index INTEGER DEFAULT 0,
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
 order_index INTEGER DEFAULT 0,
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
 order_index INTEGER DEFAULT 0,
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

 // Create profile_settings key-value table
 await pool.query(`
 CREATE TABLE IF NOT EXISTS profile_settings (
 key VARCHAR(100) PRIMARY KEY,
 value TEXT NOT NULL
 )
 `);

 // Alter existing tables to add order_index if they don't have it
 await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0`);
 await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0`);
 await pool.query(`ALTER TABLE certifications ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0`);

 // Seed default profile values (safe: ON CONFLICT DO NOTHING)
 await pool.query(`
 INSERT INTO profile_settings (key, value) VALUES
 ('username', 'Seth N. AKPLOGAN'),
 ('hero_title', 'Étudiant en Intelligence Artificielle & Data Scientist'),
 ('hero_bio', 'Second-year student in Artificial Intelligence at IFRI, Université d''Abomey-Calavi. I focus on Machine Learning, Deep Learning, and Data Science — turning complex problems into software that works.'),
 ('citation_text', 'La simplicité est la sophistication suprême.'),
 ('citation_author', 'Léonard de Vinci'),
 ('academic_status', 'LICENCE IN ARTIFICIAL INTELLIGENCE'),
 ('academic_institution', 'IFRI — Université d''Abomey-Calavi'),
 ('academic_period', '2024 – Present | 2nd Year'),
 ('hero_label', 'IFRI — UNIVERSITÉ D''ABOMEY-CALAVI'),
 ('hero_punchline', 'Building reliable and intelligent software that delivers measurable real-world value.'),
 ('about_para2', 'From music recommendation engines using MusiCNN and ONNX to secure multi-channel authentication systems, I build at the intersection of research and production.'),
 ('about_para3', 'Active in Benin''s AI community through IndabaX and BWAI. I mentor new students and contribute to open-source projects that demystify machine learning.'),
 ('hero_cta_primary', 'Discover My Projects'),
 ('hero_cta_secondary', 'Download CV'),
 ('contact_bio', 'I''m open to collaborations, internships, and research opportunities in AI and software engineering.'),
 ('contact_email', 'sethakplogan@gmail.com'),
 ('contact_linkedin', 'linkedin.com/in/seth-akplogan'),
 ('contact_github', 'github.com/Flex1-tech'),
 ('contact_footer_tagline', 'Built with discipline & code.')
 ON CONFLICT (key) DO NOTHING
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
