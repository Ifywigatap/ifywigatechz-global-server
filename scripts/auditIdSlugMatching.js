import mongoose from 'mongoose';
import 'dotenv/config';
import Course from '../models/Course.js';
import Product from '../models/Product.js';

async function auditIdSlugMatching() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Check Courses
    console.log('\n📚 COURSE ID/SLUG AUDIT:\n');
    const courses = await Course.find().sort({ courseId: 1 });
    
    if (courses.length === 0) {
      console.log('⚠️  No courses found. Run: node server/seeds/seedCoursesWithIds.js');
    } else {
      let issues = 0;
      courses.forEach((course, idx) => {
        const hasId = course.courseId !== undefined && course.courseId !== null;
        const hasMongoId = course._id !== undefined;
        const hasSlug = course.slug !== undefined;
        
        if (!hasId || !hasMongoId || !hasSlug) {
          console.log(`   ⚠️  Course ${idx + 1}: Missing ${!hasId ? 'courseId' : ''} ${!hasMongoId ? '_id' : ''} ${!hasSlug ? 'slug' : ''}`);
          issues++;
        } else {
          console.log(`   ✅ ID=${course.courseId} | Slug=${course.slug} | MongoDB=${course._id.toString().substring(0, 8)}...`);
        }
      });
      
      if (issues === 0) {
        console.log(`\n✅ All ${courses.length} courses have valid ID/slug matching!`);
      } else {
        console.log(`\n❌ Found ${issues}/${courses.length} courses with ID/slug issues`);
      }
    }

    // Check Products
    console.log('\n\n🛍️  PRODUCT ID/SLUG AUDIT:\n');
    const products = await Product.find().sort({ productId: 1 });
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Run: node server/seeds/seedProductsWithIds.js');
    } else {
      let issues = 0;
      products.forEach((product, idx) => {
        const hasId = product.productId !== undefined && product.productId !== null;
        const hasMongoId = product._id !== undefined;
        const hasSlug = product.slug !== undefined;
        
        if (!hasId || !hasMongoId || !hasSlug) {
          console.log(`   ⚠️  Product ${idx + 1}: Missing ${!hasId ? 'productId' : ''} ${!hasMongoId ? '_id' : ''} ${!hasSlug ? 'slug' : ''}`);
          issues++;
        } else {
          console.log(`   ✅ ID=${product.productId} | Slug=${product.slug} | MongoDB=${product._id.toString().substring(0, 8)}...`);
        }
      });
      
      if (issues === 0) {
        console.log(`\n✅ All ${products.length} products have valid ID/slug matching!`);
      } else {
        console.log(`\n❌ Found ${issues}/${products.length} products with ID/slug issues`);
      }
    }

    // Verify uniqueness
    console.log('\n\n🔍 UNIQUENESS CHECK:\n');
    
    const coursesWithId = courses.filter(c => c.courseId);
    const courseIds = coursesWithId.map(c => c.courseId);
    const uniqueCourseIds = new Set(courseIds);
    
    if (courseIds.length === uniqueCourseIds.size) {
      console.log(`   ✅ All course IDs are unique (${uniqueCourseIds.size})`);
    } else {
      console.log(`   ❌ Duplicate course IDs found! (${courseIds.length} total, ${uniqueCourseIds.size} unique)`);
    }

    const productsWithId = products.filter(p => p.productId);
    const productIds = productsWithId.map(p => p.productId);
    const uniqueProductIds = new Set(productIds);
    
    if (productIds.length === uniqueProductIds.size) {
      console.log(`   ✅ All product IDs are unique (${uniqueProductIds.size})`);
    } else {
      console.log(`   ❌ Duplicate product IDs found! (${productIds.length} total, ${uniqueProductIds.size} unique)`);
    }

    console.log('\n✅ Audit complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Audit error:', error.message);
    process.exit(1);
  }
}

auditIdSlugMatching();
