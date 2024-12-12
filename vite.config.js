import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        sanitizeFileName: (name) => name.replace(/[\?#]/g, ''),
      }
    },
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: true
      },
      mangle: {
        properties: {
          regex: /^data-astro-/
        }
      }
    }
  }
}); 