/**
 * Certification Model and Database Operations
 */

import { pool } from "../config/database.js";
import type { Certification } from "../types/index.js";

export class CertificationModel {
 /**
 * Create a new certification
 */
 static async create(
 cert: Omit<Certification, "id" | "created_at" | "updated_at">,
 ): Promise<Certification> {
 const result = await pool.query(
 `INSERT INTO certifications (platform, title, status, credential_url, image_url, date_earned)
 VALUES ($1, $2, $3, $4, $5, $6)
 RETURNING *`,
 [
 cert.platform,
 cert.title,
 cert.status,
 cert.credential_url || null,
 cert.image_url || null,
 cert.date_earned || null,
 ]
 );

 return {
 ...cert,
 id: result.rows[0].id,
 created_at: result.rows[0].created_at,
 updated_at: result.rows[0].updated_at,
 };
 }

  /**
   * Get all certifications
   */
  static async getAll(): Promise<Certification[]> {
    const result = await pool.query(
      "SELECT * FROM certifications ORDER BY order_index ASC, date_earned DESC, created_at DESC"
    );
    return result.rows;
  }

  /**
   * Get paginated certifications
   */
  static async getPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    certifications: Certification[];
    total: number;
    page: number;
    pages: number;
  }> {
    const offset = (page - 1) * limit;
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM certifications"
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      "SELECT * FROM certifications ORDER BY order_index ASC, date_earned DESC, created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

 return {
 certifications: result.rows,
 total,
 page,
 pages: Math.ceil(total / limit),
 };
 }

 /**
 * Get certification by ID
 */
 static async getById(id: number): Promise<Certification | null> {
 const result = await pool.query("SELECT * FROM certifications WHERE id = $1", [id]);
 return result.rows[0] || null;
 }

 /**
 * Update certification
 */
 static async update(
 id: number,
 updates: Partial<Certification>,
 ): Promise<Certification | null> {
 const cert = await this.getById(id);
 if (!cert) return null;

 const fields = [];
 const values = [];
 let paramIndex = 1;

 if (updates.platform !== undefined) {
 fields.push(`platform = $${paramIndex++}`);
 values.push(updates.platform);
 }
 if (updates.title !== undefined) {
 fields.push(`title = $${paramIndex++}`);
 values.push(updates.title);
 }
 if (updates.status !== undefined) {
 fields.push(`status = $${paramIndex++}`);
 values.push(updates.status);
 }
 if (updates.credential_url !== undefined) {
 fields.push(`credential_url = $${paramIndex++}`);
 values.push(updates.credential_url || null);
 }
 if (updates.image_url !== undefined) {
 fields.push(`image_url = $${paramIndex++}`);
 values.push(updates.image_url || null);
 }
 if (updates.date_earned !== undefined) {
 fields.push(`date_earned = $${paramIndex++}`);
 values.push(updates.date_earned || null);
 }

 if (fields.length === 0) return cert;

 fields.push(`updated_at = CURRENT_TIMESTAMP`);
 values.push(id);

 const query = `UPDATE certifications SET ${fields.join(", ")} WHERE id = $${paramIndex}`;
 await pool.query(query, values);

 return this.getById(id);
 }

 /**
 * Delete certification
 */
 static async delete(id: number): Promise<boolean> {
 const result = await pool.query("DELETE FROM certifications WHERE id = $1", [id]);
 return (result.rowCount || 0) > 0;
 }

 /**
 * Get certifications by status
 */
 static async getByStatus(status: "in_progress" | "completed"): Promise<Certification[]> {
 const result = await pool.query(
 "SELECT * FROM certifications WHERE status = $1 ORDER BY date_earned DESC",
 [status]
 );
 return result.rows;
 }
}
