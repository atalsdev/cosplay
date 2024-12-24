// i18n.ts
import type { AstroGlobal } from 'astro';

export function getLangFromUrl(url: URL): string {
  // First check the path
  const [, pathLang] = url.pathname.split('/');
  if (isValidLanguage(pathLang)) {
    return pathLang; // If valid language in path, use it regardless of subdomain
  }
  
  // If no valid language in path, check subdomain
  const hostname = url.hostname;
  const subdomain = hostname.split('.')[0];
  
  // Return language based on subdomain, or 'en' for main domain
  switch (subdomain) {
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'es':
      return 'es';
    case 'it':
      return 'it';
    case 'nl':
      return 'nl';
    case 'pt':
      return 'pt';
    case 'ar':
      return 'ar';
    default:
      return 'en';
  }
}
const theme = import.meta.env.THEME || 'default';

export async function useTranslations(lang: string) {
  let translations;
  try {
    // Dynamic import of language files
    translations = await import(`../themes/${theme}/data/index_${lang}.json`);
    return translations;
  } catch (e) {
    console.warn(`Translation file for ${lang} not found, falling back to English`);
    translations = await import(`../themes/${theme}/data/index_en.json`);
    return translations;
  }
}

export function isValidLanguage(lang: string): boolean {
  const validLanguages = ['en', 'fr', 'es', 'it', 'de', 'nl', 'pt', 'ar'];
  return validLanguages.includes(lang);
}

export function getLocalizedPath(currentPath: string, newLang: string): string {
  const pathParts = currentPath.split('/');
  // Handle root path
  if (pathParts.length === 2 && pathParts[1] === '') {
    return `/${newLang}`;
  }
  // Handle existing language code
  if (pathParts[1] && isValidLanguage(pathParts[1])) {
    pathParts[1] = newLang;
  } else {
    // Handle paths without language code
    pathParts.splice(1, 0, newLang);
  }
  return pathParts.join('/');
}

export function isRTL(lang: string): boolean {
  return ['ar'].includes(lang);
}