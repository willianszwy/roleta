import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/roleta/',
  
  // Performance optimizations
  build: {
    // Enable minification
    minify: 'terser',
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    
    // Rollup options for better chunking
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion', 'canvas-confetti'],
          'styling-vendor': ['styled-components'],
          
          // App chunks
          'design-system': [
            './src/design-system/index.ts',
          ],
        },
        
        // Better chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Size analysis
    reportCompressedSize: true,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  
  // Development optimizations
  server: {
    // Enable HMR
    hmr: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'styled-components',
      'framer-motion',
      'canvas-confetti',
    ],
  },
  
  // Path resolution for better tree shaking
  resolve: {
    alias: {
      '@': '/src',
      '@design-system': '/src/design-system',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@types': '/src/types',
    },
  },
})
