import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import { products as rawProductsData } from '../../src/data/products.js';

// Function to generate unique slug
function generateUniqueSlug(name, index, allNames) {
  let slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  // Check if this name appears earlier in the list
  const previousOccurrences = allNames.slice(0, index).filter(n => n === name).length;
  
  if (previousOccurrences > 0) {
    slug = `${slug}-${previousOccurrences + 1}`;
  }
  
  return slug;
}

// Extract all product names for duplicate detection
const allProductNames = rawProductsData.map(p => p.name);

// Add productId to each product with unique slugs
const productsData = rawProductsData.map((product, index) => {
  const slug = generateUniqueSlug(product.name, index, allProductNames);
  
  return {
    productId: index + 1,
    name: product.name,
    slug,
    description: product.description || product.name,
    shortDescription: product.shortDescription || product.description?.substring(0, 200) || product.name,
    mainCategory: product.mainCategory || 'Other',
    subCategory: product.subCategory || 'General',
    brand: product.brand,
    price: product.price || 0,
    discountPrice: product.discountPrice,
    image: product.image || '/images/placeholder.jpg',
    gallery: product.gallery || [product.image || '/images/placeholder.jpg'],
    stock: product.stock !== false ? product.stock || 100 : 0,
    rating: product.rating || 0,
    reviews: product.reviews || [],
    tags: product.tags || [],
    specifications: product.specifications || {},
    status: 'active'
  };
});

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

    // Insert products with IDs
    const result = await Product.insertMany(productsData);
    console.log(`\n✅ Successfully seeded ${result.length} products with sequential IDs`);

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

    // Verify all productIds are unique
    const ids = result.map(p => p.productId);
    const uniqueIds = new Set(ids);
    if (ids.length === uniqueIds.size) {
      console.log(`\n✅ All ${ids.length} productIds are unique!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
}

seedProducts();
