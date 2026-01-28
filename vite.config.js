import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  base: process.env.NODE_ENV === 'production' ? '/react-2026-practice-01/' : '/',

  plugins: [
    react(),
    tailwindcss()
  ],
})
