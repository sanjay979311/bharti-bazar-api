

import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to parent category
   allowedUnits: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: true,
      },
    ],
    image: {
        type: String,
        default: "", // Cloud URL or relative path
    },
    attributes: [{ type: String }], // ["Grade", "Packaging"]
    description: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true }

}, { timestamps: true }); // Add createdAt and updatedAt fields

export default model('SubCategory', subCategorySchema);