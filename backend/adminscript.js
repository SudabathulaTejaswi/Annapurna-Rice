import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

dotenv.config(); // ✅ Loads MONGO_URI from .env

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin already exists');
    } else {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashed });
      console.log('✅ Admin user created with username: admin & password: admin123');
    }
    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
