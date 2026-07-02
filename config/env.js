import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// This file's purpose is to find and load the correct .env file.
// It should be imported at the very top of server.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvRoot = path.resolve(__dirname, '..'); // server/
const workspaceRoot = path.resolve(serverEnvRoot, '..'); // root/

const envPaths = [
  path.join(serverEnvRoot, '.env.local'),
  path.join(serverEnvRoot, '.env'),
  path.join(workspaceRoot, '.env.local'),
  path.join(workspaceRoot, '.env'),
];

export const envPath = envPaths.find(fs.existsSync);

if (envPath) {
  dotenv.config({ path: envPath });
}

const REQUIRED_ENV = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PAYSTACK_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME'
];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing critical environment variable: ${key}`);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
});