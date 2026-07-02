import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const backupDatabase = async () => {
  try {
    // 1. Ensure the 'backups' directory exists
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // 2. Create a folder for today's backup (e.g., 2026-05-02)
    const date = new Date().toISOString().split('T')[0];
    const folderPath = path.join(backupDir, date);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // 3. Dynamically fetch all collections from the database
    const collections = await mongoose.connection.db.collections();

    // 4. Export each collection's data to a JSON file
    for (let collection of collections) {
      const data = await collection.find({}).toArray();
      fs.writeFileSync(
        path.join(folderPath, `${collection.collectionName}.json`),
        JSON.stringify(data, null, 2)
      );
    }
    logger.info(`✅ Database backup completed successfully at /backups/${date}`);

    // 5. Clean up old backups (Delete folders older than 7 days)
    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stat = fs.statSync(filePath);
      const daysOld = (now - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysOld > 7) {
        fs.rmSync(filePath, { recursive: true, force: true });
        logger.info(`🗑️ Deleted old backup folder: ${file}`);
      }
    });

  } catch (error) {
    logger.error(`❌ Database backup failed: ${error.message}`);
  }
};