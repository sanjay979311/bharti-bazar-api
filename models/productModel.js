import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
    default: null,
    index: true
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  min_order_quantity: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  location: {
    city: { type: String, required: true, index: true }, // e.g., "Gorakhpur", "Khalilabad", "Basti"
    market_area: String // e.g., "Bardahiya Bazar", "Sahabganj Mandi"
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Fixed: Corrected schema variable name here
ProductSchema.index({ product_name: 'text', description: 'text' });

const Product = mongoose.model('Product', ProductSchema);
export default Product;