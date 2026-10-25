// routes/subscription.routes.js
import express from "express";
import {
  subscribePlan,
  assignPlanByAdmin,
  getUserSubscription,
  getAllSubscriptions,
  updateSubscriptionStatus,
  updatePaymentStatus,
  deleteSubscription,
} from "../controllers/subscriptionController.js";


const router = express.Router();

/**
 * ✅ User subscribes to a plan
 * POST /api/subscriptions/subscribe
 */
router.post("/subscribe", subscribePlan);

/**
 * ✅ Admin assigns plan to user
 * POST /api/subscriptions/assign
 */
router.post("/assign", assignPlanByAdmin);

/**
 * ✅ Get current subscription of a user
 * GET /api/subscriptions/user/:userId
 */
router.get("/user-membership/:userId", getUserSubscription);

/**
 * ✅ Admin: Get all subscriptions (analytics)
 * GET /api/subscriptions/list
 */
router.get("/list", getAllSubscriptions);

/**
 * ✅ Cancel subscription (Admin/User)
 * PUT /api/subscriptions/cancel/:id
 */
router.put("/subscription-status/:id", updateSubscriptionStatus);
router.put("/payment-status/:id", updatePaymentStatus);
router.delete("/delete/:id", deleteSubscription);

export default router;
