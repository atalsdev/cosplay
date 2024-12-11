// utils/themes.js
export const loadTheme = (themeName) => {
    try {
      // Dynamically import theme configuration
      const theme = require(`./themes/${themeName}.mjs`).default;
      return theme;
    } catch (error) {
      console.warn(`Theme "${themeName}" not found, falling back to default theme`);
      return require('./themes/default.mjs').default;
    }
  };