import express from "express";

import {
  createUnit,
  updateUnit,
  deleteUnit,
  unitList,
  getUnitById,
  toggleUnitStatus,
} from "../controllers/unitController.js";



import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// =====================================================
// UNIT ROUTES
// =====================================================

// Get all units
router.get(
  "/list",
  unitList
);

// Get single unit by ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getUnitById
);

// Create new unit
router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUnit
);

// Update unit
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUnit
);

// Toggle unit active/inactive status
router.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  toggleUnitStatus
);

// Delete unit
router.delete(
  "/remove/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteUnit
);

export default router;