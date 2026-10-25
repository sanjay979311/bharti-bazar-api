// import express from "express";
// import { 
//   createSeoContent, 
//   getAllSeoContent, 
//   getSeoContentBySlug, 
//   updateSeoContentBySlug, 
//   deleteSeoContentBySlug 
// } from "../controllers/seoContentController.js"; // Aapka updated controller file
// import { authMiddleware } from "../middlewares/authMiddleware.js"; // Security ke liye

// const router = express.Router();

// // ==========================================
// // Public Routes (Frontend website ke liye)
// // ==========================================

// // 1. Saare categories ka SEO data lene ke liye
// router.get("/", getAllSeoContent);

// // 2. Kisi ek specific category ka SEO data slug se nikalne ke liye (Jaise: /api/seo-content/car-rentals)
// router.get("/:slug", getSeoContentBySlug);


// // ==========================================
// // Protected Routes (Sirf Admin/Authenticated users ke liye)
// // ==========================================

// // 3. Naya SEO Content Bank create karne ke liye
// router.post("/create", authMiddleware, createSeoContent);

// // 4. Kisi category ka SEO data update karne ke liye
// router.put("/:slug", authMiddleware, updateSeoContentBySlug);

// // 5. Kisi category ka SEO data delete karne ke liye
// router.delete("/:slug", authMiddleware, deleteSeoContentBySlug);

// export default router;


import express from "express";
import { 
  createSeoContent, 
  getAllSeoContent, 
  getSeoContentBySlug, 
  updateSeoContentBySlug, 
  deleteSeoContentBySlug,
  getPageDataForLocation // 👈 Isko import destructuring mein add kijiye
} from "../controllers/seoContentController.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================

// 🔥 Naya engine route call query patterns ke liye (Isi link se frontend response fetch hoga)
// URL pattern: /api/seo-content/listings/render?categorySlug=repairs-services&citySlug=gorakhpur
router.get("/listings/render", getPageDataForLocation);

router.get("/", getAllSeoContent);
router.get("/:slug", getSeoContentBySlug);

// ==========================================
// Protected Routes
// ==========================================
router.post("/create", authMiddleware, createSeoContent);
router.put("/:slug", authMiddleware, updateSeoContentBySlug);
router.delete("/:slug", authMiddleware, deleteSeoContentBySlug);

export default router;