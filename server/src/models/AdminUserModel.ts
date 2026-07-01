/**
 * Admin User Model and Authentication
 */

import { pool } from "../config/database.js";
import bcryptjs from "bcryptjs";
import type { AdminUser } from "../types/index.js";

export class AdminUserModel {
 /**
 * Create a new admin user
 */
 static async create(username: string, password: string, email?: string): Promise<AdminUser> {
 const passwordHash = bcryptjs.hashSync(password, 10);

 const result = await pool.query(
 `INSERT INTO admin_users (username, password_hash, email)
 VALUES ($1, $2, $3)
 RETURNING *`,
 [username, passwordHash, email || null]
 );

 return {
 id: result.rows[0].id,
 username,
 email,
 created_at: result.rows[0].created_at,
 };
 }

 /**
 * Get user by username
 */
 static async getByUsername(username: string): Promise<AdminUser | null> {
 const result = await pool.query("SELECT * FROM admin_users WHERE username = $1", [username]);
 return result.rows[0] || null;
 }

 /**
 * Get user by ID
 */
 static async getById(id: number): Promise<AdminUser | null> {
 const result = await pool.query("SELECT * FROM admin_users WHERE id = $1", [id]);
 return result.rows[0] || null;
 }

 /**
 * Verify password
 */
 static verifyPassword(
 hashedPassword: string,
 plainPassword: string,
 ): boolean {
 return bcryptjs.compareSync(plainPassword, hashedPassword);
 }

 /**
 * Update password
 */
 static async updatePassword(id: number, newPassword: string): Promise<boolean> {
 const passwordHash = bcryptjs.hashSync(newPassword, 10);
 const result = await pool.query(
 "UPDATE admin_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
 [passwordHash, id]
 );
 return (result.rowCount || 0) > 0;
 }

 /**
 * Update last login
 */
 static async updateLastLogin(id: number): Promise<void> {
 await pool.query(
 "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
 [id]
 );
 }

 /**
 * Check if username exists
 */
 static async usernameExists(username: string, excludeId?: number): Promise<boolean> {
 let query = "SELECT COUNT(*) as count FROM admin_users WHERE username = $1";
 const params: any[] = [username];

 if (excludeId !== undefined) {
 query += " AND id != $2";
 params.push(excludeId);
 }

 const result = await pool.query(query, params);
 const count = parseInt(result.rows[0].count);
 return count > 0;
 }

 /**
 * Get all admin users (admin panel)
 */
 static async getAll(): Promise<AdminUser[]> {
 const result = await pool.query(
 "SELECT id, username, email, last_login, created_at, updated_at FROM admin_users"
 );
 return result.rows;
 }

 /**
 * Delete admin user
 */
 static async delete(id: number): Promise<boolean> {
 const result = await pool.query("DELETE FROM admin_users WHERE id = $1", [id]);
 return (result.rowCount || 0) > 0;
 }
}
