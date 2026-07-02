import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    default: 'Completed'
  },
  instructor: {
    type: String,
    default: 'Ifeanyichukwu Oko Isu'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['valid', 'revoked'],
    default: 'valid'
  }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);