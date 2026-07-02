import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [12, 'Password must be at least 12 characters'],
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple documents to have a null value for this unique field
    },

    phone: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['user', 'subscriber', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: Date,
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    company: String,
    website: String,
    location: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      marketingEmails: {
        type: Boolean,
        default: true
      },
      orderUpdates: {
        type: Boolean,
        default: true
      }
    },
    billingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    lastLogin: Date,

    isActive: {
      type: Boolean,
      default: true
    },
    refreshToken: {
      type: String,
      select: false
    },
    refreshTokenExpiry: {
      type: Date,
      select: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }

);

// Hash password before saving

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
