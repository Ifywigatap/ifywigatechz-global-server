import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'success',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);