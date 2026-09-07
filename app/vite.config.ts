import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/2026-quitcode-01-agentic-engineering-hw/' : '/',
  plugins: [react(), tailwindcss()],
}))
