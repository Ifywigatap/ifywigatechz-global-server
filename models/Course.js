import mongoose from 'mongoose';
import sequence from 'mongoose-sequence';

const AutoIncrement = sequence(mongoose);

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: Number,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    instructor: {
      name: String,
      title: String,
      avatar: String
    },
    skills: [String],
    requirements: [String],
    includes: [String],
    freeLesson: String,
    badge: String,
    category: {
      type: String,
      required: true,
      enum: ['Web Development', 'Mobile Development', 'Design', 'Business', 'Data Science', 'Marketing', 'Cloud Computing', 'Artificial Intelligence', 'Cybersecurity', 'Database', 'Blockchain', 'Software Engineering', 'Data Analytics', 'Career Development', 'Other']
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    price: {
      type: Number,
      default: 0
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function(value) {
          return value == null || this.price == null || value <= this.price;
        },
        message: 'Discount price ({VALUE}) cannot be greater than the regular price'
      }
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    thumbnail: String,
    featuredImage: String,
    tags: [String],
    modules: [{
      title: String,
      description: String,
      lessons: [{
        title: String,
        description: String,
        videoUrl: String,
        duration: Number,
        order: Number
      }]
    }],
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Create slug from title
courseSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Cascade delete associated CourseProgress when a course is deleted
courseSchema.pre('findOneAndDelete', async function(next) {
  const courseId = this.getQuery()['_id'];
  if (courseId) {
    await mongoose.model('CourseProgress').deleteMany({ courseId: courseId.toString() });
    await mongoose.model('Enrollment').deleteMany({ course: courseId });
  }
  next();
});

// Add text indexing for the search API
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

// Add a compound index to optimize the frequently used filter in getAllCourses
courseSchema.index({ category: 1, status: 1, isActive: 1 });

// Apply auto-increment plugin for courseId
courseSchema.plugin(AutoIncrement, { inc_field: 'courseId' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
