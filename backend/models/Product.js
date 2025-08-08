import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  store: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model('Product', productSchema);
