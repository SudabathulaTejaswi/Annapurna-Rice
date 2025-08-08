import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  store: { type: String, enum: ['rice', 'grocery'], required: true },
  originalPrice: { type: Number  },
  discountPrice: { type: Number },
  image: {
    data: Buffer,
    contentType: String
  },
}, { timestamps: true });

export default mongoose.model('Offer', OfferSchema);
