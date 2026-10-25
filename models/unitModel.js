

import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true // e.g., "Kg", "Quintal", "Ton", "Piece", "Thaan", "Meter", "Box", "Bag"
  },
  short_code: {
    type: String,
    required: true,
    lowercase: true,
    trim: true // e.g., "kg", "qtl", "ton", "pc", "thn", "m", "box", "bag"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Unit = mongoose.model('Unit', UnitSchema);
export default Unit;