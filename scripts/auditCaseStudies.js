import mongoose from 'mongoose';
import 'dotenv/config';
import CaseStudy from '../models/CaseStudy.js';

async function auditCaseStudies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Check Case Studies
    console.log('📋 CASE STUDY AUDIT:');
    const caseStudies = await CaseStudy.find().sort({ caseStudyId: 1 });
    
    if (caseStudies.length === 0) {
      console.log('⚠️  No case studies found. Run: node server/seeds/seedCaseStudiesWithIds.js');
    } else {
      let issues = 0;
      caseStudies.forEach((cs, idx) => {
        const hasId = cs.caseStudyId !== undefined && cs.caseStudyId !== null;
        const hasMongoId = cs._id !== undefined;
        const hasSlug = cs.slug !== undefined;
        const hasCompany = cs.company !== undefined && cs.company !== null;
        const hasChallenge = cs.challenge !== undefined && cs.challenge !== null;
        const hasSolution = cs.solution !== undefined && cs.solution !== null;
        
        if (!hasId || !hasMongoId || !hasSlug || !hasCompany || !hasChallenge || !hasSolution) {
          console.log(`   ⚠️  Case Study ${idx + 1}: Missing ${!hasId ? 'caseStudyId ' : ''}${!hasMongoId ? '_id ' : ''}${!hasSlug ? 'slug ' : ''}${!hasCompany ? 'company ' : ''}${!hasChallenge ? 'challenge ' : ''}${!hasSolution ? 'solution' : ''}`);
          issues++;
        } else {
          console.log(`   ✅ ID=${cs.caseStudyId} | Slug=${cs.slug.substring(0, 40)}... | Company=${cs.company.substring(0, 25)}...`);
        }
      });
      
      if (issues === 0) {
        console.log(`✅ All ${caseStudies.length} case studies have valid data!`);
      } else {
        console.log(`❌ Found ${issues}/${caseStudies.length} case studies with data issues`);
      }
    }

    // Verify uniqueness
    console.log('🔍 UNIQUENESS CHECK:');
    
    const csWithId = caseStudies.filter(cs => cs.caseStudyId);
    const csIds = csWithId.map(cs => cs.caseStudyId);
    const uniqueIds = new Set(csIds);
    
    if (csIds.length === uniqueIds.size) {
      console.log(`   ✅ All case study IDs are unique (${uniqueIds.size})`);
    } else {
      console.log(`   ❌ Duplicate case study IDs found! (${csIds.length} total, ${uniqueIds.size} unique)`);
    }

    const slugs = caseStudies.map(cs => cs.slug).filter(s => s);
    const uniqueSlugs = new Set(slugs);
    
    if (slugs.length === uniqueSlugs.size) {
      console.log(`   ✅ All slugs are unique (${uniqueSlugs.size})`);
    } else {
      console.log(`   ❌ Duplicate slugs found! (${slugs.length} total, ${uniqueSlugs.size} unique)`);
    }

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Total Case Studies: ${caseStudies.length}`);
    console.log(`   With IDs: ${csWithId.length}`);
    console.log(`   Featured: ${caseStudies.filter(cs => cs.featured).length}`);
    console.log(`   Published: ${caseStudies.filter(cs => cs.status === 'published').length}`);
    console.log(`   Draft: ${caseStudies.filter(cs => cs.status === 'draft').length}`);

    console.log('✅ Audit complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Audit error:', error.message);
    process.exit(1);
  }
}

auditCaseStudies();
