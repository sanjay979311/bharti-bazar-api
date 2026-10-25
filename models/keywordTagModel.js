import mongoose from 'mongoose';

const KeywordTagSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true // e.g., "onion", "jeans", "wheat", "cotton saree"
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // Auto Category Suggestion ke liye Direct Link
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // 💡 Smart Unit Suggestion: Is keyword ke liye kaun-kaun si Units allowed hain
  // e.g., Onion ke liye: [Unit_ID_for_Kg, Unit_ID_for_Quintal, Unit_ID_for_Ton, Unit_ID_for_Bag]
  allowed_units: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  }],
  // Auto-Select Default Unit (Primary Unit)
  default_unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  target_hubs: [{
    type: String,
    trim: true // e.g., ["Gorakhpur", "Khalilabad", "Basti"]
  }],
  search_count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

KeywordTagSchema.index({ keyword: 'text' });

const KeywordTag = mongoose.model('KeywordTag', KeywordTagSchema);
export default KeywordTag;