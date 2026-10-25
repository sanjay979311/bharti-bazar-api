import Unit from "../models/unitModel.js";
import Category from "../models/categoryModel.js"; 

// =====================================================
// CREATE UNIT
// POST /unit/create
// =====================================================
export const createUnit = async (req, res) => {
  try {
    const { name, short_code, category, is_active } = req.body;

    // Validation
    if (!name || !short_code || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, short_code, and category are required",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Selected category not found",
      });
    }

    // Check duplicate unit name
    const existingUnit = await Unit.findOne({
      name: name.trim(),
    });

    if (existingUnit) {
      return res.status(409).json({
        success: false,
        message: "Unit with this name already exists",
      });
    }

    // Create unit
    const unit = await Unit.create({
      name: name.trim(),
      short_code: short_code.trim().toLowerCase(),
      category,
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    // Populate category for response
    await unit.populate("category");

    return res.status(201).json({
      success: true,
      message: "Unit created successfully",
      unit,
    });
  } catch (error) {
    console.error("Create Unit Error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Unit with this name already exists",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create unit",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL UNITS
// GET /unit/list
// =====================================================
export const unitList = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate("category", "name slug") // Category ki details sath me laane ke liye
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Units fetched successfully",
      units,
    });
  } catch (error) {
    console.error("Unit List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch units",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE UNIT
// GET /unit/:id
// =====================================================
export const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findById(id).populate("category");

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unit fetched successfully",
      unit,
    });
  } catch (error) {
    console.error("Get Unit Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid unit ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unit",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE UNIT
// PUT /unit/update/:id
// =====================================================
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short_code, category, is_active } = req.body;

    // Find existing unit
    const unit = await Unit.findById(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    // Validate fields if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ success: false, message: "Unit name cannot be empty" });
      }
      
      const existingUnit = await Unit.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingUnit) {
        return res.status(409).json({ success: false, message: "Another unit with this name already exists" });
      }
      unit.name = name.trim();
    }

    if (short_code !== undefined) {
      if (!short_code.trim()) {
        return res.status(400).json({ success: false, message: "Short code cannot be empty" });
      }
      unit.short_code = short_code.trim().toLowerCase();
    }

    if (category !== undefined) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Selected category not found" });
      }
      unit.category = category;
    }

    if (is_active !== undefined) {
      unit.is_active = is_active;
    }

    await unit.save();
    await unit.populate("category");

    return res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      unit,
    });
  } catch (error) {
    console.error("Update Unit Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid unit or category ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Unit with this name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update unit",
      error: error.message,
    });
  }
};

// =====================================================
// TOGGLE UNIT STATUS
// PATCH /unit/status/:id
// =====================================================
export const toggleUnitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be a boolean value",
      });
    }

    const unit = await Unit.findById(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    unit.is_active = is_active;
    await unit.save();
    await unit.populate("category");

    return res.status(200).json({
      success: true,
      message: `Unit ${is_active ? "activated" : "deactivated"} successfully`,
      unit,
    });
  } catch (error) {
    console.error("Toggle Unit Status Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid unit ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update unit status",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE UNIT
// DELETE /unit/remove/:id
// =====================================================
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findById(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    await Unit.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    console.error("Delete Unit Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid unit ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete unit",
      error: error.message,
    });
  }
};