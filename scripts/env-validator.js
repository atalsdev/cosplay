const validateRequiredEnvVars = () => {
  const required = [
    'MONGODB_URI',
    'REDIS_URL',
    'PUBLIC_SHOPIFY_SHOP',
    'PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    'PUBLIC_SITE_NAME'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export { validateRequiredEnvVars }; 