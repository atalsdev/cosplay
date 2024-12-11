/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SHOPIFY_API_URL: string;
  readonly SHOPIFY_ACCESS_TOKEN: string;
  readonly SHOPIFY_BLOG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}