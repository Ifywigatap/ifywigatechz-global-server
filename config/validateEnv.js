import logger from '../utils/logger.js';

/**
 * Validates that all critical environment variables are present.
 * If any are missing, it logs a fatal error and exits the process.
 */
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'PAYSTACK_SECRET_KEY',
    'SENTRY_DSN',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GROQ_API_KEY',
    'CORS_ORIGIN',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    const errorMessage = `❌ Missing critical environment variables: ${missingVars.join(', ')}. Application cannot start.`;
    logger.error(errorMessage); // Use 'error' for highest severity, as 'fatal' is not a default level
    process.exit(1); // Exit with a failure code
  }

  logger.info('✅ All critical environment variables are present.');
};