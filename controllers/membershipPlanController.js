
import MembershipPlan from '../models/membershipPlan.js'

// ✅ 1. Create a new membership plan (Admin Only)
export const createMembershipPlan = async (req, res) => {
  try {
    const {
      planName,
      price,
      durationDays,
      adsLimit,
      enableTopAds,
      topAdsLimit,
      description,
      features,
      isActive,
    } = req.body;
    console.log("body is ========>",req.body)

    // Check if plan already exists
    const existingPlan = await MembershipPlan.findOne({ planName });
    if (existingPlan) {
      return res.status(409).json({ error: "Membership plan already exists" });
    }

    // Create new plan
    const newPlan = await MembershipPlan.create({
      planName,
      price,
      durationDays,
      adsLimit,
      enableTopAds,
      topAdsLimit,
      description,
      features,
      isActive,
    });

    res.status(201).json({
      message: "Membership plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error creating membership plan:", error);
    res.status(500).json({ error: "Failed to create membership plan" });
  }
};

// ✅ 2. Get all membership plans (Admin & Users)
export const membershipPlanList = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ error: "Failed to fetch membership plans" });
  }
};

export const getActiveMembershipPlans = async (req, res) => {
  try {
    console.log("this is active plan route")
    const plans = await MembershipPlan.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching active membership plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active membership plans",
    });
  }
};

// ✅ 3. Get a single membership plan by ID
export const getMembershipPlanById = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    // console.log("plan id is ======>",plan)

    if (!plan) {
      return res.status(404).json({ error: "Membership plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching membership plan:", error);
    res.status(500).json({ error: "Failed to fetch membership plan" });
  }
};

// ✅ 4. Update a membership plan by ID (Admin Only)
export const updateMembershipPlan = async (req, res) => {
  try {
    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: "Membership plan not found" });
    }

    res.status(200).json({
      message: "Membership plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating membership plan:", error);
    res.status(500).json({ error: "Failed to update membership plan" });
  }
};

// ✅ 5. Delete a membership plan by ID (Admin Only)
export const deleteMembershipPlan = async (req, res) => {
  try {
    const deletedPlan = await MembershipPlan.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPlan) {
      return res.status(404).json({ error: "Membership plan not found" });
    }

    res.status(200).json({
      message: "Membership plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting membership plan:", error);
    res.status(500).json({ error: "Failed to delete membership plan" });
  }
};
