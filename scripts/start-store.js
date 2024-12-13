import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const storeName = process.argv[2];

if (!storeName) {
  console.error('Please provide a store name');
  console.error('Usage: npm run start:store bikes');
  process.exit(1);
}

// Construct the env file path
const envFile = path.resolve(process.cwd(), `.env.${storeName}`);

// Check if the env file exists
if (!fs.existsSync(envFile)) {
  console.error(`Environment file for store ${storeName} not found: ${envFile}`);
  process.exit(1);
}

// Run the start command with the specific environment file
try {
  // Build first
  execSync(`ENV_FILE=.env.${storeName} npm run build`, { 
    stdio: 'inherit'
  });

  // Then start the server
  execSync(`ENV_FILE=.env.${storeName} node -r dotenv/config ./dist/server/entry.mjs`, { 
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to start the store:', error);
  process.exit(1);
}