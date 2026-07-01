/**
 * Project Model and Database Operations
 */

import { pool } from "../config/database.js";
import type { Project } from "../types/index.js";

export class ProjectModel {
 /**
 * Create a new project
 */
 static async create(
 project: Omit<Project, "id" | "created_at" | "updated_at">,
 ): Promise<Project> {
 const result = await pool.query(
 `INSERT INTO projects (
 title, slug, short_desc, core_problem, technical_solution,
 tech_stack, github_link, live_demo_link, image_url, video_url, status
 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
 RETURNING *`,
 [
 project.title,
 project.slug,
 project.short_desc,
 project.core_problem,
 project.technical_solution,
 JSON.stringify(project.tech_stack),
 project.github_link || null,
 project.live_demo_link || null,
 project.image_url || null,
 project.video_url || null,
 project.status,
 ]
 );

 return {
 ...project,
 id: result.rows[0].id,
 created_at: result.rows[0].created_at,
 updated_at: result.rows[0].updated_at,
 };
 }

 /**
 * Get all projects
 */
 static async getAll(): Promise<Project[]> {
 const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
 return result.rows;
 }

 /**
 * Get paginated projects
 */
 static async getPaginated(
 page: number = 1,
 limit: number = 10,
 search?: string,
 ): Promise<{
 projects: Project[];
 total: number;
 page: number;
 pages: number;
 }> {
 const offset = (page - 1) * limit;

 let query = "SELECT * FROM projects";
 let countQuery = "SELECT COUNT(*) as count FROM projects";
 const params: any[] = [];
 const countParams: any[] = [];

 if (search) {
 query += " WHERE title LIKE $1 OR short_desc LIKE $2";
 countQuery += " WHERE title LIKE $1 OR short_desc LIKE $2";
 const searchPattern = `%${search}%`;
 params.push(searchPattern, searchPattern);
 countParams.push(searchPattern, searchPattern);
 }

 query += " ORDER BY created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
 params.push(limit, offset);

 const projectsResult = await pool.query(query, params);
 const countResult = await pool.query(countQuery, countParams);
 const total = parseInt(countResult.rows[0].count);

 return {
 projects: projectsResult.rows,
 total,
 page,
 pages: Math.ceil(total / limit),
 };
 }

 /**
 * Get project by ID
 */
 static async getById(id: number): Promise<Project | null> {
 const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
 return result.rows[0] || null;
 }

 /**
 * Get project by slug
 */
 static async getBySlug(slug: string): Promise<Project | null> {
 const result = await pool.query("SELECT * FROM projects WHERE slug = $1", [slug]);
 return result.rows[0] || null;
 }

 /**
 * Update project
 */
 static async update(id: number, updates: Partial<Project>): Promise<Project | null> {
 const project = await this.getById(id);
 if (!project) return null;

 const fields = [];
 const values = [];
 let paramIndex = 1;

 if (updates.title !== undefined) {
 fields.push(`title = $${paramIndex++}`);
 values.push(updates.title);
 }
 if (updates.short_desc !== undefined) {
 fields.push(`short_desc = $${paramIndex++}`);
 values.push(updates.short_desc);
 }
 if (updates.core_problem !== undefined) {
 fields.push(`core_problem = $${paramIndex++}`);
 values.push(updates.core_problem);
 }
 if (updates.technical_solution !== undefined) {
 fields.push(`technical_solution = $${paramIndex++}`);
 values.push(updates.technical_solution);
 }
 if (updates.tech_stack !== undefined) {
 fields.push(`tech_stack = $${paramIndex++}`);
 values.push(JSON.stringify(updates.tech_stack));
 }
 if (updates.github_link !== undefined) {
 fields.push(`github_link = $${paramIndex++}`);
 values.push(updates.github_link || null);
 }
 if (updates.live_demo_link !== undefined) {
 fields.push(`live_demo_link = $${paramIndex++}`);
 values.push(updates.live_demo_link || null);
 }
 if (updates.image_url !== undefined) {
 fields.push(`image_url = $${paramIndex++}`);
 values.push(updates.image_url || null);
 }
 if (updates.video_url !== undefined) {
 fields.push(`video_url = $${paramIndex++}`);
 values.push(updates.video_url || null);
 }
 if (updates.status !== undefined) {
 fields.push(`status = $${paramIndex++}`);
 values.push(updates.status);
 }

 if (fields.length === 0) return project;

 fields.push(`updated_at = CURRENT_TIMESTAMP`);
 values.push(id);

 const query = `UPDATE projects SET ${fields.join(", ")} WHERE id = $${paramIndex}`;
 await pool.query(query, values);

 return this.getById(id);
 }

 /**
 * Delete project
 */
 static async delete(id: number): Promise<boolean> {
 const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
 return (result.rowCount || 0) > 0;
 }

 /**
 * Check if slug is unique
 */
 static async isSlugUnique(slug: string, excludeId?: number): Promise<boolean> {
 let query = "SELECT COUNT(*) as count FROM projects WHERE slug = $1";
 const params: any[] = [slug];

 if (excludeId !== undefined) {
 query += " AND id != $2";
 params.push(excludeId);
 }

 const result = await pool.query(query, params);
 const count = parseInt(result.rows[0].count);
 return count === 0;
 }
}
