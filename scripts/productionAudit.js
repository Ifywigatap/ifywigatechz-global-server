import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';

let checksPassed = 0;
let checksFailed = 0;

const log = {
  section: (title) => console.log(`\n${CYAN}${BLUE}═══════════════════════════════════${RESET}`),
  title: (title) => console.log(`${BLUE}${title}${RESET}`),
  success: (msg) => { console.log(`${GREEN}✅ ${msg}${RESET}`); checksPassed++; },
  error: (msg) => { console.log(`${RED}❌ ${msg}${RESET}`); checksFailed++; },
  warn: (msg) => { console.log(`${YELLOW}⚠️  ${msg}${RESET}`); },
  info: (msg) => { console.log(`${CYAN}ℹ️  ${msg}${RESET}`); }
};

async function runAudit() {
  console.log(`\n${CYAN}${'═'.repeat(50)}${RESET}`);
  console.log(`${BLUE}🔍 PRODUCTION READINESS AUDIT${RESET}`);
  console.log(`${CYAN}${'═'.repeat(50)}${RESET}\n`);

  try {
    // ==================== BACKEND CHECKS ====================
    log.section();
    log.title('📦 BACKEND STRUCTURE & FILES');
    
    const backendPath = path.join(__dirname, '..');  // Go to server directory
    const requiredBackendDirs = ['models', 'routes', 'controllers', 'middleware', 'config', 'utils', 'seeds', 'data', 'scripts'];
    
    for (const dir of requiredBackendDirs) {
      const dirPath = path.join(backendPath, dir);
      if (fs.existsSync(dirPath)) {
        log.success(`Directory exists: server/${dir}`);
      } else {
        log.error(`Missing directory: server/${dir}`);
      }
    }

    // Check critical files
    const requiredFiles = [
      'server.js',
      'package.json',
      'config/db.js',
      'middleware/errorHandler.js',
      'middleware/auth.js'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(backendPath, file);
      if (fs.existsSync(filePath)) {
        log.success(`File exists: server/${file}`);
      } else {
        log.error(`Missing file: server/${file}`);
      }
    }

    // ==================== DATABASE CHECKS ====================
    log.section();
    log.title('🗄️  DATABASE CONNECTIVITY & MODELS');
    
    try {
      if (!process.env.MONGODB_URI) {
        log.error('MONGODB_URI not set in environment');
      } else {
        log.success(`MongoDB URI configured: ${process.env.MONGODB_URI}`);
      }

      // Try to connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      log.success('MongoDB connection successful');

      // Check collections
      const collections = ['products', 'users', 'courses', 'contacts', 'blogposts', 'casestudies', 'solutions'];
      const db = mongoose.connection.db;
      const existingCollections = await db.listCollections().toArray();
      const collectionNames = existingCollections.map(c => c.name);

      for (const collection of collections) {
        if (collectionNames.some(c => c.toLowerCase().includes(collection))) {
          const count = await db.collection(collection).countDocuments();
          log.success(`Collection '${collection}' exists with ${count} documents`);
        } else {
          log.warn(`Collection '${collection}' not created yet`);
        }
      }

      await mongoose.connection.close();
    } catch (dbError) {
      log.error(`Database connection failed: ${dbError.message}`);
    }

    // ==================== ROUTES CHECKS ====================
    log.section();
    log.title('🛣️  API ROUTES');

    const routeFiles = ['auth', 'products', 'courses', 'blog', 'caseStudy', 'contact', 'solutions'];
    for (const route of routeFiles) {
      const routePath = path.join(backendPath, `routes/${route}.js`);
      if (fs.existsSync(routePath)) {
        const content = fs.readFileSync(routePath, 'utf-8');
        const routeCount = (content.match(/router\.(get|post|put|delete|patch)/g) || []).length;
        log.success(`Routes ${route}.js has ${routeCount} endpoints`);
      } else {
        log.error(`Missing route file: routes/${route}.js`);
      }
    }

    // ==================== MODELS CHECKS ====================
    log.section();
    log.title('🏗️  DATABASE MODELS');

    const models = ['User', 'Product', 'Course', 'BlogPost', 'CaseStudy', 'Contact', 'Solution'];
    for (const model of models) {
      const modelPath = path.join(backendPath, `models/${model}.js`);
      if (fs.existsSync(modelPath)) {
        log.success(`Model exists: models/${model}.js`);
      } else {
        log.error(`Missing model: models/${model}.js`);
      }
    }

    // ==================== ENVIRONMENT CHECKS ====================
    log.section();
    log.title('🔐 ENVIRONMENT CONFIGURATION');

    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
    const envFile = path.join(backendPath, '.env');
    
    if (fs.existsSync(envFile)) {
      log.success('.env file exists');
    } else {
      log.error('.env file not found - create it with required variables');
    }

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        log.success(`${envVar} is configured`);
      } else {
        log.error(`${envVar} is not set in .env`);
      }
    }

    // ==================== FRONTEND CHECKS ====================
    log.section();
    log.title('⚛️  FRONTEND STRUCTURE');

    const srcPath = path.join(__dirname, '../../src');
    const frontendDirs = ['components', 'pages', 'data', 'services', 'context'];

    for (const dir of frontendDirs) {
      const dirPath = path.join(srcPath, dir);
      if (fs.existsSync(dirPath)) {
        log.success(`Directory exists: src/${dir}`);
      } else {
        log.error(`Missing directory: src/${dir}`);
      }
    }

    // Check critical frontend files
    const frontendFiles = ['App.jsx', 'main.jsx', 'index.css'];
    for (const file of frontendFiles) {
      const filePath = path.join(srcPath, file);
      if (fs.existsSync(filePath)) {
        log.success(`File exists: src/${file}`);
      } else {
        log.error(`Missing file: src/${file}`);
      }
    }

    // ==================== BUILD CONFIG CHECKS ====================
    log.section();
    log.title('⚙️  BUILD CONFIGURATION');

    const configFiles = [
      { path: 'vite.config.js', type: 'Vite' },
      { path: 'tailwind.config.js', type: 'Tailwind' },
      { path: 'postcss.config.js', type: 'PostCSS' }
    ];

    const rootPath = path.join(__dirname, '../../');  // Root of project
    for (const config of configFiles) {
      const configPath = path.join(rootPath, config.path);
      if (fs.existsSync(configPath)) {
        log.success(`${config.type} config exists: ${config.path}`);
      } else {
        log.warn(`${config.type} config missing: ${config.path}`);
      }
    }

    // ==================== SEED DATA CHECKS ====================
    log.section();
    log.title('🌱 SEED DATA');

    const seedFiles = ['seedProducts.js', 'seedProductsNew.js', 'seedCourses.js', 'seedContacts.js', 'seedBlogPosts.js', 'seedCaseStudies.js', 'seedSolutions.js'];
    for (const seed of seedFiles) {
      const seedPath = path.join(backendPath, `seeds/${seed}`);
      if (fs.existsSync(seedPath)) {
        log.success(`Seed script exists: ${seed}`);
      }
    }

    // ==================== PRODUCTION CHECKS ====================
    log.section();
    log.title('📋 PRODUCTION READINESS');

    if (process.env.NODE_ENV === 'production') {
      log.success('NODE_ENV set to production');
    } else {
      log.warn('NODE_ENV not set to production (development mode)');
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length > 20) {
      log.success('JWT_SECRET is strong (>20 characters)');
    } else {
      log.error('JWT_SECRET is weak or not set');
    }

    if (process.env.CORS_ORIGIN) {
      log.success('CORS_ORIGIN configured');
    } else {
      log.warn('CORS_ORIGIN not strictly configured (allowing all origins)');
    }

    // ==================== SUMMARY ====================
    log.section();
    console.log(`\n${CYAN}${'═'.repeat(50)}${RESET}`);
    console.log(`${GREEN}✅ CHECKS PASSED: ${checksPassed}${RESET}`);
    console.log(`${RED}❌ CHECKS FAILED: ${checksFailed}${RESET}`);
    console.log(`${CYAN}${'═'.repeat(50)}${RESET}\n`);

    if (checksFailed === 0) {
      console.log(`${GREEN}🎉 APPLICATION IS PRODUCTION-READY!${RESET}\n`);
      process.exit(0);
    } else {
      console.log(`${YELLOW}⚠️  Fix the ${checksFailed} issue(s) above before deploying${RESET}\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`\n${RED}❌ Audit failed: ${error.message}${RESET}\n`);
    process.exit(1);
  }
}

runAudit();
