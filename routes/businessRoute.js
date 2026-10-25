// // routes/businessRoutes.js
// import express from 'express';
// import { 
//     getDynamicListingPageData,
//     createBusiness, 
//     getFilteredListings, 
//     getBusinessBySlug,
//     updateBusinessStatus 
// } from '../controllers/businessController.js';
// import upload from '../utiles/multer.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// const router = express.Router();



// router.get('/listings', getDynamicListingPageData);

// // Main Search Route (Handles filters, sorting, and location)
// // Pattern: /api/business/search?city=mumbai&category=plumbers
// router.get("/search", getFilteredListings);

// // Single Business Detail via Slug (For SEO Pages)
// router.get("/detail/:slug", getBusinessBySlug);


// /**
//  * ADMIN/OWNER ROUTES
//  */

// // Register a new business
// router.post("/register", authMiddleware, upload.array('images', 5), createBusiness);

// // Toggle verification/status
// router.patch("/status/:id", authMiddleware, roleMiddleware(['admin']), updateBusinessStatus);

// export default router;


// routes/businessRoutes.js



// import express from 'express';
// import { 
//     getDynamicListingPageData
// } from '../controllers/businessController.js';
// import upload from '../utiles/multer.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// const router = express.Router();



// router.get('/listings', getDynamicListingPageData);

// // // Main Search Route (Handles filters, sorting, and location)
// // // Pattern: /api/business/search?city=mumbai&category=plumbers
// // router.get("/search", getFilteredListings);

// // // Single Business Detail via Slug (For SEO Pages)
// // router.get("/detail/:slug", getBusinessBySlug);


// // /**
// //  * ADMIN/OWNER ROUTES
// //  */

// // // Register a new business
// // router.post("/register", authMiddleware, upload.array('images', 5), createBusiness);

// // // Toggle verification/status
// // router.patch("/status/:id", authMiddleware, roleMiddleware(['admin']), updateBusinessStatus);

// export default router;



import express from 'express';

import {
  addBusiness,
  updateBusiness,
  deleteBusiness,
  getSingleBusiness,
  getAllBusinesses,
  getDynamicListingPageData
} from '../controllers/businessController.js';

import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();


// =============================
// PUBLIC ROUTES
// =============================

// Get All Businesses
router.get('/', getAllBusinesses);

// Get Single Business
router.get('/:id', getSingleBusiness);

// Dynamic Listings
router.get('/listings', getDynamicListingPageData);


// =============================
// ADMIN ROUTES
// =============================

// Add Business
router.post(
  '/add',
  authMiddleware,
  roleMiddleware('admin'),
  addBusiness
);

// Update Business
router.put(
  '/update/:id',
  authMiddleware,
  roleMiddleware('admin'),
  updateBusiness
);

// Delete Business
router.delete(
  '/delete/:id',
  authMiddleware,
  roleMiddleware('admin'),
  deleteBusiness
);

export default router;