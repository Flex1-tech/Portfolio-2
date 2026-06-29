/**
 * Project Model and Database Operations
 */

import { db } from "../config/database.js";
import type { Project } from "../types/index.js";

export class ProjectModel {
  /**
   * Create a new project
   */
  static create(
    project: Omit<Project, "id" | "created_at" | "updated_at">,
  ): Project {
    const stmt = db.prepare(`
      INSERT INTO projects (
        title, slug, short_desc, core_problem, technical_solution, 
        tech_stack, github_link, live_demo_link, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      project.title,
      project.slug,
      project.short_desc,
      project.core_problem,
      project.technical_solution,
      JSON.stringify(project.tech_stack),
      project.github_link || null,
      project.live_demo_link || null,
      project.status,
    );

    return {
      ...project,
      id: result.lastInsertRowid as number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Get all projects
   */
  static getAll(): Project[] {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC");
    return stmt.all() as any[];
  }

  /**
   * Get paginated projects
   */
  static getPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): {
    projects: Project[];
    total: number;
    page: number;
    pages: number;
  } {
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM projects";
    let countQuery = "SELECT COUNT(*) as count FROM projects";
    const params: any[] = [];

    if (search) {
      query += " WHERE title LIKE ? OR short_desc LIKE ?";
      countQuery += " WHERE title LIKE ? OR short_desc LIKE ?";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const projects = db.prepare(query).all(...params) as Project[];
    const { count } = db.prepare(countQuery).get(...params.slice(0, -2)) as {
      count: number;
    };

    return {
      projects,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    };
  }

  /**
   * Get project by ID
   */
  static getById(id: number): Project | null {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    return (stmt.get(id) as Project) || null;
  }

  /**
   * Get project by slug
   */
  static getBySlug(slug: string): Project | null {
    const stmt = db.prepare("SELECT * FROM projects WHERE slug = ?");
    return (stmt.get(slug) as Project) || null;
  }

  /**
   * Update project
   */
  static update(id: number, updates: Partial<Project>): Project | null {
    const project = this.getById(id);
    if (!project) return null;

    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.short_desc !== undefined) {
      fields.push("short_desc = ?");
      values.push(updates.short_desc);
    }
    if (updates.core_problem !== undefined) {
      fields.push("core_problem = ?");
      values.push(updates.core_problem);
    }
    if (updates.technical_solution !== undefined) {
      fields.push("technical_solution = ?");
      values.push(updates.technical_solution);
    }
    if (updates.tech_stack !== undefined) {
      fields.push("tech_stack = ?");
      values.push(JSON.stringify(updates.tech_stack));
    }
    if (updates.github_link !== undefined) {
      fields.push("github_link = ?");
      values.push(updates.github_link || null);
    }
    if (updates.live_demo_link !== undefined) {
      fields.push("live_demo_link = ?");
      values.push(updates.live_demo_link || null);
    }
    if (updates.status !== undefined) {
      fields.push("status = ?");
      values.push(updates.status);
    }

    if (fields.length === 0) return project;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const query = `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  /**
   * Delete project
   */
  static delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Check if slug is unique
   */
  static isSlugUnique(slug: string, excludeId?: number): boolean {
    let query = "SELECT COUNT(*) as count FROM projects WHERE slug = ?";
    const params: any[] = [slug];

    if (excludeId !== undefined) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const { count } = db.prepare(query).get(...params) as { count: number };
    return count === 0;
  }
}
