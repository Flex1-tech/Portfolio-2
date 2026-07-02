/**
 * Script: Seed Database
 * Populate the database with sample data for testing
 * Usage: npm run seed
 */

import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
import { ProfileModel } from "../models/ProfileModel.js";
import { initializeDatabase, pool } from "../config/database.js";


// Note le async ici
async function seedProjects() {
  console.log(" Seeding projects...");

  const projects = [
    {
      title: "Music Recommendation Engine",
      slug: "music-recommendation-engine",
      short_desc: "AI-powered music recommendation system using audio embeddings and local inference",
      core_problem: "Recommending music locally without an internet connection while preserving user privacy.",
      technical_solution: "Built an audio embedding pipeline using MusiCNN and CNN14, optimized inference with ONNX, processed user profiles via NumPy, and integrated with VLC for local playback.",
      tech_stack: ["Python", "MusiCNN", "CNN14", "ONNX", "NumPy", "VLC"],
      github_link: "https://github.com/Flex1-tech",
      live_demo_link: "https://musirecommender.netlify.app/",
      status: "completed" as const,
    },
    {
      title: "2FA Multi-Channel System",
      slug: "2fa-multi-channel-system",
      short_desc: "Secure authentication system with dual-channel verification (email and WhatsApp)",
      core_problem: "Securing authentication in contexts where standard 2FA channels may be unreliable.",
      technical_solution: "Developed a secure Laravel module supporting dual-channel verification via email and WhatsApp API, with session management and token expiration.",
      tech_stack: ["Laravel", "PHP", "Email API", "WhatsApp API"],
      github_link: "https://github.com/Flex1-tech",
      live_demo_link: undefined,
      status: "completed" as const,
    },
    {
      title: "Carpooling Web App",
      slug: "carpooling-web-app",
      short_desc: "Full-stack platform connecting drivers and passengers for shared rides",
      core_problem: "Urban transportation inefficiency — drivers with empty seats and passengers have no easy way to connect.",
      technical_solution: "Full-stack Django platform with PostgreSQL, implementing driver-passenger matching, ride scheduling, and real-time availability.",
      tech_stack: ["Django", "Python", "PostgreSQL", "HTML/CSS"],
      github_link: "https://github.com/Flex1-tech",
      live_demo_link: undefined,
      status: "completed" as const,
    },
  ];

  // Utilisation d'une boucle for...of avec await pour attendre Supabase
  for (const project of projects) {
    await ProjectModel.create(project);
  }

  console.log(` ${projects.length} projects seeded`);
}

async function seedEvents() {
  console.log(" Seeding events...");

  const events = [
    {
      title: "IndabaX Benin 2025",
      organization: "IndabaX — African AI Research Community",
      year: "2025",
      role: "participant" as const,
      description: "Technical sessions and workshops on Deep Learning, connecting with Africa's AI research community.",
    },
    {
      title: "BWAI 2025",
      organization: "Benin Workshop on Artificial Intelligence",
      year: "2025",
      role: "participant" as const,
      description: "Workshops and conferences on Machine Learning, Deep Learning, and AI applications in Benin.",
    },
    {
      title: "IFRI Mentoring",
      organization: "IFRI — Université d'Abomey-Calavi",
      year: "2024 – Present",
      role: "mentor" as const,
      description: "Mentoring new students in programming fundamentals, guiding them through their first year in computer science.",
    },
  ];

  for (const event of events) {
    await EventModel.create(event);
  }

  console.log(` ${events.length} events seeded`);
}

async function seedCertifications() {
  console.log(" Seeding certifications...");

  const certs = [
    {
      platform: "DataCamp",
      title: "Associate Data Scientist in Python",
      status: "in_progress" as const,
      credential_url: "https://www.datacamp.com",
      date_earned: undefined,
    },
    {
      platform: "OpenClassrooms",
      title: "Python, JavaScript, Git & GitHub, Algorithms, Web Fundamentals",
      status: "completed" as const,
      credential_url: undefined,
      date_earned: undefined,
    },
    {
      platform: "Sololearn",
      title: "Introduction to SQL, Intermediate SQL",
      status: "completed" as const,
      credential_url: undefined,
      date_earned: undefined,
    },
    {
      platform: "CodinGame",
      title: "Python 3 Proficiency",
      status: "completed" as const,
      credential_url: undefined,
      date_earned: undefined,
    },
  ];

  for (const cert of certs) {
    await CertificationModel.create(cert);
  }

  console.log(` ${certs.length} certifications seeded`);
}

/**
 * Seed profile_settings with default values.
 * Safe to re-run: ON CONFLICT DO NOTHING preserves manual edits.
 */
async function seedProfileSettings() {
  console.log(" Seeding profile settings...");

  const defaults: Record<string, string> = {
    username: "Seth N. AKPLOGAN",
    hero_label: "IFRI — UNIVERSITÉ D'ABOMEY-CALAVI",
    hero_title: "Étudiant en Intelligence Artificielle & Data Scientist",
    hero_punchline: "Building reliable and intelligent software that delivers measurable real-world value.",
    hero_cta_primary: "Discover My Projects",
    hero_cta_secondary: "Download CV",
    hero_bio: "Second-year student in Artificial Intelligence at IFRI, Université d'Abomey-Calavi. I focus on Machine Learning, Deep Learning, and Data Science — turning complex problems into software that works.",
    about_para2: "From music recommendation engines using MusiCNN and ONNX to secure multi-channel authentication systems, I build at the intersection of research and production.",
    about_para3: "Active in Benin's AI community through IndabaX and BWAI. I mentor new students and contribute to open-source projects that demystify machine learning.",
    citation_text: "La simplicité est la sophistication suprême.",
    citation_author: "Léonard de Vinci",
    academic_status: "LICENCE IN ARTIFICIAL INTELLIGENCE",
    academic_institution: "IFRI — Université d'Abomey-Calavi",
    academic_period: "2024 – Present | 2nd Year",
    contact_bio: "I'm open to collaborations, internships, and research opportunities in AI and software engineering.",
    contact_email: "sethakplogan@gmail.com",
    contact_linkedin: "linkedin.com/in/seth-akplogan",
    contact_github: "github.com/Flex1-tech",
    contact_footer_tagline: "Built with discipline & code.",
  };

  // Uses raw INSERT ON CONFLICT DO NOTHING — never overwrites manually edited values
  for (const [key, value] of Object.entries(defaults)) {
    await pool.query(
      `INSERT INTO profile_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
      [key, value],
    );
  }

  console.log(` ${Object.keys(defaults).length} profile settings seeded`);
}

async function main() {
  try {
    console.log(" Starting database seeding...\n");

    initializeDatabase();

    await seedProfileSettings();
    await seedProjects();
    await seedEvents();
    await seedCertifications();

    console.log("\n Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Error seeding database:", error);
    process.exit(1);
  }
}

main();