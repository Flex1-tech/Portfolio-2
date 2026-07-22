import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { getProfile, getProjects, getCertifications } from '@/services/api';

interface CommandOutput {
  command: string;
  response: React.ReactNode;
}

export default function FooterTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      response: (
        <span className="text-[#A3A3A3]">
          Type <span className="text-[#2F8F8F] font-bold">help</span> to display available commands.
        </span>
      ),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch live DB data with 5 min caching via TanStack Query
  const { data: profile = {} } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const { data: certifications = [] } = useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let response: React.ReactNode;

    switch (trimmed) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-[#F5F5F5] font-semibold">Available commands:</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">projects</span> — List projects from portfolio database</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">skills</span> — Display tech stack & certifications</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">about</span> — Bio & academic details from database</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">contact</span> — Contact information & social links</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">clear</span> — Clear terminal screen</p>
          </div>
        );
        break;

      case 'projects': {
        if (projects.length > 0) {
          response = (
            <div className="space-y-1.5 text-xs">
              <p className="text-[#F5F5F5] font-semibold">Featured Projects ({projects.length}):</p>
              {projects.map((p) => {
                const techList = Array.isArray(p.tech_stack) ? p.tech_stack.slice(0, 3).join(', ') : '';
                return (
                  <p key={p.id}>
                    • <span className="text-[#2F8F8F] font-bold">{p.title}</span>
                    {techList ? <span className="text-[#A3A3A3]"> [{techList}]</span> : ''}
                    {p.short_desc ? `: ${p.short_desc}` : ''}
                  </p>
                );
              })}
            </div>
          );
        } else {
          response = (
            <div className="space-y-1 text-xs">
              <p className="text-[#F5F5F5]">Featured Projects:</p>
              <p>• <span className="text-[#2F8F8F]">MusiCNN & ONNX</span>: AI-based music recommendation engine</p>
              <p>• <span className="text-[#2F8F8F]">Secure 2FA Engine</span>: High-security multi-channel authentication</p>
              <p>• <span className="text-[#2F8F8F]">Carpool Platform</span>: Smart mobility solution</p>
            </div>
          );
        }
        break;
      }

      case 'skills': {
        // Collect tech stack from DB projects if available
        const allTech = Array.from(
          new Set(
            projects.flatMap((p) => (Array.isArray(p.tech_stack) ? p.tech_stack : []))
          )
        );
        const certPlatforms = Array.from(new Set(certifications.map((c) => c.platform)));

        response = (
          <div className="space-y-1 text-xs">
            <p className="text-[#F5F5F5] font-semibold">Tech Stack & Verified Skills:</p>
            <p>
              <span className="text-[#A3A3A3]">AI / Data</span>: Python, PyTorch, Scikit-Learn, Pandas, ONNX, OpenCV
            </p>
            <p>
              <span className="text-[#A3A3A3]">Engineering</span>: {allTech.length > 0 ? allTech.join(', ') : 'Node.js, Express, TypeScript, React 19, PostgreSQL, Tailwind CSS, GSAP'}
            </p>
            {certPlatforms.length > 0 && (
              <p>
                <span className="text-[#A3A3A3]">Certifications</span>: {certPlatforms.join(', ')}
              </p>
            )}
          </div>
        );
        break;
      }

      case 'about': {
        const bio = profile.hero_bio || profile.hero_punchline;
        const institution = profile.academic_institution || "IFRI — Université d'Abomey-Calavi";
        const status = profile.academic_status || "2nd-year Artificial Intelligence student";

        response = (
          <div className="space-y-1 text-xs text-[#CFCFCF]">
            <p className="text-[#F5F5F5] font-semibold">{profile.username || 'Seth N. AKPLOGAN'}</p>
            <p>{status} at {institution}.</p>
            {bio && <p className="mt-1 text-[#A3A3A3]">{bio}</p>}
          </div>
        );
        break;
      }

      case 'contact': {
        const email = profile.contact_email || 'sethakplogan@gmail.com';
        const linkedin = profile.contact_linkedin || 'https://linkedin.com/in/seth-akplogan';
        const github = profile.contact_github || 'https://github.com/Flex1-tech';

        response = (
          <div className="space-y-1 text-xs">
            <p>Email: <a href={`mailto:${email}`} className="text-[#B5423F] hover:underline">{email}</a></p>
            <p>LinkedIn: <a href={linkedin} target="_blank" rel="noreferrer" className="text-[#B5423F] hover:underline">{linkedin.replace('https://', '')}</a></p>
            <p>GitHub: <a href={github} target="_blank" rel="noreferrer" className="text-[#B5423F] hover:underline">{github.replace('https://', '')}</a></p>
          </div>
        );
        break;
      }

      default:
        response = (
          <span className="text-[#B5423F]">
            Unknown command: "{trimmed}". Type <span className="underline font-bold">help</span>.
          </span>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: input, response }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161616] border-b border-[#222]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#2F8F8F]" />
          <span className="text-[#A3A3A3] font-medium text-[11px] tracking-wide">
            {profile.username ? `${profile.username.toLowerCase().replace(/\s+/g, '-')}-cli` : 'seth-cli'}@portfolio: ~
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80 block" />
        </div>
      </div>

      {/* Terminal Content Buffer */}
      <div className="p-4 max-h-60 overflow-y-auto space-y-3">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-[#2F8F8F]">
              <span>$</span>
              <span className="text-[#F5F5F5]">{item.command}</span>
            </div>
            <div className="pl-4">{item.response}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <form onSubmit={handleCommand} className="flex items-center px-4 py-2 bg-[#121212] border-t border-[#1E1E1E]">
        <span className="text-[#2F8F8F] mr-2 font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command (e.g. help, projects, skills)..."
          className="flex-1 bg-transparent text-[#F5F5F5] placeholder-[#555] focus:outline-none font-mono text-xs"
        />
        <button type="submit" className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors p-1">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}


