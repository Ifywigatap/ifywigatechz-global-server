import mongoose from 'mongoose';
import 'dotenv/config';
import Course from '../models/Course.js';
import { courses as rawCoursesData } from '../../src/data/courses.js';

// Helper function to convert level from frontend format to model format
function normalizeLevel(frontendLevel) {
  const levelMap = {
    'All Levels': 'intermediate',
    'Beginner': 'beginner',
    'Intermediate': 'intermediate',
    'Advanced': 'advanced',
  };
  return levelMap[frontendLevel] || 'beginner';
}

// Helper function to convert duration string to minutes
function durationToMinutes(durationStr) {
  if (typeof durationStr === 'number') return durationStr;
  if (!durationStr) return 0;
  
  // Extract numbers from strings like "25+ hours" or "2-3 weeks"
  const match = durationStr.match(/(\d+)/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  if (durationStr.includes('hour')) return value * 60;
  if (durationStr.includes('week')) return value * 40 * 60;
  if (durationStr.includes('minute')) return value;
  
  return value * 60; // Default to hours
}

// Add courseId to each course
const coursesData = rawCoursesData.map((course, index) => ({
  courseId: index + 1,
  title: course.title,
  slug: course.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-'),
  description: course.description || course.title,
  excerpt: course.excerpt || course.description?.substring(0, 200) || course.title,
  instructor: course.instructor || {
    name: 'Ify Wigatap',
    title: 'Tech Instructor',
    avatar: '/instructors/ify.jpg'
  },
  skills: course.skills || [],
  requirements: course.requirements || [],
  includes: course.includes || [],
  freeLesson: course.freeLesson,
  badge: course.badge,
  category: course.category || 'Other',
  level: normalizeLevel(course.level),
  price: course.priceValue || 0,
  discountPrice: course.discountPrice,
  duration: durationToMinutes(course.duration),
  thumbnail: course.thumbnail,
  featuredImage: course.featuredImage || course.thumbnail,
  tags: course.tags || [],
  modules: course.modules || [],
  ratings: {
    average: course.rating || 4.5,
    count: course.students || 0
  },
  status: 'published'
}));

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert courses with IDs
    const result = await Course.insertMany(coursesData);
    console.log(`✅ Successfully seeded ${result.length} courses with sequential IDs`);

    // Display summary
    console.log('📊 Courses Seeded:');
    result.forEach((course, index) => {
      console.log(`   ${index + 1}. [ID: ${course.courseId}] ${course.title} (₦${course.price})`);
    });

    // Verify all courseIds are unique
    const ids = result.map(c => c.courseId);
    const uniqueIds = new Set(ids);
    if (ids.length === uniqueIds.size) {
      console.log(`✅ All ${ids.length} courseIds are unique!`);
    } else {
      console.log(`⚠️  Warning: Duplicate courseIds detected!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    process.exit(1);
  }
}

seedCourses();
