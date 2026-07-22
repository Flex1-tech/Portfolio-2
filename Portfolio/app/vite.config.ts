import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
    proxy: {
      '/admin-api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin-api/, '/admin'),
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Admin bundle — never needed for public visitors
          if (id.includes('/pages/admin/') || id.includes('/components/admin/')) {
            return 'admin';
          }
          // Markdown rendering — only for article pages
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('micromark') || id.includes('mdast') || id.includes('hast') || id.includes('unified') || id.includes('vfile')) {
            return 'markdown';
          }
          // GSAP animation engine — deferred from initial parse
          if (id.includes('gsap')) {
            return 'gsap';
          }
          // Recharts — chart library used only in admin UI
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }
          // Radix UI primitives — shared UI, separate from core
          if (id.includes('@radix-ui')) {
            return 'radix';
          }
          // TanStack Query — data fetching layer
          if (id.includes('@tanstack')) {
            return 'query';
          }
        },
      },
    },
  },
});
