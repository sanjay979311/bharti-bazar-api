import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  ownerName: { type: String, default: '' },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  city: { type: String, enum: ['Khalilabad', 'Gorakhpur', 'Basti'], required: true },
  marketAddress: { type: String, required: true },
  mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  allowedSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
  gstNumber: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  planType: { type: String, enum: ['free', 'silver', 'gold'], default: 'free' },
  totalViews: { type: Number, default: 0 },
  totalLeadsGenerated: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Shop', shopSchema);