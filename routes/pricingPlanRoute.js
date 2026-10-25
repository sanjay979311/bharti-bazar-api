import express from 'express';
import { 
    createPricingPlan, 
    updatePricingPlan, 
    deletePricingPlan, 
    pricingPlanList, 
    getPricingPlanById, 
    updatePricingPlanStatus 
} from '../controllers/pricingPlanController.js'; 

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public route: To show plans on the frontend pricing page
router.get("/list", pricingPlanList);

// Admin only routes: For managing the plans
router.get("/:id", authMiddleware, roleMiddleware(['admin']), getPricingPlanById);

router.post("/create", authMiddleware, roleMiddleware(['admin']), createPricingPlan);

router.put('/update/:id', authMiddleware, roleMiddleware(['admin']), updatePricingPlan);

// Update status (Active/Inactive) or Recommended toggle
router.patch('/status/:id', authMiddleware, roleMiddleware(['admin']), updatePricingPlanStatus);

router.delete('/remove/:id', authMiddleware, roleMiddleware(['admin']), deletePricingPlan);

export default router;
