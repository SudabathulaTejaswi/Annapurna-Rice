import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ msg: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  res.json({ token, admin: { username: admin.username } });
};
