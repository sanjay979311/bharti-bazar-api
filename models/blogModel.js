import { Schema, model } from 'mongoose';

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    
    // Updated: Now references a dedicated Category model
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Blog category reference is required']
    },

    image: {
        type: String,
        required: [true, 'Blog cover image is required']
    },

    description: {
        type: String,
        required: [true, 'Blog description is required'],
        trim: true
    },

    metaTitle: { type: String, default: '' },
    metaKeywords: { type: String, default: '' }, // Kept as String to match your frontend state
    metaDescription: { type: String, default: '' }

}, { timestamps: true });

export default model('Blog', blogSchema);