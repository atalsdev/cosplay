import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import 'dotenv/config';

const DOMAINE = import.meta.env.DOMAINE || 'https://perfectmotoride.com';

export default defineConfig({
  site: DOMAINE,
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    envPrefix: 'SHOPIFY_',
    define: {
      'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
    },
    resolve: {
      alias: {
        '@layouts': '/src/layouts',
        '@components': '/src/components',
        '@utils': '/src/utils',
        '@themes': '/src/themes'
      }
    }
  },
});