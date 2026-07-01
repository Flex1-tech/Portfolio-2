/**
 * Script: Initialize Admin User
 * Run this to create the first admin account
 * Usage: npm run init-admin
 */

import { AdminUserModel } from "../models/AdminUserModel.js";
import { initializeDatabase } from "../config/database.js";
import readline from "readline";

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
});

function prompt(question: string): Promise<string> {
 return new Promise((resolve) => {
 rl.question(question, (answer: string) => {
 resolve(answer);
 });
 });
}

async function main() {
 try {
 console.log(" Admin User Initialization\n");

 // Initialize database
 await initializeDatabase();

 // Get username
 const username = await prompt("Enter admin username: ");
 if (!username.trim()) {
 console.log(" Username cannot be empty");
 process.exit(1);
 }

 // Check if username already exists
 if (await AdminUserModel.usernameExists(username)) {
 console.log(" Username already exists");
 process.exit(1);
 }

 // Get password
 const password = await prompt("Enter admin password (min 8 characters): ");
 if (password.length < 8) {
 console.log(" Password must be at least 8 characters");
 process.exit(1);
 }

 const confirmPassword = await prompt("Confirm password: ");
 if (password !== confirmPassword) {
 console.log(" Passwords do not match");
 process.exit(1);
 }

 // Get email (optional)
 const email = await prompt("Enter admin email (optional): ");

 // Create admin user
 const user = await AdminUserModel.create(username, password, email || undefined);
 console.log("\n Admin user created successfully");
 console.log(` Username: ${user.username}`);
 console.log(` Email: ${user.email || "Not set"}`);
 console.log(` ID: ${user.id}`);

 rl.close();
 process.exit(0);
 } catch (error) {
 console.error("Error initializing admin user:", error);
 rl.close();
 process.exit(1);
 }
}

main();
