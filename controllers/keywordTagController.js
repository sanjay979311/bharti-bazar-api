import KeywordTag from "../models/keywordTagModel.js";
import Category from "../models/categoryModel.js";
import Unit from "../models/unitModel.js";

// =====================================================
// CREATE KEYWORD TAG
// POST /keyword-tag/create
// =====================================================
export const createKeywordTag = async (req, res) => {
  try {
    const { keyword, slug, category_id, allowed_units, default_unit, target_hubs } = req.body;

    // Validation
    if (!keyword || !slug || !category_id || !allowed_units || !Array.isArray(allowed_units) || allowed_units.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Keyword, slug, category_id, and at least one allowed_unit are required",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Selected category not found",
      });
    }

    // Check if all allowed_units exist
    const unitsCount = await Unit.countDocuments({ _id: { $in: allowed_units } });
    if (unitsCount !== allowed_units.length) {
      return res.status(404).json({
        success: false,
        message: "One or more allowed units not found",
      });
    }

    // If default_unit is provided, check if it exists and is part of allowed_units
    if (default_unit) {
      if (!allowed_units.includes(default_unit)) {
        return res.status(400).json({
          success: false,
          message: "Default unit must be one of the allowed units",
        });
      }
      const defaultUnitExists = await Unit.findById(default_unit);
      if (!defaultUnitExists) {
        return res.status(404).json({
          success: false,
          message: "Selected default unit not found",
        });
      }
    }

    // Check duplicate keyword
    const existingTag = await KeywordTag.findOne({
      keyword: keyword.trim().toLowerCase(),
    });

    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: "Keyword tag with this name already exists",
      });
    }

    // Create keyword tag
    const keywordTag = await KeywordTag.create({
      keyword: keyword.trim().toLowerCase(),
      slug: slug.trim().toLowerCase(),
      category_id,
      allowed_units,
      default_unit: default_unit || undefined,
      target_hubs: Array.isArray(target_hubs) ? target_hubs.map(h => h.trim()) : [],
    });

    // Populate references for response
    await keywordTag.populate([
      { path: "category_id", select: "name slug" },
      { path: "allowed_units", select: "name short_code" },
      { path: "default_unit", select: "name short_code" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Keyword tag created successfully",
      keywordTag,
    });
  } catch (error) {
    console.error("Create Keyword Tag Error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Keyword tag or slug already exists",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create keyword tag",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL KEYWORD TAGS
// GET /keyword-tag/list
// =====================================================
export const keywordTagList = async (req, res) => {
  try {
    const { search, category_id, hub } = req.query;
    let query = {};

    if (search) {
      query.keyword = { $regex: search.trim(), $options: "i" };
    }
    if (category_id) {
      query.category_id = category_id;
    }
    if (hub) {
      query.target_hubs = hub.trim();
    }

    const keywordTags = await KeywordTag.find(query)
      .populate("category_id", "name slug")
      .populate("allowed_units", "name short_code")
      .populate("default_unit", "name short_code")
      .sort({ search_count: -1, keyword: 1 });

    return res.status(200).json({
      success: true,
      message: "Keyword tags fetched successfully",
      count: keywordTags.length,
      keywordTags,
    });
  } catch (error) {
    console.error("Keyword Tag List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch keyword tags",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE KEYWORD TAG
// GET /keyword-tag/:id
// =====================================================
export const getKeywordTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const keywordTag = await KeywordTag.findById(id)
      .populate("category_id", "name slug")
      .populate("allowed_units", "name short_code")
      .populate("default_unit", "name short_code");

    if (!keywordTag) {
      return res.status(404).json({
        success: false,
        message: "Keyword tag not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Keyword tag fetched successfully",
      keywordTag,
    });
  } catch (error) {
    console.error("Get Keyword Tag Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid keyword tag ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch keyword tag",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE KEYWORD TAG
// PUT /keyword-tag/update/:id
// =====================================================
export const updateKeywordTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword, slug, category_id, allowed_units, default_unit, target_hubs } = req.body;

    const keywordTag = await KeywordTag.findById(id);

    if (!keywordTag) {
      return res.status(404).json({
        success: false,
        message: "Keyword tag not found",
      });
    }

    if (keyword !== undefined) {
      if (!keyword.trim()) {
        return res.status(400).json({ success: false, message: "Keyword cannot be empty" });
      }

      const existingTag = await KeywordTag.findOne({
        keyword: keyword.trim().toLowerCase(),
        _id: { $ne: id },
      });

      if (existingTag) {
        return res.status(409).json({ success: false, message: "Another keyword tag with this name already exists" });
      }
      keywordTag.keyword = keyword.trim().toLowerCase();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return res.status(400).json({ success: false, message: "Slug cannot be empty" });
      }
      keywordTag.slug = slug.trim().toLowerCase();
    }

    if (category_id !== undefined) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Selected category not found" });
      }
      keywordTag.category_id = category_id;
    }

    if (allowed_units !== undefined) {
      if (!Array.isArray(allowed_units) || allowed_units.length === 0) {
        return res.status(400).json({ success: false, message: "allowed_units must be a non-empty array" });
      }
      const unitsCount = await Unit.countDocuments({ _id: { $in: allowed_units } });
      if (unitsCount !== allowed_units.length) {
        return res.status(404).json({ success: false, message: "One or more allowed units not found" });
      }
      keywordTag.allowed_units = allowed_units;
    }

    if (default_unit !== undefined) {
      if (default_unit) {
        const currentAllowedUnits = allowed_units || keywordTag.allowed_units.map(u => u.toString());
        if (!currentAllowedUnits.includes(default_unit.toString())) {
          return res.status(400).json({ success: false, message: "Default unit must be one of the allowed units" });
        }
        const defaultUnitExists = await Unit.findById(default_unit);
        if (!defaultUnitExists) {
          return res.status(404).json({ success: false, message: "Selected default unit not found" });
        }
        keywordTag.default_unit = default_unit;
      } else {
        keywordTag.default_unit = undefined;
      }
    }

    if (target_hubs !== undefined) {
      keywordTag.target_hubs = Array.isArray(target_hubs) ? target_hubs.map(h => h.trim()) : [];
    }

    await keywordTag.save();
    
    await keywordTag.populate([
      { path: "category_id", select: "name slug" },
      { path: "allowed_units", select: "name short_code" },
      { path: "default_unit", select: "name short_code" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Keyword tag updated successfully",
      keywordTag,
    });
  } catch (error) {
    console.error("Update Keyword Tag Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Keyword tag with this name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update keyword tag",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE KEYWORD TAG
// DELETE /keyword-tag/remove/:id
// =====================================================
export const deleteKeywordTag = async (req, res) => {
  try {
    const { id } = req.params;

    const keywordTag = await KeywordTag.findById(id);

    if (!keywordTag) {
      return res.status(404).json({
        success: false,
        message: "Keyword tag not found",
      });
    }

    await KeywordTag.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Keyword tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete Keyword Tag Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid keyword tag ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete keyword tag",
      error: error.message,
    });
  }
};