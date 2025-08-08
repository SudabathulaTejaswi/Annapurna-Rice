import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../utils/sendEmail.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ msg: 'Email already exists' });
    const user = await User.create({
      name,
      phone,
      email,
      password: password,
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name, phone, email },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Signup failed', error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res
        .status(400)
        .json({ msg: 'User not found or registered via Google' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Incorrect password' });

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, email },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ msg: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ msg: 'OTP sent to your email address' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
  }
};

// VERIFY OTP AND RESET PASSWORD
export const verifyOTPAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      new Date() > new Date(user.otpExpiry)
    ) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Error resetting password', error: err.message });
  }
};

// GOOGLE LOGIN CALLBACK
export const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
};
