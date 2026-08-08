import logger from '../utils/logger.js';

/**
 * Validates that all critical environment variables are present.
 * If any are missing, it logs a fatal error and exits the process.
 */
export const validateEnvironment = () => {
  if (!process.env.NODE_ENV) {
    logger.warn('⚠️ NODE_ENV is not set. Defaulting to development.');
    process.env.NODE_ENV = 'development';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (!process.env.PORT) {
    logger.info('ℹ️ PORT not set. Defaulting to 5000.');
    process.env.PORT = '5000';
  }

  if (!process.env.JWT_EXPIRE) {
    logger.info('ℹ️ JWT_EXPIRE not set. Defaulting to 15m.');
    process.env.JWT_EXPIRE = '15m';
  }

  if (!process.env.CORS_ORIGIN) {
    const frontendOrigin = process.env.VITE_FRONTEND_URL || process.env.FRONTEND_URL;
    if (frontendOrigin) {
      process.env.CORS_ORIGIN = frontendOrigin;
    } else if (!isProduction) {
      process.env.CORS_ORIGIN = 'http://localhost:5173,http://localhost:3000';
    } else {
      logger.warn('⚠️ CORS_ORIGIN not set. Configure it in Render for your frontend domain.');
    }
  }

  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const optionalProductionEnvVars = [
    'PAYSTACK_SECRET_KEY',
    'SENTRY_DSN',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GROQ_API_KEY',
  ];

  const missingRequired = requiredEnvVars.filter((varName) => !process.env[varName]);
  const missingOptional = isProduction
    ? optionalProductionEnvVars.filter((varName) => !process.env[varName])
    : [];

  if (missingRequired.length > 0) {
    const errorMessage = `❌ Missing required environment variables: ${missingRequired.join(', ')}. Application cannot start.`;
    logger.error(errorMessage);
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    logger.warn(`⚠️ Missing optional production variables: ${missingOptional.join(', ')}.`);
  }

  logger.info('✅ Environment validation completed.');
};