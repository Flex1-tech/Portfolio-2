/**
 * Script: Run Migrations
 * Initialize the database schema
 * Usage: npm run migrate
 */

import { initializeDatabase } from "../config/database.js";

async function main() {
 try {
 console.log(" Running migrations...\n");
 initializeDatabase();
 console.log("\n All migrations completed successfully");
 process.exit(0);
 } catch (error) {
 console.error(" Migration error:", error);
 process.exit(1);
 }
}

main();
