import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const storeName = process.argv[2];
const STORES_PATH = path.join(PROJECT_ROOT, 'stores');

if (!storeName) {
  console.error('Please provide a store name (bikes or digivast)');
  process.exit(1);
}

const storeDir = path.join(STORES_PATH, storeName);
const envFile = path.join(storeDir, '.env');

// Ensure store directory exists
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

console.log(`Deploying ${storeName}...`);
console.log(`Using env file: ${envFile}`);

// Build with store's env
exec(`ENV_FILE=${envFile} npm run build`, { cwd: PROJECT_ROOT }, (error, stdout) => {
  if (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
  
  console.log(stdout);
  
  // Copy dist to store directory
  fs.cpSync(
    path.join(PROJECT_ROOT, 'dist'), 
    path.join(storeDir, 'dist'), 
    { recursive: true }
  );
  
  console.log(`Deployed ${storeName} successfully to ${storeDir}`);
}); 