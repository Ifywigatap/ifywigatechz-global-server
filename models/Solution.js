import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a solution title'],
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
      required: [true, 'Please provide a solution description']
    },
    overview: {
      type: String,
      maxlength: [1000, 'Overview cannot be more than 1000 characters']
    },
    category: {
      type: String,
      required: true,
      enum: ['Web Development', 'Mobile App', 'Data Analytics', 'Cloud', 'AI/ML', 'E-commerce', 'Other']
    },
    industry: [String], // e.g., ['Fintech', 'Healthcare', 'Retail']
    thumbnail: String,
    heroImage: String,
    features: [
      {
        title: String,
        description: String,
        icon: String
      }
    ],
    benefits: [
      {
        title: String,
        description: String
      }
    ],
    caseStudies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseStudy'
    }],
    technologies: [String], // e.g., ['React', 'Node.js', 'MongoDB']
    pricing: {
      model: {
        type: String,
        enum: ['fixed', 'hourly', 'custom'],
        default: 'custom'
      },
      startingPrice: Number,
      description: String
    },
    testimonials: [{
      clientName: String,
      clientTitle: String,
      clientImage: String,
      quote: String,
      company: String,
      rating: Number
    }],
    process: [
      {
        step: Number,
        title: String,
        description: String
      }
    ],
    faq: [
      {
        question: String,
        answer: String
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'coming-soon'],
      default: 'active'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create slug from title
solutionSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const Solution = mongoose.model('Solution', solutionSchema);
export default Solution;
