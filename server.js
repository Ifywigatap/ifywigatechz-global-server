import { envPath } from './config/env.js'; // 👈 MUST be the first import
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import cron from 'node-cron';

// 🔐 Security
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// 📦 Database
import connectDB from './config/db.js';
import mongoose from 'mongoose';

// ⚠️ Error handler
import { errorHandler } from './middleware/errorHandler.js';

// ⚡ Rate limiters
import { 
  authRateLimiter, 
  loginRateLimiter, 
  apiRateLimiter, 
  chatRateLimiter, 
  contactRateLimiter 
} from './middleware/rateLimit.js';

// 🧠 Audit log
import { auditLog } from './middleware/auditLog.js';

// 🌐 Routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import blogRoutes from './routes/blog.js';
import caseStudyRoutes from './routes/caseStudy.js';
import courseRoutes from './routes/courses.js';
import productRoutes from './routes/products.js';
import solutionRoutes from './routes/solutions.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import realestateRoutes from './routes/realestate.js';
import paymentsRoutes from './routes/payments.js';
import chatRoutes from './routes/chat.js';

// 📝 Request logging
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import logger from './utils/logger.js';
import { backupDatabase } from './utils/backup.js';
import { cleanupFeaturedProperties } from './utils/propertyCleanup.js';

// 📁 Path setup

logger.info(`📄 Loaded ENV: ${envPath}`);
// Avoid logging the full MongoDB URI to the file for security, just verify it exists
logger.info(`🗄️ MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`);

// Initialize Sentry for Node.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // Capture 10% in Prod, 100% in Dev
  environment: process.env.NODE_ENV || 'production',
});

// Safely catch synchronous uncaught exceptions to prevent zombie processes
process.on('uncaughtException', (err) => {
  logger.error(`💥 UNCAUGHT EXCEPTION! Shutting down... \n${err.stack}`);
  process.exit(1);
});

const app = express();

// ===============================
// 🌐 PROXY CONFIGURATION
// ===============================
// Essential for accurate rate-limiting if hosted behind a reverse proxy (Heroku, Render, Nginx, etc.)
app.set('trust proxy', 1);

// ===============================
// 🔐 GLOBAL MIDDLEWARE
// ===============================

// Security
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
app.use(compression());

// CORS
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : [process.env.VITE_FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsing (with security limits)
app.use(express.json({ limit: '50mb' })); // Increased to support video Data URIs
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Request logging
// Pipe Morgan HTTP logs directly into our Winston logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// ===============================
// ⚡ RATE LIMITING
// ===============================

// Global API limiter (applies to all routes under /api)
app.use('/api', apiRateLimiter);
app.use('/api/auth/login', loginRateLimiter);
app.use('/api/auth', authRateLimiter);
app.use('/api/chat', chatRateLimiter);
app.use('/api/contacts', contactRateLimiter);

// ===============================
// 🧠 AUDIT LOGGING
// ===============================

app.use('/api/auth', auditLog);

// ===============================
// 🧪 HEALTH CHECK
// ===============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Server is running 🚀',
  });
});

// ===============================
// ✅ READINESS / LIVENESS
// ===============================
// Useful for platforms to verify the app is up and DB status
app.get('/api/ready', (req, res) => {
  const readyState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  res.status(200).json({
    ok: readyState === 1,
    dbState: readyState,
  });
});

// ===============================
// 🚀 API ROUTES
// ===============================

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/realestate', realestateRoutes);
app.use('/api/payments', paymentsRoutes); // ✅ FIXED
app.use('/api/chat', chatRoutes); // Ensure this points to the correct chat routes file

// ===============================
// 🏠 ROOT ROUTE
// ===============================

app.get('/', (req, res) => {
  res.send('🚀 IFYWIGATECHZ API is running...');
});

// ===============================
// ❌ 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found',
  });
});

// ===============================
// ⚠️ ERROR HANDLER
// ===============================

// The Sentry error handler MUST be placed before your custom error handler
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

// ===============================
// 🚀 START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Start HTTP server first so the platform (Render, Heroku, etc.) can detect a bound port.
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🆔 PID: ${process.pid}`);
  });

  // Graceful Shutdown Handler
  const gracefulShutdown = () => {
    logger.info('🛑 Received kill signal, shutting down gracefully...');
    server.close(() => {
      logger.info('✅ HTTP server closed.');
      mongoose.connection.close(false).then(() => {
        logger.info('✅ MongoDB connection closed.');
        process.exit(0);
      }).catch(() => process.exit(0));
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Safely catch unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`💥 UNHANDLED REJECTION! Shutting down gracefully... \n${err.stack}`);
    server.close(() => {
      process.exit(1);
    });
  });

  // Attempt to connect to the database asynchronously. If it fails, keep the server up
  // so the platform detects the open port; log the error for debugging.
  try {
    await connectDB();

    // 📅 Schedule Database Backup (Runs every day at midnight server-time)
    cron.schedule('0 0 * * *', () => {
      logger.info('⏳ Starting scheduled database backup...');
      backupDatabase();
    });

    // 🏠 Schedule Featured Property Cleanup (Runs every hour)
    cron.schedule('0 * * * *', () => {
      cleanupFeaturedProperties();
    });
  } catch (error) {
    logger.error(`❌ Failed to connect to DB after starting HTTP server: ${error.message}`);
    // Do not exit here so the platform sees the port bound. If your app requires DB,
    // consider failing the deploy by exiting or use health checks that verify DB.
  }
};

startServer();