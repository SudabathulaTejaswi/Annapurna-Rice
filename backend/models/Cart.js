import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  title:String,
  price: Number,
  discountPrice: Number,
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart; // ✅ ES module export
