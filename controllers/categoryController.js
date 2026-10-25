

import Category from '../models/categoryModel.js';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// =======================
// 1. GET ALL CATEGORIES (With Deep Population for L1 -> L2 -> L3 Hierarchy)
// =======================
export const categoryList = async (req, res) => {
  try {
    const { search, level, is_active } = req.query;
    let query = {};

    if (search) {
      query.$text = {$search: search };
    }

    if (level) {
      query.level = Number(level);
    }

    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    // FIXED: Added deep population so Level 3 fetches its parent and grand-parent properly
    const categories = await Category.find(query)
      .populate({
        path: 'parent_category',
        select: 'name slug level parent_category',
        populate: {
          path: 'parent_category',
          select: 'name slug level'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch categories" });
  }
};

// =======================
// 2. GET CATEGORY BY ID (With Deep Population)
// =======================
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // FIXED: Deep population included here as well for Edit Form mapping
    const category = await Category.findById(id).populate({
      path: 'parent_category',
      select: 'name slug level parent_category',
      populate: {
        path: 'parent_category',
        select: 'name slug level'
      }
    });

    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching Category:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// =======================
// 3. CREATE CATEGORY (Image Optional & Hierarchy Validated)
// =======================
export const createCategory = async (req, res) => {
  try {
    const { 
      name, 
      level, 
      parent_category, 
      alternate_names, 
      is_active 
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ success: false, error: 'Category with this slug already exists' });
    }

    const categoryLevel = level ? Number(level) : 1;
    let validParent = null;

    if (categoryLevel === 1) {
      validParent = null;
    } else {
      if (!parent_category) {
        return res.status(400).json({ success: false, error: `Level ${categoryLevel} category must have a parent category.` });
      }

      const parentDoc = await Category.findById(parent_category);
      if (!parentDoc) {
        return res.status(404).json({ success: false, error: 'Selected parent category not found.' });
      }

      if (categoryLevel === 2 && parentDoc.level !== 1) {
        return res.status(400).json({ success: false, error: 'Level 2 category must have a Level 1 parent.' });
      }

      if (categoryLevel === 3 && parentDoc.level !== 2) {
        return res.status(400).json({ success: false, error: 'Level 3 category must have a Level 2 parent.' });
      }

      validParent = parent_category;
    }

    let parsedAlternateNames = [];
    if (alternate_names) {
      if (typeof alternate_names === 'string') {
        parsedAlternateNames = alternate_names.split(',').map(n => n.trim()).filter(Boolean);
      } else if (Array.isArray(alternate_names)) {
        parsedAlternateNames = alternate_names;
      }
    }

    const seoData = {
      meta_title: req.body['seo[meta_title]'] || req.body.metaTitle || '',
      meta_description: req.body['seo[meta_description]'] || req.body.metaDescription || '',
      canonical_url: req.body['seo[canonical_url]'] || req.body.canonical_url || ''
    };

    const imageFilename = req.file ? req.file.filename : null;

    const newCategory = await Category.create({
      name,
      slug,
      level: categoryLevel,
      parent_category: validParent,
      alternate_names: parsedAlternateNames,
      seo: seoData,
      is_active: is_active !== undefined ? (is_active === 'true' || is_active === true) : true,
      image: imageFilename
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });

  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ success: false, error: 'Failed to create category' });
  }
};

// =======================
// 4. UPDATE CATEGORY (With Hierarchy & Self-Parenting Protection)
// =======================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const { name, level, parent_category, alternate_names, is_active } = req.body;
    let updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const newLevel = level ? Number(level) : category.level;
    updateData.level = newLevel;

    // --- HIERARCHY & VALIDATION LOGIC ---
    if (newLevel === 1) {
      updateData.parent_category = null;
    } else {
      if (!parent_category) {
        return res.status(400).json({ 
          success: false, 
          error: `Level ${newLevel} category must have a parent category.` 
        });
      }

      // Prevent Self-Parenting
      if (parent_category === id) {
        return res.status(400).json({ success: false, error: 'A category cannot be a parent of itself.' });
      }

      const parentDoc = await Category.findById(parent_category);
      if (!parentDoc) {
        return res.status(404).json({ success: false, error: 'Selected parent category not found.' });
      }

      if (newLevel === 2 && parentDoc.level !== 1) {
        return res.status(400).json({ success: false, error: 'Level 2 (Sub Category) must have a Level 1 parent.' });
      }

      if (newLevel === 3 && parentDoc.level !== 2) {
        return res.status(400).json({ success: false, error: 'Level 3 (Child Category) must have a Level 2 parent.' });
      }

      updateData.parent_category = parent_category;
    }

    if (alternate_names) {
      if (typeof alternate_names === 'string') {
        updateData.alternate_names = alternate_names.split(',').map(n => n.trim()).filter(Boolean);
      } else if (Array.isArray(alternate_names)) {
        updateData.alternate_names = alternate_names;
      }
    }

    if (is_active !== undefined) {
      updateData.is_active = is_active === 'true' || is_active === true;
    }

    // SEO Data Mapping
    updateData.seo = {
      meta_title: req.body['seo[meta_title]'] || req.body.metaTitle || category.seo?.meta_title,
      meta_description: req.body['seo[meta_description]'] || req.body.metaDescription || category.seo?.meta_description,
      canonical_url: req.body['seo[canonical_url]'] || req.body.canonical_url || category.seo?.canonical_url,
    };

    // Handle Image Replacement
    if (req.file) {
      if (category.image) {
        const oldImagePath = path.resolve('uploads', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    return res.status(200).json({
      success: true,
      message: 'Category and hierarchy updated successfully',
      data: updatedCategory,
    });

  } catch (err) {
    console.error('Update Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update category' });
  }
};

// =======================
// 5. UPDATE CATEGORY STATUS ONLY
// =======================
export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, isActive } = req.body;
    
    const statusValue = is_active !== undefined ? is_active : isActive;

    const category = await Category.findByIdAndUpdate(
      id,
      { is_active: statusValue }, 
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    return res.status(200).json({ 
      success: true,
      message: "Category status updated successfully", 
      data: category 
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// =======================
// 6. DELETE CATEGORY
// =======================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    if (category.image) {
      const imagePath = path.resolve('uploads', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete category" });
  }
};

// =======================
// 7. BULK CREATE CATEGORIES
// =======================
export const bulkCreateCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of categories.' });
    }

    const preparedCategories = [];
    const skippedCategories = [];

    for (const cat of categories) {
      const { name, level, parent_category, alternate_names, seo, is_active } = cat;

      if (!name) {
        skippedCategories.push({ name: 'Unknown', reason: 'Missing name' });
        continue;
      }

      const slug = slugify(name, { lower: true, strict: true });

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        skippedCategories.push({ name, reason: 'Slug already exists' });
        continue;
      }

      preparedCategories.push({
        name,
        slug,
        level: level || 1,
        parent_category: parent_category || null,
        alternate_names: alternate_names || [],
        seo: seo || {},
        is_active: is_active !== undefined ? is_active : true,
        image: null
      });
    }

    if (preparedCategories.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No new categories to add', 
        skipped: skippedCategories 
      });
    }

    const createdCategories = await Category.insertMany(preparedCategories);

    return res.status(201).json({
      success: true,
      message: `${createdCategories.length} categories created successfully`,
      insertedCount: createdCategories.length,
      skipped: skippedCategories
    });

  } catch (err) {
    console.error('Error in bulk creating categories:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during bulk upload' });
  }
};