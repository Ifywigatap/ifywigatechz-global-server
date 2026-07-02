import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import { products as importedProducts } from '../data/products.js';

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

    // Generate slugs for all products and handle duplicates
    const slugMap = {};
    const productsWithSlugs = importedProducts.map(product => {
      let slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // Handle duplicate slugs
      if (slugMap[slug]) {
        slugMap[slug]++;
        slug = `${slug}-${slugMap[slug]}`;
      } else {
        slugMap[slug] = 1;
      }
      
      return {
        ...product,
        slug
      };
    });

    // Insert products
    const result = await Product.insertMany(productsWithSlugs);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Display summary by category
    const categories = await Product.collection.aggregate([
      {
        $group: {
          _id: "$mainCategory",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('\n📊 Products Summary by Category:');
    let total = 0;
    for (const cat of categories) {
      console.log(`   - ${cat._id}: ${cat.count}`);
      total += cat.count;
    }
    console.log(`   - Total: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
}

seedProducts();
