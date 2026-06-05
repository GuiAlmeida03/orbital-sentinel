import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Troque 'orbital-sentinel' pelo nome exato do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: '/orbital-sentinel/',
})
