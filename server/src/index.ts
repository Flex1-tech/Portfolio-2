/**
 * Main Application Entry Point
 * Bootstraps database initialization and starts HTTP server
 */

import "dotenv/config";
import app from "./app.js";
import { initializeDatabase } from "./config/database.js";
import { AdminUserModel } from "./models/AdminUserModel.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize database and auto-seed admin
async function initializeApp() {
  await initializeDatabase();

  // Auto-seed admin if table is empty (Crucial for Render Free Tier)
  try {
    const adminExists = (await AdminUserModel.getAll()).length > 0;

    if (!adminExists) {
      console.log(" Admin table is empty. Attempting to auto-seed first admin...");
      const defaultUsername = process.env.ADMIN_USERNAME || "admin";
      const defaultPassword = process.env.ADMIN_PASSWORD;
      const defaultEmail = process.env.ADMIN_EMAIL || undefined;

      if (defaultPassword && defaultPassword.length >= 8) {
        if (!(await AdminUserModel.usernameExists(defaultUsername))) {
          await AdminUserModel.create(defaultUsername, defaultPassword, defaultEmail);
          console.log(` Successfully created default admin: ${defaultUsername}`);
        }
      } else {
        console.warn("️ Admin table is empty but ADMIN_PASSWORD is not set or too short in Render environment variables!");
      }
    }
  } catch (seedError) {
    console.error(" Failed to auto-seed admin user:", seedError);
  }
}

if (process.env.NODE_ENV !== "test") {
  initializeApp()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║ Portfolio Backend Server Running       ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(27)}║
║ Port: ${String(PORT).padEnd(36)}║
║ API: http://localhost:${String(PORT).padEnd(23)}║
╚════════════════════════════════════════╝
        `);

        if (NODE_ENV === "development") {
          console.log(" API Documentation:");
          console.log(
            " Public API: GET /api/projects, /api/events, /api/certifications",
          );
          console.log(" Admin Auth: POST /admin/login, /admin/logout");
          console.log(
            " Admin CRUD: POST/GET/PUT/DELETE /admin/projects|events|certifications",
          );
          console.log(" LLMs.txt: GET /llms.txt, /llms-full.txt");
          console.log("");
        }
      });
    })
    .catch((err) => {
      console.error("Failed to start server due to database initialization error:", err);
      process.exit(1);
    });
}

export default app;

