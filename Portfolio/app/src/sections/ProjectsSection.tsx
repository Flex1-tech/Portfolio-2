import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/SectionLabel";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/api";
import type { Project } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        // Transform backend data to frontend format
        const transformedProjects: Project[] = data.map((project, index) => ({
          number: String(index + 1).padStart(2, "0"),
          title: project.title,
          status: project.status as "completed" | "in-progress",
          problem: project.core_problem,
          solution: project.technical_solution,
          tech: project.tech_stack,
          githubUrl: project.github_link,
          demoUrl: project.live_demo_link,
          image: `/images/projects/${project.slug}.jpg`,
        }));
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const text = intro.textContent || "";
    const words = text.split(" ");
    intro.innerHTML = "";

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "word-span";
      span.textContent = word;
      span.style.animationPlayState = "paused";
      intro.appendChild(span);
      if (i < words.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        space.className = "word-span";
        space.style.animationPlayState = "paused";
        intro.appendChild(space);
      }
    });

    const wordSpans = intro.querySelectorAll(".word-span");

    const st = ScrollTrigger.create({
      trigger: intro,
      start: "top 80%",
      end: "bottom 40%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalSpans = wordSpans.length;

        wordSpans.forEach((span, i) => {
          const spanStart = i / totalSpans;
          const spanEnd = (i + 1) / totalSpans;
          const localProgress = Math.max(
            0,
            Math.min(1, (progress - spanStart) / (spanEnd - spanStart)),
          );
          const delay = -(localProgress * 0.6);
          (span as HTMLElement).style.animationDelay = `${delay}s`;
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-gap page-padding"
      style={{ maxWidth: "1280px", margin: "0 auto" }}
    >
      <SectionLabel text="03 — PROJECTS" />
      <SectionHeading text="Selected\nWork" className="mb-16" />

      <p
        ref={introRef}
        className="projects-intro text-[15px] leading-relaxed text-[#CFCFCF] max-w-[640px] mb-16"
      >
        Each project is a response to a real problem. Here is how I approach
        building solutions — from audio embeddings to secure authentication
        systems.
      </p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects available</p>
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          {projects.map((project, i) => (
            <ProjectCard key={project.number} project={project} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
