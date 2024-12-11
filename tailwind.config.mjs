import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const themesToLoad = (process.env.THEME || 'default').split(',').map(t => t.trim());
const themes = {};

// Synchronously load themes
for (const themeName of themesToLoad) {
  const themePath = path.resolve(`./src/themes/${themeName}/theme.mjs`);
  if (fs.existsSync(themePath)) {
    themes[themeName] = require(themePath).default;
  } else {
    console.warn(`Theme ${themeName} not found at ${themePath}`);
  }
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: themes[themesToLoad[0]] // Use first theme as default
  },
  plugins: [require("tailwindcss-animate")],
}