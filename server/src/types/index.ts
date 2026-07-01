/**
 * Type definitions for database models
 */

export interface Project {
 id?: number;
 title: string;
 slug: string;
 short_desc: string;
 core_problem: string;
 technical_solution: string;
 tech_stack: string[]; // JSON array
 github_link?: string;
 live_demo_link?: string;
 image_url?: string;
 video_url?: string;
 status: "in_progress" | "completed";
 created_at?: string;
 updated_at?: string;
}

export interface Event {
 id?: number;
 title: string;
 organization: string;
 year: string;
 role: "participant" | "mentor" | "speaker";
 description: string;
 image_url?: string;
 created_at?: string;
 updated_at?: string;
}

export interface Certification {
 id?: number;
 platform: string;
 title: string;
 status: "in_progress" | "completed";
 credential_url?: string;
 image_url?: string;
 date_earned?: string;
 created_at?: string;
 updated_at?: string;
}

export interface AdminUser {
 id?: number;
 username: string;
 password_hash?: string;
 email?: string;
 last_login?: string;
 created_at?: string;
 updated_at?: string;
}

export interface SessionData {
 userId: number;
 username: string;
 isAdmin: boolean;
}
