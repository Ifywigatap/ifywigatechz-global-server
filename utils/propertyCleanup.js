import UserProperty from '../models/UserProperty.js';
import logger from './logger.js';

export const cleanupFeaturedProperties = async () => {
  try {
    const now = new Date();
    const result = await UserProperty.updateMany(
      { 
        isFeatured: true, 
        featuredExpiry: { $lte: now } 
      },
      { $set: { isFeatured: false } }
    );

    if (result.modifiedCount > 0) {
      logger.info(`✨ Cleaned up ${result.modifiedCount} expired featured properties.`);
    }
  } catch (error) {
    logger.error(`❌ Error during featured property cleanup: ${error.message}`);
  }
};