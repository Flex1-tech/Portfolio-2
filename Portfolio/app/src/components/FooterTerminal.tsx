import { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft } from 'lucide-react';

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
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">projects</span> — List featured projects</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">skills</span> — Display AI & Dev tech stack</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">about</span> — About Seth N. AKPLOGAN</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">contact</span> — Contact details & social links</p>
            <p><span className="text-[#2F8F8F] w-24 inline-block font-bold">clear</span> — Clear terminal screen</p>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-[#F5F5F5]">Featured Projects:</p>
            <p>• <span className="text-[#2F8F8F]">MusiCNN & ONNX</span>: AI-based music recommendation engine</p>
            <p>• <span className="text-[#2F8F8F]">Secure 2FA Engine</span>: High-security multi-channel authentication</p>
            <p>• <span className="text-[#2F8F8F]">Carpool Platform</span>: Smart mobility solution</p>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-[#F5F5F5]">Tech Stack:</p>
            <p><span className="text-[#A3A3A3]">AI / Data</span>: Python, PyTorch, Scikit-Learn, Pandas, ONNX, OpenCV</p>
            <p><span className="text-[#A3A3A3]">Backend</span>: Node.js, Express, TypeScript, PostgreSQL, Supabase, SQLite</p>
            <p><span className="text-[#A3A3A3]">Frontend</span>: React 19, TypeScript, Vite, Tailwind CSS, GSAP</p>
          </div>
        );
        break;

      case 'about':
        response = (
          <p className="text-xs text-[#CFCFCF]">
            2nd-year Artificial Intelligence student at IFRI (Université d'Abomey-Calavi).
            Specialized in Machine Learning, Deep Learning, and robust software engineering.
          </p>
        );
        break;

      case 'contact':
        response = (
          <div className="space-y-1 text-xs">
            <p>Email: <a href="mailto:sethakplogan@gmail.com" className="text-[#B5423F] hover:underline">sethakplogan@gmail.com</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/seth-akplogan" target="_blank" rel="noreferrer" className="text-[#B5423F] hover:underline">linkedin.com/in/seth-akplogan</a></p>
            <p>GitHub: <a href="https://github.com/Flex1-tech" target="_blank" rel="noreferrer" className="text-[#B5423F] hover:underline">github.com/Flex1-tech</a></p>
          </div>
        );
        break;

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
          <span className="text-[#A3A3A3] font-medium text-[11px] tracking-wide">seth-cli@portfolio: ~</span>
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

