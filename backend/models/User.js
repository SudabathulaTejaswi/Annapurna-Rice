import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: String,
  otpExpiry: Date,
  googleId: String,
});

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password !== null) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default mongoose.model('User', userSchema);
