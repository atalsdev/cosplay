export const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).__ENV) {
    return (window as any).__ENV[key];
  }
  return import.meta.env[key] || process.env[key];
};

export const validateRequiredEnvVars = () => {
  const required = [
    'MONGODB_URI',
    'REDIS_URL',
    'PUBLIC_SHOPIFY_SHOP',
    'PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    'PUBLIC_SITE_NAME'
  ];

  const missing = required.filter(key => !getEnvVar(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}; 