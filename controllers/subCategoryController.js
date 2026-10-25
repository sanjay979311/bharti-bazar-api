


// import SubCategory from '../models/subCategoryModel.js';
// import slugify from 'slugify';

// // Create a new subcategory
// export const createSubCategory = async (req, res) => {
//     try {
//         const { name, category } = req.body;

//         // console.log("body is =>", req.body)

//         // Validate input
//         if (!name || !category) {
//             return res.status(400).json({ error: 'Name and category are required' });
//         }

//         // Generate slug
//         const slug = slugify(name, { lower: true });

//         // Check if subcategory already exists
//         const existingSubCategory = await SubCategory.findOne({ name, category });
//         if (existingSubCategory) {
//             return res.status(400).json({ error: 'Subcategory already exists for this category' });
//         }

//         // Create new subcategory
//         const newSubCategory = await SubCategory.create({
//             name,
//             slug,
//             category,
//         });

//         res.status(201).json({
//             message: 'Subcategory created successfully',
//             subCategory: newSubCategory,
//         });

//     } catch (err) {
//         console.error('Error creating subcategory:', err);
//         res.status(500).json({ error: 'Failed to create subcategory' });
//     }
// };

// // Get all subcategories
// export const getAllSubCategories = async (req, res) => {
//     try {
//         const subCategories = await SubCategory.find().populate('category', 'name').sort({ createdAt: -1 });;
//         res.status(200).json(subCategories);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
//     }
// };

// // Get a single subcategory by ID
// export const getSingleSubCategory = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const subCategory = await SubCategory.findById(id).populate('category', 'name');
//         if (!subCategory) {
//             return res.status(404).json({ message: 'Subcategory not found' });
//         }

//         res.status(200).json(subCategory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
//     }
// };

// // Update a subcategory by ID
// export const updateSubCategory = async (req, res) => {
//     const { id } = req.params;
//     const { name, category } = req.body;

//     // Validate input
//     if (!name || !category) {
//         return res.status(400).json({ error: 'Name and category are required' });
//     }

//     // Generate slug
//     const slug = slugify(name, { lower: true });

//     try {
//         const updatedSubCategory = await SubCategory.findByIdAndUpdate(
//             id,
//             { name, slug, category },
//             { new: true }
//         );

//         if (!updatedSubCategory) {
//             return res.status(404).json({ message: 'Subcategory not found' });
//         }

//         res.status(200).json(updatedSubCategory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating subcategory', error: error.message });
//     }
// };

// // Delete a subcategory by ID
// export const deleteSubCategory = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

//         if (!deletedSubCategory) {
//             return res.status(404).json({ message: 'Subcategory not found' });
//         }

//         res.status(200).json({ message: 'Subcategory deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
//     }
// };

import SubCategory from "../models/subCategoryModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================================
   📌 Create a new SubCategory
================================ */
export const createSubCategory = async (req, res) => {
  try {
      console.log("body is =>", req.body)
    const { name, category } = req.body;
    const image = req.file?.filename;

    // ✅ Validate input
    if (!name || !category || !image) {
      return res
        .status(400)
        .json({ error: "Name, category, and image are required" });
    }

    // ✅ Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // ✅ Check for duplicates
    const existing = await SubCategory.findOne({ name, category });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Subcategory already exists under this category" });
    }

    // ✅ Create subcategory
    const subCategory = await SubCategory.create({
      name,
      slug,
      category,
      image,
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subCategory,
    });
  } catch (err) {
    console.error("Error creating subcategory:", err);
    res.status(500).json({ error: "Failed to create subcategory" });
  }
};

/* ================================
   📌 Get all SubCategories
================================ */
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res
      .status(500)
      .json({ message: "Error fetching subcategories", error: error.message });
  }
};

/* ================================
   📌 Get single SubCategory by ID
================================ */
export const getSubCategoriesByCategoryId = async (req, res) => {
  try {
    console.log("req.params =======>",req.params)
    const { categoryId } = req.params; // Use clear param name

    const subCategories = await SubCategory.find({ category: categoryId }).select("name");
     if (!subCategories  || subCategories.length === 0 ) {
            return res.status(200).json([]); // Returning [] instead of 404
        }

   return res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories",
      error: error.message,
    });
  }
};



export const getSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate(
      "category",
      "name"
    );

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res
      .status(500)
      .json({ message: "Error fetching subcategory", error: error.message });
  }
};

/* ================================
   📌 Update SubCategory
================================ */
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const image = req.file?.filename;

    // ✅ Find existing subcategory
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // ✅ Delete old image if new one is uploaded
    if (image && subCategory.image) {
      const oldImagePath = path.join(__dirname, "..", "uploads", subCategory.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("🗑️ Old subcategory image deleted:", oldImagePath);
      }
    }

    // ✅ Update fields
    if (name) {
      subCategory.name = name;
      subCategory.slug = slugify(name, { lower: true, strict: true });
    }
    if (category) subCategory.category = category;
    if (image) subCategory.image = image;

    const updated = await subCategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subCategory: updated,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

/* ================================
   📌 Delete SubCategory
================================ */
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // ✅ Delete image file if exists
    if (subCategory.image) {
      const imagePath = path.join(__dirname, "..", "uploads", subCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Subcategory image deleted:", imagePath);
      }
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};


/* ================================
   📌 Update SubCategory Status
================================ */
export const updateSubCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        console.log("=============sub category",id);
        console.log("=============sub category status",isActive)

        const subCategory = await SubCategory.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).populate("category", "name"); // Optional: populates parent name for the response

        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({
            message: `Subcategory is now ${isActive ? 'Active' : 'Inactive'}`,
            subCategory
        });
    } catch (error) {
        console.error("Error updating subcategory status:", error);
        res.status(500).json({ message: error.message });
    }
};



export const bulkCreateSubcategories = async (req, res) => {
    try {
        const { subcategories } = req.body;

        const preparedSubcats = subcategories.map(item => ({
            ...item,
            slug: slugify(item.name, { lower: true, strict: true }),
            image: 'default-sub.png'
        }));

        // insertMany is very fast for bulk IDs
        const result = await SubCategory.insertMany(preparedSubcats, { ordered: false });

        res.status(201).json({
            message: `${result.length} subcategories created successfully`,
        });
    } catch (err) {
        res.status(500).json({ error: 'Bulk upload failed', details: err.message });
    }
};