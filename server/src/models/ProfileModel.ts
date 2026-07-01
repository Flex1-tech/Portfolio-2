/**
 * Profile Settings Model
 * Key-value store for all portfolio-wide editable content
 */

import { pool } from "../config/database.js";

export type ProfileSettings = Record<string, string>;

export class ProfileModel {
  /** Get all settings as a key-value object */
  static async getAll(): Promise<ProfileSettings> {
    const result = await pool.query("SELECT key, value FROM profile_settings ORDER BY key");
    const settings: ProfileSettings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    return settings;
  }

  /** Get a single value by key */
  static async get(key: string): Promise<string | null> {
    const result = await pool.query(
      "SELECT value FROM profile_settings WHERE key = $1",
      [key]
    );
    return result.rows[0]?.value ?? null;
  }

  /** Upsert a single key */
  static async set(key: string, value: string): Promise<void> {
    await pool.query(
      `INSERT INTO profile_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, value]
    );
  }

  /** Bulk upsert — accepts an object of { key: value } pairs */
  static async setMany(updates: ProfileSettings): Promise<ProfileSettings> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return this.getAll();

    // Build a VALUES list with parameters
    const values: string[] = [];
    const params: string[] = [];
    entries.forEach(([key, value], i) => {
      params.push(key, value);
      values.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
    });

    await pool.query(
      `INSERT INTO profile_settings (key, value) VALUES ${values.join(", ")}
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      params
    );

    return this.getAll();
  }
}
