import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GREEN CODING: Vite configuration optimized for small bundle size
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting for better loading performance
    rollupOptions: {
      output: {
        // Manual chunks for lazy loading optimization
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'qr-vendor': ['react-qr-code', 'html5-qrcode']
        }
      }
    },
    // Minification for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      }
    },
    // Target modern browsers for smaller bundle
    target: 'esnext'
  },
  server: {
    port: 5173,
    open: true
  }
});
