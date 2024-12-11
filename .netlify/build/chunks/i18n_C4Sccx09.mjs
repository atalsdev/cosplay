import { _ as __variableDynamicImportRuntimeHelper } from './dynamic-import-helper_uMTE3ehW.mjs';

function getLangFromUrl(url) {
  const [, lang] = url.pathname.split("/");
  if (isValidLanguage(lang)) {
    return lang;
  }
  return "en";
}
const theme = process.env.THEME || "default";
async function useTranslations(lang) {
  let translations;
  try {
    translations = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../themes/bikes/data/index_en copy.json": () => import('./index_en copy_CTwkR7zD.mjs'),"../themes/bikes/data/index_en.json": () => import('./index_en_BeagIef9.mjs'),"../themes/bikes/data/index_fr.json": () => import('./index_fr_BATF8MaR.mjs'),"../themes/default/data/index_en copy.json": () => import('./index_en copy_BRj2UO1s.mjs'),"../themes/default/data/index_en.json": () => import('./index_en_Cxt6ZZqb.mjs'),"../themes/default/data/index_fr.json": () => import('./index_fr_Dg8OD9d9.mjs')})), `../themes/${theme}/data/index_${lang}.json`, 5);
    return translations;
  } catch (e) {
    console.warn(`Translation file for ${lang} not found, falling back to English`);
    translations = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../themes/bikes/data/index_en.json": () => import('./index_en_BeagIef9.mjs'),"../themes/default/data/index_en.json": () => import('./index_en_Cxt6ZZqb.mjs')})), `../themes/${theme}/data/index_en.json`, 5);
    return translations;
  }
}
function isValidLanguage(lang) {
  const validLanguages = ["en", "fr", "es", "it", "de", "nl", "pt", "ar"];
  return validLanguages.includes(lang);
}
function getLocalizedPath(currentPath, newLang) {
  const pathParts = currentPath.split("/");
  if (pathParts.length === 2 && pathParts[1] === "") {
    return `/${newLang}`;
  }
  if (pathParts[1] && isValidLanguage(pathParts[1])) {
    pathParts[1] = newLang;
  } else {
    pathParts.splice(1, 0, newLang);
  }
  return pathParts.join("/");
}

export { getLocalizedPath as a, getLangFromUrl as g, isValidLanguage as i, useTranslations as u };
