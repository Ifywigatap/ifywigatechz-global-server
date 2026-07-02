import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

// Load environment variables
dotenv.config();

const backfillCourseIds = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Find all courses that do not have a courseId yet
    const coursesToUpdate = await Course.find({ courseId: { $exists: false } });
    console.log(`Found ${coursesToUpdate.length} courses missing a courseId.`);

    for (const course of coursesToUpdate) {
      // By calling .save(), mongoose-sequence will intercept it
      // and automatically assign the next available courseId
      await course.save();
      console.log(`Updated course: "${course.title}" (New ID assigned)`);
    }

    console.log('Backfill complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during backfill:', error);
    process.exit(1);
  }
};

backfillCourseIds();