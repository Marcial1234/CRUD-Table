import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const hash = () => Math.floor(Math.random() * 90000) + 10000

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './server/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + hash() + `.js`,
        chunkFileNames: `[name]` + hash() + `.js`,
        assetFileNames: `[name]` + hash() + `.[ext]`,
      },
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
