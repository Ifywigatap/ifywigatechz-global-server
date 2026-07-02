import mongoose from 'mongoose';
import 'dotenv/config';
import BlogPost from '../models/BlogPost.js';
import User from '../models/User.js';
import { blogPosts } from '../data/blogPosts.js';

async function seedBlogPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log('🗑️  Cleared existing blog posts');

    // Get or create default admin user for author
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = await User.create({
        name: 'Ify Wigatap',
        email: 'admin@ifywigatechz.com',
        password: 'Admin@12345',  // Remember to update this
        role: 'admin'
      });
      console.log('👤 Created default admin user');
    }

    // Add author to all posts
    const postsWithAuthor = blogPosts.map(post => ({
      ...post,
      author: adminUser._id
    }));

    // Insert blog posts
    const result = await BlogPost.insertMany(postsWithAuthor);
    console.log(`✅ Successfully seeded ${result.length} blog posts`);

    // Display summary
    const categories = await BlogPost.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Blog Posts Summary by Category:');
    let totalCount = 0;
    for (const cat of categories) {
      console.log(`   - ${cat._id}: ${cat.count}`);
      totalCount += cat.count;
    }
    console.log(`   - Total: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error.message);
    process.exit(1);
  }
}

seedBlogPosts();
