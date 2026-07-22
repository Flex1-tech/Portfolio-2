import { Router, Request, Response } from "express";
import { ArticleModel } from "../models/ArticleModel.js";

const router = Router();
const BASE_URL = process.env.PUBLIC_URL || "https://seth-akplogan.onrender.com";

interface SitemapPage {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

/**
 * GET /sitemap.xml
 * Dynamic XML sitemap generation
 */
router.get("/sitemap.xml", async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await ArticleModel.getAll();

    const staticPages: SitemapPage[] = [
      { url: "/", changefreq: "weekly", priority: 1.0 },
      { url: "/articles", changefreq: "daily", priority: 0.8 },
    ];

    const articlePages: SitemapPage[] = articles.map((article) => {
      const dateVal = article.updated_at || article.created_at || new Date().toISOString();
      return {
        url: `/articles/${article.slug}`,
        lastmod: new Date(dateVal).toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.7,
      };
    });

    const allPages: SitemapPage[] = [...staticPages, ...articlePages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
