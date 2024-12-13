import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { validateRequiredEnvVars } from './env-validator.js';

const storeName = process.argv[2];

if (!storeName) {
  console.error('Please provide a store name');
  process.exit(1);
}

const envFile = `.env.${storeName}`;

if (!fs.existsSync(envFile)) {
  console.error(`Environment file ${envFile} not found`);
  process.exit(1);
}

try {
  // Load and validate environment variables
  console.log(`Loading environment from ${envFile}...`);
  const envConfig = dotenv.config({ path: envFile });
  
  if (envConfig.error) {
    throw envConfig.error;
  }

  // Validate required environment variables
  validateRequiredEnvVars();

  // Build and start the store
  console.log('Building store...');
  execSync(`ENV_FILE=${envFile} npm run build`, { stdio: 'inherit' });
  
  console.log('Starting store...');
  execSync(`ENV_FILE=${envFile} npm start`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start the store:', error);
  process.exit(1);
}