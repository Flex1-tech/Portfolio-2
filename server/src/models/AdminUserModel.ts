/**
 * Admin User Model and Authentication
 */

import { db } from "../config/database.js";
import bcryptjs from "bcryptjs";
import type { AdminUser } from "../types/index.js";

export class AdminUserModel {
  /**
   * Create a new admin user
   */
  static create(username: string, password: string, email?: string): AdminUser {
    const passwordHash = bcryptjs.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO admin_users (username, password_hash, email)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(username, passwordHash, email || null);

    return {
      id: result.lastInsertRowid as number,
      username,
      email,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Get user by username
   */
  static getByUsername(username: string): AdminUser | null {
    const stmt = db.prepare("SELECT * FROM admin_users WHERE username = ?");
    return (stmt.get(username) as AdminUser) || null;
  }

  /**
   * Get user by ID
   */
  static getById(id: number): AdminUser | null {
    const stmt = db.prepare("SELECT * FROM admin_users WHERE id = ?");
    return (stmt.get(id) as AdminUser) || null;
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
  static updatePassword(id: number, newPassword: string): boolean {
    const passwordHash = bcryptjs.hashSync(newPassword, 10);
    const stmt = db.prepare(
      "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    const result = stmt.run(passwordHash, id);
    return result.changes > 0;
  }

  /**
   * Update last login
   */
  static updateLastLogin(id: number): void {
    const stmt = db.prepare(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
    );
    stmt.run(id);
  }

  /**
   * Check if username exists
   */
  static usernameExists(username: string, excludeId?: number): boolean {
    let query = "SELECT COUNT(*) as count FROM admin_users WHERE username = ?";
    const params: any[] = [username];

    if (excludeId !== undefined) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const { count } = db.prepare(query).get(...params) as { count: number };
    return count > 0;
  }

  /**
   * Get all admin users (admin panel)
   */
  static getAll(): AdminUser[] {
    const stmt = db.prepare(
      "SELECT id, username, email, last_login, created_at, updated_at FROM admin_users",
    );
    return stmt.all() as AdminUser[];
  }

  /**
   * Delete admin user
   */
  static delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM admin_users WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
