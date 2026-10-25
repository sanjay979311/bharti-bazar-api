import express from "express";

import {
  createPrefix,
  getAllPrefixes,
  getPrefixById,
  updatePrefix,
  deletePrefix,
} from "../controllers/prefixController.js";

const router = express.Router();

// ✅ Create a new Prefix
router.post("/create", createPrefix);

// ✅ Get all Prefixes
router.get("/list", getAllPrefixes);

// ✅ Get Prefix by ID
router.get("/:id", getPrefixById);

// ✅ Update Prefix
router.put("/update/:id", updatePrefix);

// ✅ Delete Prefix
router.delete("/remove/:id", deletePrefix);

export default router;
