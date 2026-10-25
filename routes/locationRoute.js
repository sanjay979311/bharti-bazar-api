// routes/locationRoutes.js
import express from 'express';
import { 
    createLocation, 
    getLocationList, 
    updateLocation, 
    deleteLocation 
} from '../controllers/locationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public: For dropdowns and search bars
router.get("/list", getLocationList); 

// Admin Only: Manage the geography
router.post("/create", authMiddleware, roleMiddleware(['admin']), createLocation);
router.put("/update/:id", authMiddleware, roleMiddleware(['admin']), updateLocation);
router.delete("/remove/:id", authMiddleware, roleMiddleware(['admin']), deleteLocation);

export default router;