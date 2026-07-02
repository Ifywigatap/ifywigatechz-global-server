import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';

// Import all products directly from the frontend data file
import { products as importedProducts } from '../data/products.js';

// Use imported products directly
const productsData = importedProducts;

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Generate slugs with duplicate handling
    const slugMap = {};
    const productsWithSlugs = productsData.map(product => {
      let slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      if (slugMap[slug]) {
        slugMap[slug]++;
        slug = `${slug}-${slugMap[slug]}`;
      } else {
        slugMap[slug] = 1;
      }
      
      return { ...product, slug };
    });

    // Insert products
    const result = await Product.insertMany(productsWithSlugs);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Display summary by category
    const categories = await Product.aggregate([
      { $group: { _id: '$mainCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Products Summary by Category:');
    let totalCount = 0;
    for (const cat of categories) {
      console.log(`   - ${cat._id}: ${cat.count}`);
      totalCount += cat.count;
    }
    console.log(`   - Total: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
