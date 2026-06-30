/**
 * Main Application Entry Point
 * Initializes Express server with all middleware and routes
 */

import "dotenv/config";
import express, { Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { initializeDatabase } from "./config/database.js";
import { errorHandler, notFound } from "./middleware/index.js";
import apiRoutes from "./routes/api.js";
import adminAuthRoutes from "./routes/admin-auth.js";
import adminCrudRoutes from "./routes/admin-crud.js";

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy for Render
app.set("trust proxy", 1);

// ============================================================================
// Security & Middleware Setup
// ============================================================================

// Initialize database
initializeDatabase();

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
app.use(
  session({
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

// Logging
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// ============================================================================
// Routes
// ============================================================================

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Public API routes
app.use("/api", apiRoutes);

// Admin authentication routes
app.use("/admin", adminAuthRoutes);

// Admin CRUD routes (protected)
app.use("/admin", adminCrudRoutes);

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// ============================================================================
// Server Start
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Portfolio Backend Server Running    ║
╠════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(27)}║
║  Port: ${String(PORT).padEnd(36)}║
║  API: http://localhost:${String(PORT).padEnd(23)}║
╚════════════════════════════════════════╝
  `);

  if (NODE_ENV === "development") {
    console.log("📚 API Documentation:");
    console.log(
      "  Public API: GET /api/projects, /api/events, /api/certifications",
    );
    console.log("  Admin Auth: POST /admin/login, /admin/logout");
    console.log(
      "  Admin CRUD: POST/GET/PUT/DELETE /admin/projects|events|certifications",
    );
    console.log("");
  }
});

export default app;
