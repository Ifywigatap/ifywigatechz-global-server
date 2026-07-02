import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email'
      ]
    },
    phone: String,
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: [10, 'Message must be at least 10 characters']
    },
    category: {
      type: String,
      enum: ['general', 'support', 'sales', 'partnership', 'feedback'],
      default: 'general'
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'closed'],
      default: 'new'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    attachments: [String],
    response: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      respondedAt: Date
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
