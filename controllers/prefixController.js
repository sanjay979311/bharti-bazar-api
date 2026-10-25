
import Prefix from '../models/prefixModel.js'
import slugify from "slugify";

// ✅ Create Prefix
export const createPrefix = async (req, res) => {
  try {
    const { name } = req.body;

    const prefix = await Prefix.create({
      name,
      slug: slugify(name),
    });

    res.status(201).json({
      success: true,
      message: "Prefix created successfully",
      prefix,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Prefixes
export const getAllPrefixes = async (req, res) => {
  try {
    const prefixes = await Prefix.find().sort({ createdAt: -1 });

    res.json(prefixes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Prefix By ID
export const getPrefixById = async (req, res) => {
  try {
    const prefix = await Prefix.findById(req.params.id);

    if (!prefix) return res.status(404).json({ error: "Prefix not found" });

    res.json(prefix);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Prefix
export const updatePrefix = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("update prefix is =========>",name)
        console.log("req.params.id, prefix is =========>",req.params.id,)

    const updated = await Prefix.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Prefix updated successfully",
      updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Prefix
export const deletePrefix = async (req, res) => {
  try {
    await Prefix.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Prefix deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
