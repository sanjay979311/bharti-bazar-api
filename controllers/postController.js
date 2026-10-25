import Post from "../models/postModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -----------------------------
     LIST ALL POSTS
------------------------------ */

// ➤ Public: List Posts (Paginated + Filtered)

export const publicPostList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100 per request
    const { category, state, city, area, tags } = req.query;

    const filter = { status: "published" };
    if (category) filter.category = category;
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (area) filter.area = area;
    if (tags) filter.tags = { $in: tags.split(",") };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const publicPostList1 = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { category, city, state, area, tags, status, sortBy, order } = req.query;

    const filter = { status: "published" }; // only show published posts

    if (category) filter.category = category;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (area) filter.area = area;
    if (tags) filter.tags = { $in: tags.split(",") };

    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("category state city area author")
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const postList = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error loading posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
     GET SINGLE POST
------------------------------ */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
     CREATE POST
------------------------------ */
export const createPost = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      state,
      city,
      area,
      tags,
      metaTitle,
      metaDescription,
    } = req.body;
    return res.status(200).json(req.body)

    if (!title || !shortDescription || !description || !category) {
      return res.status(400).json({
        error: "title, shortDescription, description, category are required",
      });
    }

    const images = req.files?.map((file) => file.filename) || [];

    const slug = slugify(title, { lower: true });

    const post = await Post.create({
      title,
      slug,
      shortDescription,
      description,
      category,
      state: state || null,
      city: city || null,
      area: area || null,
      tags: tags ? tags.split(",") : [],
      images,
      metaTitle,
      metaDescription,
      author: req.user?._id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* -----------------------------
     UPDATE POST
------------------------------ */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const {
      title,
      shortDescription,
      description,
      category,
      state,
      city,
      area,
      tags,
      metaTitle,
      metaDescription,
    } = req.body;

    let newImages = req.files?.map((file) => file.filename);

    // 🔥 If new images uploaded → delete old ones
    if (newImages && newImages.length > 0) {
      post.images.forEach((img) => {
        const oldPath = path.join(__dirname, "..", "uploads", img);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      });
      post.images = newImages;
    }

    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true });
    }

    if (shortDescription) post.shortDescription = shortDescription;
    if (description) post.description = description;
    if (category) post.category = category;
    if (state) post.state = state;
    if (city) post.city = city;
    if (area) post.area = area;

    if (tags) post.tags = tags.split(",");

    if (metaTitle) post.metaTitle = metaTitle;
    if (metaDescription) post.metaDescription = metaDescription;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* -----------------------------
     DELETE POST
------------------------------ */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Delete images
    post.images.forEach((img) => {
      const imgPath = path.join("uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
