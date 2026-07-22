/**
 * LLMs.txt Routes
 *
 * Implements the llms.txt standard (https://llmstxt.org) to make this portfolio
 * easily understandable by AI assistants, LLM-powered search engines, and
 * generative AI tools (ChatGPT, Claude, Gemini, Perplexity, Copilot…).
 *
 * Routes:
 *   GET /llms.txt       — Concise overview (summary card format)
 *   GET /llms-full.txt  — Complete dataset pulled from the live database
 */

import { Router, Request, Response } from "express";
import { ProfileModel } from "../models/ProfileModel.js";
import { ProjectModel } from "../models/ProjectModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
import { EventModel } from "../models/EventModel.js";

const router = Router();

const BASE_URL = process.env.PUBLIC_URL || "https://seth-akplogan.onrender.com";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip Markdown formatting for plain-text output */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")     // headings
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1")    // italic
    .replace(/`(.+?)`/g, "$1")      // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/^\s*[-*+]\s+/gm, "• ") // unordered lists
    .replace(/^\s*\d+\.\s+/gm, "• ") // ordered lists
    .replace(/\n{3,}/g, "\n\n")      // collapse excess newlines
    .trim();
}

/** Truncate a string to a max length with ellipsis */
function truncate(text: string, max: number): string {
  if (!text) return "";
  const clean = stripMarkdown(text);
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

/** Format a date string to a human-readable short date */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return dateStr;
  }
}

// ─── GET /llms.txt ────────────────────────────────────────────────────────────

/**
 * Concise summary — respects the llms.txt specification.
 * Provides AI assistants with a structured, scannable overview of the portfolio.
 * Content uses static fallbacks if the database profile is not populated.
 */
router.get("/llms.txt", async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await ProfileModel.getAll();

    const name = profile.username || "Seth N. AKPLOGAN";
    const title = profile.hero_label || "AI & Data Science Student";
    const bio = profile.hero_bio || profile.hero_punchline ||
      "Building reliable and intelligent software at the intersection of AI, data, and software engineering.";
    const email = profile.contact_email || "";
    const linkedin = profile.contact_linkedin || "https://linkedin.com/in/seth-akplogan";
    const github = profile.contact_github || "https://github.com/Flex1-tech";
    const institution = profile.academic_institution || "IFRI — Université d'Abomey-Calavi";
    const period = profile.academic_period || "";

    const text = `# ${name}

> ${title}

## About

${truncate(bio, 400)}

${institution}${period ? ` (${period})` : ""}

## Expertise

- Artificial Intelligence & Machine Learning
- Data Science & Statistical Analysis
- Full-Stack Software Engineering
- Deep Learning & Neural Networks
- Natural Language Processing

## Key Technologies

Python, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy,
React, TypeScript, Node.js, Express, PostgreSQL, Docker

## Portfolio Sections

- Home: ${BASE_URL}/
- Articles & Research: ${BASE_URL}/articles
- Projects: ${BASE_URL}/#projects
- Certifications: ${BASE_URL}/#certifications
- Contact: ${BASE_URL}/#contact

## Links

- Portfolio: ${BASE_URL}
- GitHub: ${github}
- LinkedIn: ${linkedin}${email ? `\n- Email: ${email}` : ""}

## About This File

This file follows the llms.txt standard (https://llmstxt.org).
It is generated dynamically from the portfolio CMS.
Full dataset available at: ${BASE_URL}/llms-full.txt
`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache 1 hour
    res.send(text.trim());
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    res.status(500).setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("Error generating llms.txt");
  }
});

// ─── GET /llms-full.txt ───────────────────────────────────────────────────────

/**
 * Complete dataset — all CMS content formatted for AI consumption.
 * Automatically stays in sync with the admin dashboard.
 */
router.get("/llms-full.txt", async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all data in parallel
    const [profile, projects, articles, certifications, events] = await Promise.all([
      ProfileModel.getAll(),
      ProjectModel.getAll(),
      ArticleModel.getAll(),
      CertificationModel.getAll(),
      EventModel.getAll(),
    ]);

    const name = profile.username || "Seth N. AKPLOGAN";
    const title = profile.hero_label || "AI & Data Science Student";
    const bio = profile.hero_bio || profile.hero_punchline || "";
    const about2 = profile.about_para2 || "";
    const about3 = profile.about_para3 || "";
    const citation = profile.citation_text || "";
    const citationAuthor = profile.citation_author || "";
    const email = profile.contact_email || "";
    const linkedin = profile.contact_linkedin || "https://linkedin.com/in/seth-akplogan";
    const github = profile.contact_github || "https://github.com/Flex1-tech";
    const institution = profile.academic_institution || "IFRI — Université d'Abomey-Calavi";
    const period = profile.academic_period || "";
    const contactBio = profile.contact_bio || "";

    // ── Sections ──────────────────────────────────────────────────────────────

    const sections: string[] = [];

    // Header
    sections.push(`# ${name} — Complete Portfolio Data`);
    sections.push(`> Generated: ${new Date().toISOString()}`);
    sections.push(`> Source: ${BASE_URL}/llms-full.txt`);
    sections.push(`> Summary: ${BASE_URL}/llms.txt`);

    // ── Profile ───────────────────────────────────────────────────────────────
    sections.push(`\n${"─".repeat(60)}\n## PROFILE\n${"─".repeat(60)}`);
    sections.push(`Name: ${name}`);
    sections.push(`Title: ${title}`);
    sections.push(`Institution: ${institution}${period ? ` (${period})` : ""}`);
    if (bio) sections.push(`\nBio:\n${truncate(bio, 600)}`);
    if (about2) sections.push(`\n${truncate(about2, 400)}`);
    if (about3) sections.push(`\n${truncate(about3, 400)}`);
    if (citation) sections.push(`\nCitation: "${citation}"${citationAuthor ? ` — ${citationAuthor}` : ""}`);

    // ── Contact ───────────────────────────────────────────────────────────────
    sections.push(`\n${"─".repeat(60)}\n## CONTACT & LINKS\n${"─".repeat(60)}`);
    sections.push(`Portfolio: ${BASE_URL}`);
    sections.push(`GitHub: ${github}`);
    sections.push(`LinkedIn: ${linkedin}`);
    if (email) sections.push(`Email: ${email}`);
    if (contactBio) sections.push(`\n${truncate(contactBio, 200)}`);

    // ── Projects ──────────────────────────────────────────────────────────────
    sections.push(`\n${"─".repeat(60)}\n## PROJECTS (${projects.length})\n${"─".repeat(60)}`);

    if (projects.length === 0) {
      sections.push("No projects published yet.");
    } else {
      for (const project of projects) {
        const tech = Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : "";
        sections.push(`\n### ${project.title}`);
        sections.push(`Status: ${project.status === "completed" ? "Completed" : "In Progress"}`);
        if (project.short_desc) sections.push(`Description: ${truncate(project.short_desc, 300)}`);
        if (project.core_problem) sections.push(`Problem: ${truncate(project.core_problem, 300)}`);
        if (project.technical_solution) sections.push(`Solution: ${truncate(project.technical_solution, 300)}`);
        if (tech) sections.push(`Technologies: ${tech}`);
        if (project.github_link) sections.push(`GitHub: ${project.github_link}`);
        if (project.live_demo_link) sections.push(`Demo: ${project.live_demo_link}`);
      }
    }

    // ── Articles ──────────────────────────────────────────────────────────────
    const publishedArticles = articles.filter((a) => a.published_at);
    sections.push(`\n${"─".repeat(60)}\n## ARTICLES (${publishedArticles.length} published)\n${"─".repeat(60)}`);

    if (publishedArticles.length === 0) {
      sections.push("No articles published yet.");
    } else {
      for (const article of publishedArticles) {
        sections.push(`\n### ${article.title}`);
        sections.push(`URL: ${BASE_URL}/articles/${article.slug}`);
        if (article.published_at) sections.push(`Published: ${formatDate(article.published_at)}`);
        if (article.summary) sections.push(`Summary: ${truncate(article.summary, 300)}`);
        // Include article body content for AI indexing (first 800 chars)
        if (article.content) {
          const preview = truncate(article.content, 800);
          sections.push(`Content preview:\n${preview}`);
        }
      }
    }

    // ── Certifications ────────────────────────────────────────────────────────
    const completedCerts = certifications.filter((c) => c.status === "completed");
    sections.push(`\n${"─".repeat(60)}\n## CERTIFICATIONS (${completedCerts.length} obtained)\n${"─".repeat(60)}`);

    if (completedCerts.length === 0) {
      sections.push("No certifications listed yet.");
    } else {
      for (const cert of completedCerts) {
        sections.push(`\n### ${cert.title}`);
        sections.push(`Issuer: ${cert.platform}`);
        if (cert.date_earned) sections.push(`Date: ${formatDate(cert.date_earned)}`);
        if (cert.credential_url) sections.push(`Credential: ${cert.credential_url}`);
      }
    }

    // ── Events ────────────────────────────────────────────────────────────────
    if (events.length > 0) {
      sections.push(`\n${"─".repeat(60)}\n## EVENTS & COMMUNITY (${events.length})\n${"─".repeat(60)}`);

      for (const event of events) {
        sections.push(`\n### ${event.title}`);
        sections.push(`Organization: ${event.organization}`);
        sections.push(`Year: ${event.year}`);
        sections.push(`Role: ${event.role.charAt(0).toUpperCase() + event.role.slice(1)}`);
        if (event.description) sections.push(`Description: ${truncate(event.description, 300)}`);
      }
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    sections.push(`\n${"─".repeat(60)}`);
    sections.push(`Generated by: ${name} Portfolio CMS`);
    sections.push(`Standard: https://llmstxt.org`);
    sections.push(`Last updated: ${new Date().toUTCString()}`);

    const fullText = sections.join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800"); // Cache 30 minutes
    res.send(fullText);
  } catch (error) {
    console.error("Error generating llms-full.txt:", error);
    res.status(500).setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("Error generating llms-full.txt");
  }
});

export default router;
