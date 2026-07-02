import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      unique: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    content: {
      type: String,
      required: [true, 'Please provide content']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Business', 'Design', 'Development', 'Tutorial']
    },
    tags: [String],
    featuredImage: String,
    viewCount: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    seo: {
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
