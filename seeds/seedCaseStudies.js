import mongoose from 'mongoose';
import 'dotenv/config';
import CaseStudy from '../models/CaseStudy.js';
import { caseStudies } from '../data/caseStudies.js';

async function seedCaseStudies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing case studies
    await CaseStudy.deleteMany({});
    console.log('🗑️  Cleared existing case studies');

    // Insert case studies
    const result = await CaseStudy.insertMany(caseStudies);
    console.log(`✅ Successfully seeded ${result.length} case studies`);

    // Display summary by industry
    const industries = await CaseStudy.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Case Studies Summary by Industry:');
    let totalCount = 0;
    for (const ind of industries) {
      console.log(`   - ${ind._id}: ${ind.count}`);
      totalCount += ind.count;
    }
    console.log(`   - Total: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding case studies:', error.message);
    process.exit(1);
  }
}

seedCaseStudies();
