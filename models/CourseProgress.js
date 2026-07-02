import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String, // Can be a dynamic DB ObjectId or an Academy course key (e.g., 'web3', 'ai')
    required: true
  },
  completedModules: [{
    type: String // Stores module IDs like '01', '02'
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a user only has one progress document per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('CourseProgress', courseProgressSchema);