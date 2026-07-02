import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema(
  {
    caseStudyId: {
      type: Number,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    company: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    description: String,
    challenge: {
      type: String,
      required: true
    },
    solution: {
      type: String,
      required: true
    },
    results: [
      {
        metric: String,
        value: String,
        description: String
      }
    ],
    technologies: [String],
    images: {
      featured: String,
      gallery: [String]
    },
    testimonial: {
      text: String,
      author: String,
      position: String,
      avatar: String
    },
    link: String,
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Auto-generate slug from title
caseStudySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
