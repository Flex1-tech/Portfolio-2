/**
 * Article Model and Database Operations
 */

import { pool } from "../config/database.js";
import type { Article } from "../types/index.js";

export class ArticleModel {
  /**
   * Create a new article
   */
  static async create(
    article: Omit<Article, "id" | "created_at" | "updated_at">,
  ): Promise<Article> {
    const result = await pool.query(
      `INSERT INTO articles (
        title, slug, summary, content, image_url, image_alt,
        published_at, order_index, seo_title, seo_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        article.title,
        article.slug,
        article.summary,
        article.content,
        article.image_url || null,
        article.image_alt || null,
        article.published_at || null,
        article.order_index || 0,
        article.seo_title || null,
        article.seo_description || null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all published articles
   */
  static async getPublished(): Promise<Article[]> {
    const result = await pool.query(
      "SELECT * FROM articles WHERE published_at IS NOT NULL AND published_at <= NOW() ORDER BY order_index ASC, published_at DESC"
    );
    return result.rows;
  }

  /**
   * Get all articles (including drafts)
   */
  static async getAll(): Promise<Article[]> {
    const result = await pool.query(
      "SELECT * FROM articles ORDER BY order_index ASC, created_at DESC"
    );
    return result.rows;
  }

  /**
   * Get paginated articles
   */
  static async getPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: 'published' | 'draft' | 'all'
  ): Promise<{
    articles: Article[];
    total: number;
    page: number;
    pages: number;
  }> {
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM articles";
    let countQuery = "SELECT COUNT(*) as count FROM articles";
    const params: any[] = [];
    const countParams: any[] = [];

    // Filter by status
    if (status === 'published') {
      query += " WHERE published_at IS NOT NULL AND published_at <= NOW()";
      countQuery += " WHERE published_at IS NOT NULL AND published_at <= NOW()";
    } else if (status === 'draft') {
      query += " WHERE published_at IS NULL OR published_at > NOW()";
      countQuery += " WHERE published_at IS NULL OR published_at > NOW()";
    }

    // Add search filter
    if (search) {
      const searchCondition = status === 'all' ? " WHERE" : " AND";
      query += `${searchCondition} (title LIKE $${params.length + 1} OR summary LIKE $${params.length + 2})`;
      countQuery += `${searchCondition} (title LIKE $${countParams.length + 1} OR summary LIKE $${countParams.length + 2})`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    query += " ORDER BY order_index ASC, created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
    params.push(limit, offset);

    const articlesResult = await pool.query(query, params);
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      articles: articlesResult.rows,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get article by ID
   */
  static async getById(id: number): Promise<Article | null> {
    const result = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  /**
   * Get article by slug
   */
  static async getBySlug(slug: string): Promise<Article | null> {
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [slug]);
    return result.rows[0] || null;
  }

  /**
   * Get published article by slug
   */
  static async getPublishedBySlug(slug: string): Promise<Article | null> {
    const result = await pool.query(
      "SELECT * FROM articles WHERE slug = $1 AND published_at IS NOT NULL AND published_at <= NOW()",
      [slug]
    );
    return result.rows[0] || null;
  }

  /**
   * Update article
   */
  static async update(id: number, updates: Partial<Article>): Promise<Article | null> {
    const article = await this.getById(id);
    if (!article) return null;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.slug !== undefined) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(updates.slug);
    }
    if (updates.summary !== undefined) {
      fields.push(`summary = $${paramIndex++}`);
      values.push(updates.summary);
    }
    if (updates.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(updates.content);
    }
    if (updates.image_url !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(updates.image_url || null);
    }
    if (updates.image_alt !== undefined) {
      fields.push(`image_alt = $${paramIndex++}`);
      values.push(updates.image_alt || null);
    }
    if (updates.published_at !== undefined) {
      fields.push(`published_at = $${paramIndex++}`);
      values.push(updates.published_at || null);
    }
    if (updates.order_index !== undefined) {
      fields.push(`order_index = $${paramIndex++}`);
      values.push(updates.order_index);
    }
    if (updates.seo_title !== undefined) {
      fields.push(`seo_title = $${paramIndex++}`);
      values.push(updates.seo_title || null);
    }
    if (updates.seo_description !== undefined) {
      fields.push(`seo_description = $${paramIndex++}`);
      values.push(updates.seo_description || null);
    }

    if (fields.length === 0) return article;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE articles SET ${fields.join(", ")} WHERE id = $${paramIndex}`;
    await pool.query(query, values);

    return this.getById(id);
  }

  /**
   * Delete article
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Reorder articles (bulk update order_index)
   */
  static async reorder(items: { id: number; order_index: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      for (const item of items) {
        await client.query(
          "UPDATE articles SET order_index = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
          [item.order_index, item.id]
        );
      }
      
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if slug is unique
   */
  static async isSlugUnique(slug: string, excludeId?: number): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM articles WHERE slug = $1";
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
