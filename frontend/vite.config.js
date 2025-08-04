// vite.config.js - Vite configuration for React development
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow access from other devices on network
    open: true  // Automatically open browser when starting dev server
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize build for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  // Development configuration
  define: {
    // Define global constants for development
    __DEV__: JSON.stringify(true)
  }
})

// Configuration explained:
// - plugins: [react()] - Enables React support with JSX transformation
// - server.port: 5173 - Default Vite dev server port (matches CORS in FastAPI)
// - server.host: true - Allows external access to dev server
// - server.open: true - Opens browser automatically
// - build.outDir: 'dist' - Output directory for production build
// - build.sourcemap: true - Generate source maps for debugging
// - manualChunks: Splits vendor libraries into separate chunks for better caching