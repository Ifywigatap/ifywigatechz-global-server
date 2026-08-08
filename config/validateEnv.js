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

  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'CORS_ORIGIN',
  ];

  const productionRequiredEnvVars = [
    'PAYSTACK_SECRET_KEY',
    'SENTRY_DSN',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GROQ_API_KEY',
  ];

  const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingProduction = process.env.NODE_ENV === 'production'
    ? productionRequiredEnvVars.filter(varName => !process.env[varName])
    : [];
  const missingOptional = process.env.NODE_ENV !== 'production'
    ? productionRequiredEnvVars.filter(varName => !process.env[varName])
    : [];

  if (missingRequired.length > 0) {
    const errorMessage = `❌ Missing required environment variables: ${missingRequired.join(', ')}. Application cannot start.`;
    logger.error(errorMessage);
    process.exit(1);
  }

  if (missingProduction.length > 0) {
    const errorMessage = `❌ Missing production environment variables: ${missingProduction.join(', ')}. Application cannot start in production.`;
    logger.error(errorMessage);
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    logger.warn(`⚠️ Missing optional production environment variables for development: ${missingOptional.join(', ')}.`);
  }

  logger.info('✅ Environment validation completed.');
};