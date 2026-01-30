import mongoose from 'mongoose';

const quantitySchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "1 Kg", "5 Kg"
    price: { type: Number, required: true }, // price for that quantity
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,

  // OLD PRICE (kept for backward compatibility)
  price: Number,

  // NEW FEATURE (ADDED)
  quantities: [quantitySchema],

  store: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model('Product', productSchema);
