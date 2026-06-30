/**
 * Certification Model and Database Operations
 */

import { db } from "../config/database.js";
import type { Certification } from "../types/index.js";

export class CertificationModel {
 /**
 * Create a new certification
 */
 static create(
 cert: Omit<Certification, "id" | "created_at" | "updated_at">,
 ): Certification {
 const stmt = db.prepare(`
 INSERT INTO certifications (platform, title, status, credential_url, date_earned)
 VALUES (?, ?, ?, ?, ?)
 `);

 const result = stmt.run(
 cert.platform,
 cert.title,
 cert.status,
 cert.credential_url || null,
 cert.date_earned || null,
 );

 return {
 ...cert,
 id: result.lastInsertRowid as number,
 created_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 };
 }

 /**
 * Get all certifications
 */
 static getAll(): Certification[] {
 const stmt = db.prepare(
 "SELECT * FROM certifications ORDER BY date_earned DESC, created_at DESC",
 );
 return stmt.all() as Certification[];
 }

 /**
 * Get paginated certifications
 */
 static getPaginated(
 page: number = 1,
 limit: number = 10,
 ): {
 certifications: Certification[];
 total: number;
 page: number;
 pages: number;
 } {
 const offset = (page - 1) * limit;
 const countStmt = db.prepare(
 "SELECT COUNT(*) as count FROM certifications",
 );
 const { count } = countStmt.get() as { count: number };

 const stmt = db.prepare(
 "SELECT * FROM certifications ORDER BY date_earned DESC, created_at DESC LIMIT ? OFFSET ?",
 );
 const certifications = stmt.all(limit, offset) as Certification[];

 return {
 certifications,
 total: count,
 page,
 pages: Math.ceil(count / limit),
 };
 }

 /**
 * Get certification by ID
 */
 static getById(id: number): Certification | null {
 const stmt = db.prepare("SELECT * FROM certifications WHERE id = ?");
 return (stmt.get(id) as Certification) || null;
 }

 /**
 * Update certification
 */
 static update(
 id: number,
 updates: Partial<Certification>,
 ): Certification | null {
 const cert = this.getById(id);
 if (!cert) return null;

 const fields = [];
 const values = [];

 if (updates.platform !== undefined) {
 fields.push("platform = ?");
 values.push(updates.platform);
 }
 if (updates.title !== undefined) {
 fields.push("title = ?");
 values.push(updates.title);
 }
 if (updates.status !== undefined) {
 fields.push("status = ?");
 values.push(updates.status);
 }
 if (updates.credential_url !== undefined) {
 fields.push("credential_url = ?");
 values.push(updates.credential_url || null);
 }
 if (updates.date_earned !== undefined) {
 fields.push("date_earned = ?");
 values.push(updates.date_earned || null);
 }

 if (fields.length === 0) return cert;

 fields.push("updated_at = CURRENT_TIMESTAMP");
 values.push(id);

 const query = `UPDATE certifications SET ${fields.join(", ")} WHERE id = ?`;
 db.prepare(query).run(...values);

 return this.getById(id);
 }

 /**
 * Delete certification
 */
 static delete(id: number): boolean {
 const stmt = db.prepare("DELETE FROM certifications WHERE id = ?");
 const result = stmt.run(id);
 return result.changes > 0;
 }

 /**
 * Get certifications by status
 */
 static getByStatus(status: "in_progress" | "completed"): Certification[] {
 const stmt = db.prepare(
 "SELECT * FROM certifications WHERE status = ? ORDER BY date_earned DESC",
 );
 return stmt.all(status) as Certification[];
 }
}
