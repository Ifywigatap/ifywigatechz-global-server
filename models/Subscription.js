import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'suspended', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: true
    },
    paymentMethod: {
      type: String,
      enum: ['paystack', 'stripe', 'bank_transfer'],
      default: 'paystack'
    },
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    features: [String],
    cancelledAt: Date,
    cancelReason: String
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
