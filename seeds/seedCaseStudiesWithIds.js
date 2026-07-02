import mongoose from 'mongoose';
import 'dotenv/config';
import CaseStudy from '../models/CaseStudy.js';
import { caseStudies as rawCaseStudiesData } from '../../src/data/caseStudies.js';

// Add caseStudyId to each case study
const caseStudiesData = rawCaseStudiesData.map((caseStudy, index) => ({
  caseStudyId: caseStudy.caseStudyId || (index + 1),
  title: caseStudy.title,
  slug: caseStudy.slug || caseStudy.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-'),
  description: caseStudy.description || caseStudy.title,
  challenge: caseStudy.challenge || caseStudy.problem || caseStudy.description,
  solution: caseStudy.solution || caseStudy.description,
  results: caseStudy.results || [],
  company: caseStudy.company || 'Client Company',
  industry: caseStudy.industry,
  technologies: caseStudy.technologies || [],
  timeline: caseStudy.timeline,
  client: caseStudy.client || 'Client',
  image: caseStudy.image || '/case-studies/default.jpg',
  featured: caseStudy.featured !== undefined ? caseStudy.featured : (index < 5),
  status: caseStudy.status || 'published'
}));

async function seedCaseStudies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing case studies
    await CaseStudy.deleteMany({});
    console.log('🗑️  Cleared existing case studies');

    // Insert case studies with IDs
    const result = await CaseStudy.insertMany(caseStudiesData);
    console.log(`\n✅ Successfully seeded ${result.length} case studies with sequential IDs`);

    // Display summary
    console.log('\n📊 Case Studies Seeded:');
    result.forEach((cs, index) => {
      console.log(`   ${index + 1}. [ID: ${cs.caseStudyId}] ${cs.title} - ${cs.company}`);
    });

    // Verify all caseStudyIds are unique
    const ids = result.map(cs => cs.caseStudyId);
    const uniqueIds = new Set(ids);
    if (ids.length === uniqueIds.size) {
      console.log(`\n✅ All ${ids.length} case study IDs are unique!`);
    } else {
      console.log(`\n⚠️  Warning: Duplicate case study IDs detected!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding case studies:', error.message);
    process.exit(1);
  }
}

seedCaseStudies();
