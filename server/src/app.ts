/**
 * Express Application Configuration
 * Configures middleware, sessions, and routes without starting HTTP server or DB connection
 */

import "dotenv/config";
import express, { Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import connectPgSimple from "connect-pg-simple";

import { pool } from "./config/database.js";
import { errorHandler, notFound } from "./middleware/index.js";
import apiRoutes from "./routes/api.js";
import adminAuthRoutes from "./routes/admin-auth.js";
import adminCrudRoutes from "./routes/admin-crud.js";
import sitemapRoutes from "./routes/sitemap.js";
import llmsRoutes from "./routes/llms.js";

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy for Render
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "https://seth-akplogan.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Session configuration
// Use PostgreSQL store in production/development, or MemoryStore in test environment
let sessionStore: session.Store | undefined;

if (NODE_ENV !== "test") {
  const PgStore = connectPgSimple(session);
  sessionStore = new PgStore({
    pool,
    createTableIfMissing: true,
  });
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: NODE_ENV === "production" ? ("none" as const) : ("strict" as const),
    },
  }),
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Compression
app.use(compression());

// Logging (skip during testing to keep test output clean)
if (NODE_ENV !== "test") {
  app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
}

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Dynamic sitemap
app.use("/", sitemapRoutes);

// LLMs.txt — AI-readable portfolio data (llmstxt.org standard)
app.use("/", llmsRoutes);

// Public API routes
app.use("/api", apiRoutes);

// Admin authentication routes
app.use("/admin", adminAuthRoutes);

// Admin CRUD routes (protected)
app.use("/admin", adminCrudRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
