/** @type {import('tailwindcss').Config} */
module.exports = {
 darkMode: ["class"],
 content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 theme: {
 extend: {
 colors: {
 void: '#0A0A0A',
 obsidian: '#141414',
 graphite: '#1E1E1E',
 silver: '#CFCFCF',
 crimson: '#B5423F',
 'crimson-glow': 'rgba(181, 66, 63, 0.15)',
 'deep-teal': '#0F2F2F',
 'teal-glow': 'rgba(47, 143, 143, 0.12)',
 border: "hsl(var(--border))",
 input: "hsl(var(--input))",
 ring: "hsl(var(--ring))",
 background: "hsl(var(--background))",
 foreground: "hsl(var(--foreground))",
 primary: {
 DEFAULT: "hsl(var(--primary))",
 foreground: "hsl(var(--primary-foreground))",
 },
 secondary: {
 DEFAULT: "hsl(var(--secondary))",
 foreground: "hsl(var(--secondary-foreground))",
 },
 destructive: {
 DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
 foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
 },
 muted: {
 DEFAULT: "#737373",
 foreground: "hsl(var(--muted-foreground))",
 },
 accent: {
 DEFAULT: "hsl(var(--accent))",
 foreground: "hsl(var(--accent-foreground))",
 },
 popover: {
 DEFAULT: "hsl(var(--popover))",
 foreground: "hsl(var(--popover-foreground))",
 },
 card: {
 DEFAULT: "hsl(var(--card))",
 foreground: "hsl(var(--card-foreground))",
 },
 },
 fontFamily: {
 display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
 body: ['Inter', 'system-ui', 'sans-serif'],
 mono: ['"JetBrains Mono"', 'monospace'],
 },
 borderRadius: {
 xl: "calc(var(--radius) + 4px)",
 lg: "var(--radius)",
 md: "calc(var(--radius) - 2px)",
 sm: "calc(var(--radius) - 4px)",
 xs: "calc(var(--radius) - 6px)",
 },
 keyframes: {
 "accordion-down": {
 from: { height: "0" },
 to: { height: "var(--radix-accordion-content-height)" },
 },
 "accordion-up": {
 from: { height: "var(--radix-accordion-content-height)" },
 to: { height: "0" },
 },
 "caret-blink": {
 "0%,70%,100%": { opacity: "1" },
 "20%,50%": { opacity: "0" },
 },
 "scroll-dot": {
 "0%": { transform: "translateY(0)" },
 "50%": { transform: "translateY(36px)" },
 "100%": { transform: "translateY(0)" },
 },
 "word-rotate-in": {
 "0%": {
 transform: "rotateY(30deg) translateZ(100px)",
 opacity: "0",
 },
 "100%": {
 transform: "rotateY(0) translateZ(0)",
 opacity: "1",
 },
 },
 },
 animation: {
 "accordion-down": "accordion-down 0.2s ease-out",
 "accordion-up": "accordion-up 0.2s ease-out",
 "caret-blink": "caret-blink 1.25s ease-out infinite",
 "scroll-dot": "scroll-dot 2s ease-in-out infinite",
 "word-rotate-in": "word-rotate-in 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards paused",
 },
 },
 },
 plugins: [require("tailwindcss-animate")],
}
