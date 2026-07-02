export interface Project {
 number: string;
 title: string;
 status: 'completed' | 'in-progress';
 problem: string;
 solution: string;
 tech: string[];
 githubUrl?: string;
 demoUrl?: string;
 image?: string;
}

export interface Certification {
 platform: string;
 title: string;
 status: 'completed' | 'in-progress';
 verifyUrl?: string;
 imageUrl?: string;
}

export interface Event {
 title: string;
 organization: string;
 role: 'participant' | 'mentor' | 'speaker';
 description: string;
 year: string;
 imageUrl?: string;
}

export interface SkillCategory {
 name: string;
 skills: string[];
}
