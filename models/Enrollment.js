import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate enrollments by ensuring the combination of user and course is unique
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);