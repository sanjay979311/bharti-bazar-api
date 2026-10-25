import express from "express";
import {
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  membershipPlanList,
  getMembershipPlanById,
  getActiveMembershipPlans
} from "../controllers/membershipPlanController.js";


const router = express.Router();

// ✅ Get all membership plans
// GET /api/membership-plans/list
router.get("/list", membershipPlanList);
router.get("/active-list", getActiveMembershipPlans);
// GET active membership plans


// ✅ Get single membership plan by ID
// GET /api/membership-plans/single-plan/:id
router.get("/single-plan/:id", getMembershipPlanById);

// ✅ Create membership plan (Admin)
/// POST /api/membership-plans/create
router.post("/create", createMembershipPlan);

// ✅ Update membership plan (Admin)
// PUT /api/membership-plans/update/:id
router.put("/update/:id", updateMembershipPlan);

// ✅ Delete membership plan (Admin)
// DELETE /api/membership-plans/remove/:id
router.delete("/remove/:id", deleteMembershipPlan);

export default router;

