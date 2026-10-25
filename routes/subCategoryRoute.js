

import express from 'express';
import {
    bulkCreateSubcategories,
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategory,
    updateSubCategory,
    updateSubCategoryStatus,
    deleteSubCategory,
    getSubCategoriesByCategoryId
} from '../controllers/subCategoryController.js';
import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router();

router.post('/bulk-create', authMiddleware, roleMiddleware(['admin']), bulkCreateSubcategories);

// Create a new subcategory
router.post('/', authMiddleware , roleMiddleware(['admin']), upload.single('image'), createSubCategory);

// Get all subcategories
// router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSubCategories);
router.get('/',  getAllSubCategories);

router.get('/by-category/:categoryId', authMiddleware, roleMiddleware(['admin']), getSubCategoriesByCategoryId);


// Get a single subcategory by ID
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getSingleSubCategory);

// Update a subcategory by ID
router.put('/:id', authMiddleware, roleMiddleware(['admin']),upload.single('image'), updateSubCategory);
// Update ONLY category status
router.patch('/status/:id', authMiddleware, roleMiddleware(['admin']), updateSubCategoryStatus);

// Delete a subcategory by ID
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteSubCategory);




export default router;
