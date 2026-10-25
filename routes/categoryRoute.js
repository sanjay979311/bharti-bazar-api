import express from 'express';
import {bulkCreateCategories, createCategory, updateCategory, deleteCategory, categoryList, getCategoryById,updateCategoryStatus } from '../controllers/categoryController.js'; // Add .js extension
import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.post("/category/bulk-create", authMiddleware, roleMiddleware(['admin']), bulkCreateCategories);

// POST /api/create
router.get("/category/list", categoryList);
router.get("/category/:id", authMiddleware, roleMiddleware(['admin']), getCategoryById);
router.post("/category/create", authMiddleware, roleMiddleware(['admin']), upload.single('image'), createCategory);
// Update an existing category
// router.put('/category/update/:id', upload.single('image'), updateCategory);
router.put('/category/update/:id', authMiddleware, roleMiddleware(['admin']), upload.single('image'), updateCategory);

// Update ONLY category status
router.patch('/category/status/:id', authMiddleware, roleMiddleware(['admin']), updateCategoryStatus);

// Delete a category
router.delete('/category/remove/:id', authMiddleware, roleMiddleware(['admin']), deleteCategory);

export default router;


