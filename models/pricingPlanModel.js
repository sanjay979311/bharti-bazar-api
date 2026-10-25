import { Schema, model } from 'mongoose';

const pricingPlanSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    planType: { 
        type: String, 
        required: true, 
        enum: ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Lifetime'],
        default: 'Monthly' 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    features: { 
        type: [String], 
        default: [] 
    },
    isRecommended: { 
        type: Boolean, 
        default: false 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default model('PricingPlan', pricingPlanSchema);

