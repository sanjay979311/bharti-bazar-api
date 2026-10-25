import BulkPost from "../models/postModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import State from '../models/stateModel.js';
import City from '../models/cityModel.js';
import Area from '../models/areaModel.js'
import OpenAI from "openai";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export const createBulkPost = async (req, res) => {
  try {
    const { title, description, category, user } = req.body;

    if (!title || !description || !category || !user) {
      return res.status(400).json({
        success: false,
        message: "Title, Description, Category and User are required",
      });
    }

    console.log("posts is ==========>", req.body);

    const hasState = /{state}/.test(title) || /{state}/.test(description);
    const hasCity  = /{city}/.test(title)  || /{city}/.test(description);
    const hasArea  = /{area}/.test(title)  || /{area}/.test(description);

    // Helper function
    const applyTemplate = (text, data) => {
      return text
        .replace(/{state}/g, data.state || "")
        .replace(/{city}/g, data.city || "")
        .replace(/{area}/g, data.area || "");
    };

    let generatedPosts = [];

    // --------------------------------------------------
    // 1️⃣ STATE BASED POSTS → ALL STATES
    // --------------------------------------------------
    if (hasState && !hasCity && !hasArea) {
      const states = await State.find({});
      if (!states.length) {
        return res.status(400).json({ success: false, message: "No states found" });
      }

      const posts = states.map(st => {
        const newTitle = applyTemplate(title, { state: st.name });
        const newDesc  = applyTemplate(description, { state: st.name });

        return {
          user,                         // ✅ user added
          title: newTitle,
          description: newDesc,
          category,
          state: st._id,
                      // ✅ ObjectId
        };
      });

      generatedPosts = await BulkPost.insertMany(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for ALL states",
        count: generatedPosts.length,
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 2️⃣ CITY BASED POSTS → ALL CITIES
    // --------------------------------------------------
    if (hasCity && !hasArea) {
      const cities = await City.find({}).populate("state", "name");
      if (!cities.length) {
        return res.status(400).json({ success: false, message: "No cities found" });
      }

      const posts = cities.map(ct => {
        const newTitle = applyTemplate(title, {
          state: ct.state?.name,
          city: ct.name,
        });

        const newDesc = applyTemplate(description, {
          state: ct.state?.name,
          city: ct.name,
        });

        return {
          user,                         // ✅ user added
          title: newTitle,
          description: newDesc,
          category,
          state: ct.state?._id,         // ✅ ObjectId
          city: ct._id,                 // ✅ ObjectId
        };
      });

      generatedPosts = await BulkPost.insertMany(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for ALL cities",
        count: generatedPosts.length,
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 3️⃣ AREA BASED POSTS → ALL AREAS
    // --------------------------------------------------
    if (hasArea) {
      const areas = await Area.find({}).populate("state city", "name");
      if (!areas.length) {
        return res.status(400).json({ success: false, message: "No areas found" });
      }

      const posts = areas.map(ar => {
        const newTitle = applyTemplate(title, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        const newDesc = applyTemplate(description, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        return {
          user,                         // ✅ user added
          title: newTitle,
          description: newDesc,
          category,
          state: ar.state?._id,         // ✅ ObjectId
          city: ar.city?._id,           // ✅ ObjectId
          area: ar._id,                 // ✅ ObjectId
        };
      });

      generatedPosts = await BulkPost.insertMany(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for ALL areas",
        count: generatedPosts.length,
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // If no placeholder found
    // --------------------------------------------------
    return res.status(400).json({
      success: false,
      message: "No valid placeholder ({state}, {city}, {area}) found in title or description",
    });

  } catch (error) {
    console.error("Error in createBulkPost1:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};





export const createBulkPost1 = async (req, res) => {
  try {
    const { title, description,category,user } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }
return console.log("posts is ==========>",req.body)

    const hasState = /{state}/.test(title) || /{state}/.test(description);
    const hasCity = /{city}/.test(title) || /{city}/.test(description);
    const hasArea = /{area}/.test(title) || /{area}/.test(description);

    // Helper function to replace placeholders dynamically
    const applyTemplate = (text, data) => {
      return text
        .replace(/{state}/g, data.state || "")
        .replace(/{city}/g, data.city || "")
        .replace(/{area}/g, data.area || "");
    };

    let generatedPosts = [];

    // --------------------------------------------------
    // 1️⃣ STATE BASED POSTS
    // --------------------------------------------------
    if (hasState && !hasCity && !hasArea) {
      const states = await State.find({});
      if (!states.length)
        return res.status(400).json({ success: false, message: "No states found" });

      const posts = states.map(st => {
        const newTitle = applyTemplate(title, { state: st.name });
        const newDesc = applyTemplate(description, { state: st.name });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: st._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all states",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 2️⃣ CITY BASED POSTS
    // --------------------------------------------------
    if (hasCity && !hasArea) {
      const cities = await City.find({}).populate("state", "name");
      if (!cities.length)
        return res.status(400).json({ success: false, message: "No cities found" });

      const posts = cities.map(ct => {
        const newTitle = applyTemplate(title, {
          state: ct.state?.name,
          city: ct.name,
        });

        const newDesc = applyTemplate(description, {
          state: ct.state?.name,
          city: ct.name,
        });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: ct.state?._id,
          city: ct._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all cities",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 3️⃣ AREA BASED POSTS
    // --------------------------------------------------
    if (hasArea) {
      const areas = await Area.find({})
        .populate("state city", "name");

      if (!areas.length)
        return res.status(400).json({ success: false, message: "No areas found" });

      const posts = areas.map(ar => {
        const newTitle = applyTemplate(title, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        const newDesc = applyTemplate(description, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: ar.state?._id,
          city: ar.city?._id,
          area: ar._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all areas",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // If no placeholder is found
    // --------------------------------------------------
    return res.status(400).json({
      success: false,
      message: "No valid placeholder ({state}, {city}, {area}) found in title or description",
    });

  } catch (error) {
    console.error("Error in createBulkPost:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};








/* ============================================================
   ⭐ LIST ALL BULK POSTS
============================================================ */
export const bulkPostList = async (req, res) => {
    try {
        const list = await BulkPost.find({})
            .populate("category state city area user", "name fullName")
           
            .sort({ createdAt: -1 });

        return res.status(200).json(list);

    } catch (err) {
        console.error("Error loading bulk posts:", err);
        res.status(500).json({ message: "Server error" });
    }
};



/* ============================================================
   ⭐ GET BULK POST BY ID
============================================================ */
export const getBulkPostById = async (req, res) => {
    try {
        const post = await BulkPost.findById(req.params.id)
            .populate("category state city area");

        if (!post)
            return res.status(404).json({ message: "Bulk post not found" });

        return res.status(200).json(post);

    } catch (err) {
        console.error("Error fetching bulk post:", err);
        res.status(500).json({ message: "Server error" });
    }
};







/* ============================================================
   ⭐ UPDATE BULK POST
============================================================ */
export const updateBulkPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BulkPost.findById(id);
        if (!post)
            return res.status(404).json({ error: "Bulk post not found" });

        const {
            title,
            content,
            category,
            state,
            city,
            area,
            isAllState,
            isAllCity,
            isAllArea
        } = req.body;

        // If new images uploaded
        let newImages = req.files?.map(file => file.filename);

        if (newImages && newImages.length > 0) {
            // Delete old images
            post.images.forEach(img => {
                const oldPath = path.join(__dirname, "..", "uploads", img);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            });
            post.images = newImages;
        }

        // Update title & slug
        if (title) {
            post.title = title;
            post.slug = slugify(title, { lower: true });
        }

        if (content) post.content = content;
        if (category) post.category = category;

        // NEW — clean consistent logic
        const locations = handleBulkSelection({
            state,
            city,
            area,
            isAllState,
            isAllCity,
            isAllArea
        });

        post.state = locations.state;
        post.city = locations.city;
        post.area = locations.area;

        const updatedPost = await post.save();

        return res.status(200).json({
            message: "Bulk post updated successfully",
            post: updatedPost
        });

    } catch (err) {
        console.error("Error updating bulk post:", err);
        res.status(500).json({ error: "Failed to update bulk post" });
    }
};



/* ============================================================
   ⭐ DELETE BULK POST
============================================================ */
export const deleteBulkPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BulkPost.findById(id);
        if (!post)
            return res.status(404).json({ error: "Bulk post not found" });

        // Delete images
        post.images.forEach(img => {
            const imgPath = path.join(__dirname, "..", "uploads", img);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });

        await BulkPost.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Bulk post deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting bulk post:", err);
        res.status(500).json({ error: "Failed to delete bulk post" });
    }
};





const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDesc = async (req, res) => {
  try {
    const { title } = req.body;
    console.log("title is =======>",title)

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer.",
        },
        {
          role: "user",
          content: `Write a 300-word SEO-friendly, human-like description based on this title: "${title}"`,
        },
      ],
      max_tokens: 450,
      temperature: 0.7,
    });

    res.json({
      description: response.choices[0].message.content,
    });
  } catch (error) {
    console.log("error is =======>",error)
    res.status(500).json({ error: "Content generation failed" });
  }
}



export const updateBulkContact = async (req, res) => {
  try {
    const { selectedStates, category, phone, whatsapp } = req.body;
    // console.log("update blug contact", req.body)
    

    // 🔹 Validation
    if (!selectedStates || selectedStates.length === 0) {
      return res.status(400).json({ message: "Please select at least one state" });
    }

    if (!phone && !whatsapp) {
      return res.status(400).json({ message: "Please provide phone or WhatsApp to update" });
    }

    // 🔹 Build filter
    let filter = {
      state: { $in: selectedStates },   // already ObjectIds from frontend
      status: "published",              // only active ads
    };

    if (category) {
      filter.category = category;       // category ID
    }

    // 🔹 Build update object
    let updateData = {};

    if (phone) updateData.phoneNo = phone;
    if (whatsapp) updateData.whatsappNo = whatsapp;

    // 🔹 Bulk update
    const result = await BulkPost.updateMany(filter, {
      $set: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Bulk contact update successful",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (error) {
    console.error("Bulk Contact Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating bulk contacts",
    });
  }
};



