import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './server/dist',
    emptyOutDir: true,
  },
  plugins: [react(), svgr()],
})
