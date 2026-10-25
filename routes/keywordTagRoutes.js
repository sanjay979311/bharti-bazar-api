import express from "express";

import {
  createKeywordTag,
  updateKeywordTag,
  deleteKeywordTag,
  keywordTagList,
  getKeywordTagById,
} from "../controllers/keywordTagController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// =====================================================
// KEYWORD TAG ROUTES
// =====================================================

// Get all keyword tags
router.get(
  "/list",
  keywordTagList
);

// Get single keyword tag by ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getKeywordTagById
);

// Create new keyword tag
router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  createKeywordTag
);

// Update keyword tag
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateKeywordTag
);

// Delete keyword tag
router.delete(
  "/remove/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteKeywordTag
);

export default router;