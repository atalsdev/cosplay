import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAINE = import.meta.env.DOMAINE || 'https://perfectmotoride.com';
const PORT = process.env.PORT || 4321;
const HOST = process.env.HOST || '0.0.0.0';

export default defineConfig({
  site: DOMAINE,
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: node({
    mode: 'standalone',
    host: HOST,
    port: PORT
  }),
  vite: {
    envPrefix: 'SHOPIFY_',
    define: {
      'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
    },
    resolve: {
      alias: {
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@components': path.resolve(__dirname, './src/components'),
        '@libs': path.resolve(__dirname, './src/lib'),
        '@themes': path.resolve(__dirname, './src/themes'),
      },
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              '@astrojs/react',
            ],
            product: [
              './src/components/AddToCart',
              './src/components/ProductCard',
            ],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@astrojs/*'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    plugins: [
      {
        name: 'remove-dev-attributes',
        transformIndexHtml(html, { mode }) {
          if (mode === 'production') {
            return html.replace(/ data-astro-source-[^=]+="[^"]+"/g, '');
          }
          return html;
        },
      },
    ],
  },
});
