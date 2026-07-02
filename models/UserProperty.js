import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

const userPropertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: String,
  images: [
    {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'sold', 'pending'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-delete hook to remove images from Cloudinary before the document is deleted
userPropertySchema.pre('findOneAndDelete', async function(next) {
  try {
    const property = await this.model.findOne(this.getQuery());
    if (property && property.images && property.images.length > 0) {
      const deletePromises = property.images.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('UserProperty', userPropertySchema);
