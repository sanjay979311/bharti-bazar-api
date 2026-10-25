// import express from 'express';
// import {
//   bulkCreateProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   productList,
//   getProductById,
//   updateProductStatus
// } from '../controllers/productController.js';
// import upload from '../utiles/multer.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// const router = express.Router();

// // Bulk create products (Admin/Seller)
// router.post("/bulk-create", authMiddleware, roleMiddleware(['admin', 'seller']), bulkCreateProducts);

// // List products (Public - search & filter)
// router.get("/list", productList);

// // Get single product details by ID
// router.get("/:id", getProductById);

// // Create single product with multiple image support (up to 5 images)
// router.post("/create", authMiddleware, roleMiddleware(['admin', 'seller']), upload.array('images', 5), createProduct);

// // Update product
// router.put('/update/:id', authMiddleware, roleMiddleware(['admin', 'seller']), upload.array('images', 5), updateProduct);

// // Update product status / verification flags (Admin only)
// router.patch('/status/:id', authMiddleware, roleMiddleware(['admin']), updateProductStatus);

// // Delete product
// router.delete('/remove/:id', authMiddleware, roleMiddleware(['admin', 'seller']), deleteProduct);

// export default router;


import express from 'express';
import {
  bulkCreateProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  productList,
  getProductById,
  updateProductStatus
} from '../controllers/productController.js';
import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// =====================================================
// 1. STATIC / SPECIFIC ROUTES (Pehle rakhe gaye hain)
// =====================================================

// List products (Public - search & filter)
router.get("/list", productList);

// Create single product (Admin/Seller)
router.post(
  "/create", 
  authMiddleware, 
  roleMiddleware(['admin', 'seller']), 
  upload.array('images', 5), 
  createProduct
);

// Bulk create products (Admin/Seller)
router.post(
  "/bulk-create", 
  authMiddleware, 
  roleMiddleware(['admin', 'seller']), 
  bulkCreateProducts
);

// =====================================================
// 2. DYNAMIC / PARAMETERIZED ROUTES (Baad me rakhe gaye hain)
// =====================================================

// Get single product details by ID (Public)
router.get("/:id", getProductById);

// Update product (Admin/Seller)
router.put(
  "/update/:id", 
  authMiddleware, 
  roleMiddleware(['admin', 'seller']), 
  upload.array('images', 5), 
  updateProduct
);

// Update product status / verification flags (Admin only)
router.patch(
  "/status/:id", 
  authMiddleware, 
  roleMiddleware(['admin']), 
  updateProductStatus
);

// Delete product (Admin/Seller)
router.delete(
  "/remove/:id", 
  authMiddleware, 
  roleMiddleware(['admin', 'seller']), 
  deleteProduct
);

export default router;