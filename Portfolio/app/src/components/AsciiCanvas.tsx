import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FONT_SIZE = 12;
const SCROLL_SPEED = 0.5;
const WAVE_AMP = 8;
const WAVE_FREQ = 0.05;
const NOISE_AMP = 2;
const FLICKER_RATE = 0.3;
const RAMP = ' .:-=+*#%@'.split('');

export default function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let grid: string[][] = [];
    let offset = 0;
    let rafId: number;
    let isVisible = true;

    function resize() {
      if (!canvas || !ctx) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      cols = Math.ceil(canvas.width / FONT_SIZE);
      rows = Math.ceil(canvas.height / FONT_SIZE);
      grid = [];
      for (let r = 0; r < rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < cols; c++) {
          row.push(RAMP[Math.floor(Math.random() * RAMP.length)]);
        }
        grid.push(row);
      }
      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = 'top';
    }

    function draw() {
      if (!canvas || !ctx || !isVisible) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      offset += SCROLL_SPEED;
      if (offset >= rows) offset = 0;

      for (let r = rows - 1; r >= 1; r--) {
        grid[r] = [...grid[r - 1]];
      }
      grid[0] = [];
      for (let c = 0; c < cols; c++) {
        grid[0][c] = RAMP[Math.floor(Math.random() * RAMP.length)];
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < FLICKER_RATE) {
            grid[r][c] = RAMP[Math.floor(Math.random() * RAMP.length)];
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#737373';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = Math.sin(c * WAVE_FREQ + offset * 0.1) * WAVE_AMP;
          const noise = (Math.random() - 0.5) * NOISE_AMP;
          const x = (c + wave + noise) * FONT_SIZE;
          const y = r * FONT_SIZE;
          if (x >= 0 && x < canvas.width) {
            ctx.fillText(grid[r][c], x, y);
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    const parent = canvas.parentElement;
    if (parent) observer.observe(parent);

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.35, zIndex: 0 }}
    />
  );
}
