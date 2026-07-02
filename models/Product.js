import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Name cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot be more than 500 characters']
    },
    mainCategory: {
      type: String,
      required: true
    },
    subCategory: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    image: String,
    images: [
      {
        url: String,
        alt: String,
        isPrimary: Boolean
      }
    ],
    features: [String],
    specifications: [{
      name: String,
      value: String
    }],
    stock: {
      type: Boolean,
      default: true
    },
    dosage: String,
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
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
    tags: [String],
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active'
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

// Create slug from name
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
