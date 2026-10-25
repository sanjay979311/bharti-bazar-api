import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  level: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
    default: 1
  },
  category_type: {
    type: String,
    enum: ['PRODUCT', 'SERVICE', 'BOTH'],
    required: true,
    default: 'PRODUCT',
    index: true
  },
  image: {
    type: String,
    default: null // Image is optional
  },
  parent_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  alternate_names: [{
    type: String,
    trim: true
  }],
  seo: {
    meta_title: String,
    meta_description: String,
    canonical_url: String
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

CategorySchema.index({ name: 'text', alternate_names: 'text' });

const Category = mongoose.model('Category', CategorySchema);
export default Category;