import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
