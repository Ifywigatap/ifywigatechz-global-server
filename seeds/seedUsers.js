import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import 'dotenv/config';

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Admin user
  const adminEmail = 'admin@ifywigatechz.com';
  const adminPassword = 'Admin@12345678!';
  
  const adminHash = await bcrypt.hash(adminPassword, 12);

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: 'Super Admin',
      email: adminEmail,
      password: adminHash,
      role: 'admin',
      isVerified: true,
      isActive: true
    },
    { upsert: true, new: true }
  );

  console.log('✅ Admin user created/updated');
  process.exit(0);
}

seedUsers().catch(console.error);

