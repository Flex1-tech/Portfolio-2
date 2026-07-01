/**
 * Event Model and Database Operations
 */

import { pool } from "../config/database.js";
import type { Event } from "../types/index.js";

export class EventModel {
 /**
 * Create a new event
 */
 static async create(event: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
 const result = await pool.query(
 `INSERT INTO events (title, organization, year, role, description, image_url)
 VALUES ($1, $2, $3, $4, $5, $6)
 RETURNING *`,
 [
 event.title,
 event.organization,
 event.year,
 event.role,
 event.description,
 event.image_url || null,
 ]
 );

 return {
 ...event,
 id: result.rows[0].id,
 created_at: result.rows[0].created_at,
 updated_at: result.rows[0].updated_at,
 };
 }

 /**
 * Get all events
 */
 static async getAll(): Promise<Event[]> {
 const result = await pool.query(
 "SELECT * FROM events ORDER BY year DESC, created_at DESC"
 );
 return result.rows;
 }

 /**
 * Get paginated events
 */
 static async getPaginated(
 page: number = 1,
 limit: number = 10,
 ): Promise<{
 events: Event[];
 total: number;
 page: number;
 pages: number;
 }> {
 const offset = (page - 1) * limit;
 const countResult = await pool.query("SELECT COUNT(*) as count FROM events");
 const total = parseInt(countResult.rows[0].count);

 const result = await pool.query(
 "SELECT * FROM events ORDER BY year DESC, created_at DESC LIMIT $1 OFFSET $2",
 [limit, offset]
 );

 return {
 events: result.rows,
 total,
 page,
 pages: Math.ceil(total / limit),
 };
 }

 /**
 * Get event by ID
 */
 static async getById(id: number): Promise<Event | null> {
 const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
 return result.rows[0] || null;
 }

 /**
 * Update event
 */
 static async update(id: number, updates: Partial<Event>): Promise<Event | null> {
 const event = await this.getById(id);
 if (!event) return null;

 const fields = [];
 const values = [];
 let paramIndex = 1;

 if (updates.title !== undefined) {
 fields.push(`title = $${paramIndex++}`);
 values.push(updates.title);
 }
 if (updates.organization !== undefined) {
 fields.push(`organization = $${paramIndex++}`);
 values.push(updates.organization);
 }
 if (updates.year !== undefined) {
 fields.push(`year = $${paramIndex++}`);
 values.push(updates.year);
 }
 if (updates.role !== undefined) {
 fields.push(`role = $${paramIndex++}`);
 values.push(updates.role);
 }
 if (updates.description !== undefined) {
 fields.push(`description = $${paramIndex++}`);
 values.push(updates.description);
 }
 if (updates.image_url !== undefined) {
 fields.push(`image_url = $${paramIndex++}`);
 values.push(updates.image_url || null);
 }

 if (fields.length === 0) return event;

 fields.push(`updated_at = CURRENT_TIMESTAMP`);
 values.push(id);

 const query = `UPDATE events SET ${fields.join(", ")} WHERE id = $${paramIndex}`;
 await pool.query(query, values);

 return this.getById(id);
 }

 /**
 * Delete event
 */
 static async delete(id: number): Promise<boolean> {
 const result = await pool.query("DELETE FROM events WHERE id = $1", [id]);
 return (result.rowCount || 0) > 0;
 }

 /**
 * Get events by role
 */
 static async getByRole(role: "participant" | "mentor" | "speaker"): Promise<Event[]> {
 const result = await pool.query(
 "SELECT * FROM events WHERE role = $1 ORDER BY year DESC",
 [role]
 );
 return result.rows;
 }
}
