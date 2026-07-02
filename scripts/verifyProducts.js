import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';

async function verifyProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Check products with images
    const productsWithImages = await Product.find({ image: { $exists: true, $ne: null } }).limit(5);
    const productsWithoutImages = await Product.find({ image: { $exists: false } });

    console.log(`\n✅ Products with images: ${await Product.countDocuments({ image: { $exists: true, $ne: null } })}`);
    console.log(`❌ Products without images: ${productsWithoutImages.length}`);

    if (productsWithImages.length > 0) {
      console.log('\n📋 Sample products with images:');
      productsWithImages.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   Image: ${p.image}`);
        console.log(`   Category: ${p.mainCategory}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyProducts();
