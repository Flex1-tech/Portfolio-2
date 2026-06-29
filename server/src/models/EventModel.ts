/**
 * Event Model and Database Operations
 */

import { db } from "../config/database.js";
import type { Event } from "../types/index.js";

export class EventModel {
  /**
   * Create a new event
   */
  static create(event: Omit<Event, "id" | "created_at" | "updated_at">): Event {
    const stmt = db.prepare(`
      INSERT INTO events (title, organization, year, role, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      event.title,
      event.organization,
      event.year,
      event.role,
      event.description,
    );

    return {
      ...event,
      id: result.lastInsertRowid as number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Get all events
   */
  static getAll(): Event[] {
    const stmt = db.prepare(
      "SELECT * FROM events ORDER BY year DESC, created_at DESC",
    );
    return stmt.all() as Event[];
  }

  /**
   * Get paginated events
   */
  static getPaginated(
    page: number = 1,
    limit: number = 10,
  ): {
    events: Event[];
    total: number;
    page: number;
    pages: number;
  } {
    const offset = (page - 1) * limit;
    const countStmt = db.prepare("SELECT COUNT(*) as count FROM events");
    const { count } = countStmt.get() as { count: number };

    const stmt = db.prepare(
      "SELECT * FROM events ORDER BY year DESC, created_at DESC LIMIT ? OFFSET ?",
    );
    const events = stmt.all(limit, offset) as Event[];

    return {
      events,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    };
  }

  /**
   * Get event by ID
   */
  static getById(id: number): Event | null {
    const stmt = db.prepare("SELECT * FROM events WHERE id = ?");
    return (stmt.get(id) as Event) || null;
  }

  /**
   * Update event
   */
  static update(id: number, updates: Partial<Event>): Event | null {
    const event = this.getById(id);
    if (!event) return null;

    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.organization !== undefined) {
      fields.push("organization = ?");
      values.push(updates.organization);
    }
    if (updates.year !== undefined) {
      fields.push("year = ?");
      values.push(updates.year);
    }
    if (updates.role !== undefined) {
      fields.push("role = ?");
      values.push(updates.role);
    }
    if (updates.description !== undefined) {
      fields.push("description = ?");
      values.push(updates.description);
    }

    if (fields.length === 0) return event;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  /**
   * Delete event
   */
  static delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM events WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Get events by role
   */
  static getByRole(role: "participant" | "mentor" | "speaker"): Event[] {
    const stmt = db.prepare(
      "SELECT * FROM events WHERE role = ? ORDER BY year DESC",
    );
    return stmt.all(role) as Event[];
  }
}
