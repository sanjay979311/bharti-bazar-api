import PricingPlan from '../models/pricingPlanModel.js';

// 1. Create a new Pricing Plan
export const createPricingPlan = async (req, res) => {
    try {
        const { name, planType, price, features, isRecommended, isActive } = req.body;
        
        const newPlan = new PricingPlan({
            name,
            planType,
            price,
            features: Array.isArray(features) ? features : [], // Ensure it's an array
            isRecommended,
            isActive
        });

        await newPlan.save();
        res.status(201).json({ success: true, message: "Pricing Plan created!", data: newPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get all plans (Public - for your pricing page)
export const pricingPlanList = async (req, res) => {
    try {
        const plans = await PricingPlan.find().sort({ price: 1 }); // Sort by price low to high
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get single plan by ID
export const getPricingPlanById = async (req, res) => {
    try {
        const plan = await PricingPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Update Plan Details
export const updatePricingPlan = async (req, res) => {
    try {
        const updatedPlan = await PricingPlan.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedPlan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, message: "Plan updated!", data: updatedPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Update Status Only (Active/Inactive)
export const updatePricingPlanStatus = async (req, res) => {
    try {
        const { isActive, isRecommended } = req.body;
        const updateData = {};
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isRecommended !== undefined) updateData.isRecommended = isRecommended;

        const plan = await PricingPlan.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Status updated!", data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Delete Plan
export const deletePricingPlan = async (req, res) => {
    try {
        const plan = await PricingPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, message: "Pricing Plan removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
