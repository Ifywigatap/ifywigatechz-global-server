import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import Blog Posts from frontend and convert to backend format
 */
async function importBlogPosts() {
  try {
    const frontendPath = path.join(__dirname, '../../src/data/posts.js');
    const content = fs.readFileSync(frontendPath, 'utf-8');

    const match = content.match(/export const posts = \[([\s\S]*)\];/);
    
    if (!match) {
      console.error('❌ Could not find posts array');
      process.exit(1);
    }

    let posts;
    try {
      const jsonStr = '[' + match[1] + ']';
      posts = eval('(' + jsonStr + ')');
    } catch (e) {
      console.error('❌ Error parsing posts:', e.message);
      process.exit(1);
    }

    // Map categories from frontend to backend enums
    const categoryMap = {
      'Web Development': 'Development',
      'UI/UX Design': 'Design',
      'Technology': 'Technology',
      'Business': 'Business',
      'Tutorial': 'Tutorial'
    };

    // Convert posts to backend format
    const convertedPosts = posts.map(post => ({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: categoryMap[post.category] || 'Technology',
      tags: post.tags || [],
      featuredImage: post.coverImage || null,
      status: post.status || 'published',
      author: null  // Will be set during seeding with default user
    }));

    const outputPath = path.join(__dirname, '../data/blogPosts.js');
    const outputContent = `export const blogPosts = ${JSON.stringify(convertedPosts, null, 2)};`;
    
    fs.writeFileSync(outputPath, outputContent);

    console.log(`✅ Successfully imported ${convertedPosts.length} blog posts!`);
    console.log(`📁 Output: server/data/blogPosts.js`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importBlogPosts();
