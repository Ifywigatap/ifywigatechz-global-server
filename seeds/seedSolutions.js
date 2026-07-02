import mongoose from 'mongoose';
import 'dotenv/config';
import Solution from '../models/Solution.js';
import { solutions } from '../data/solutions.js';

async function seedSolutions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing solutions
    await Solution.deleteMany({});
    console.log('🗑️  Cleared existing solutions');

    // Insert solutions
    const result = await Solution.insertMany(solutions);
    console.log(`✅ Successfully seeded ${result.length} solutions`);

    // Display summary by category
    const categories = await Solution.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Solutions Summary by Category:');
    let totalCount = 0;
    for (const cat of categories) {
      console.log(`   - ${cat._id}: ${cat.count}`);
      totalCount += cat.count;
    }
    console.log(`   - Total: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding solutions:', error.message);
    process.exit(1);
  }
}

seedSolutions();
