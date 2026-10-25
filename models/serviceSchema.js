import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

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
        trim: true
    },

    description: {
        type: String
    },

    image: {
        type: String,
        required: true // Filename from Multer
    },

    metaTitle: {
        type: String
    },

    metaDescription: {
        type: String
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

serviceSchema.index({ category: 1 });
serviceSchema.index({ slug: 1 });

export default mongoose.model('Service', serviceSchema);