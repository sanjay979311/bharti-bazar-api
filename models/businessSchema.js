

import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, index: true }, // 'ac-repair'
    
    // SEO URL: /mumbai/ac-repair-in-andheri-west
    seoSlug: { type: String, unique: true, index: true }, 

    location: {
        city: { id: mongoose.Schema.Types.ObjectId, name: String, slug: String },
        area: { id: mongoose.Schema.Types.ObjectId, name: String, slug: String },
        state: { name: String },
        geo: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number], required: true } // [longitude, latitude]
        }
    },

    // Filter Flags
    rating: { type: Number, default: 0, index: true },
    isVerified: { type: Boolean, default: false, index: true },
    isTrust: { type: Boolean, default: false, index: true },
    hasDeals: { type: Boolean, default: false, index: true },
    popularityScore: { type: Number, default: 0, index: true },
    
    createdAt: { type: Date, default: Date.now }
});

// Indexes configuration
BusinessSchema.index({ "location.geo": "2dsphere" });
// Compound index for the main search query
BusinessSchema.index({ categorySlug: 1, "location.city.slug": 1, "location.area.slug": 1 });

// 🔥 Pehle check karein agar model pehle se registered hai (Overwriting error se bachne ke liye)
const BusinessModel = mongoose.models.Business || mongoose.model('Business', BusinessSchema);

export default BusinessModel;