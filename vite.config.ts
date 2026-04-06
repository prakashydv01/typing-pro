import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/", // 🔥 ADD THIS LINE
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }
          if (id.includes('react-router')) {
            return 'vendor-router'
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-chart'
          }
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
            return 'vendor-export'
          }

          return 'vendor'
        },
      },
    },
  },
})