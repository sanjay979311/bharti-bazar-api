import Product from "../models/productModel.js";
import Unit from "../models/unitModel.js";
import Category from "../models/categoryModel.js";
import slugify from 'slugify';

// controllers/keywordController.js
import KeywordTag from "../models/keywordTagModel.js";

// =====================================================
// GET KEYWORD SUGGESTION & SMART UNITS
// GET /api/keywords/suggest?query=onion
// =====================================================
export const suggestKeywordMeta = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // Case-insensitive regex match on keyword
    const keywordTag = await KeywordTag.findOne({
      keyword: { $regex: new RegExp(`^${query.trim()}`, "i") }
    })
    .populate('category_id', 'name slug level')
    .populate('default_unit', 'name short_code')
    .populate('allowed_units', 'name short_code');

    if (!keywordTag) {
      return res.status(404).json({
        success: false,
        message: "No smart suggestion found for this keyword",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Smart suggestion fetched successfully",
      data: keywordTag,
    });
  } catch (error) {
    console.error("Keyword Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch keyword suggestion",
      error: error.message,
    });
  }
};


// Helper function to generate clean URL slug using slugify
const generateSlug = (name) => {
  const baseSlug = slugify(name, {
    lower: true,       // Convert to lower case
    strict: true,      // Strip special characters except replacement
    trim: true         // Trim leading and trailing replacement chars
  });
  return `${baseSlug}-${Date.now()}`;
};

// =====================================================
// CREATE PRODUCT
// POST /product/create


// =====================================================

// export const createProduct = async (req, res) => {
//   try {
//     const {
//       product_name,
//       price,
//       unit,
//       min_order_quantity,
//       description,
//       category,
//       location,
//       is_active
//     } = req.body;

//     // Validation
//     if (!product_name || price === undefined || !unit || !category || !location) {
//       return res.status(400).json({
//         success: false,
//         message: "Product name, price, unit, category, and location are required",
//       });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Selected category not found",
//       });
//     }

//     // Check if unit exists
//     const unitExists = await Unit.findById(unit);
//     if (!unitExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Selected unit not found",
//       });
//     }

//     // Handle image file paths uploaded via multer
//     const images = req.files ? req.files.map(file => file.path) : [];
//     const slug = generateSlug(product_name);

//     // Parse location if it comes as a string from form-data
//     let parsedLocation = location;
//     if (typeof location === "string") {
//       try {
//         parsedLocation = JSON.parse(location);
//       } catch (e) {
//         return res.status(400).json({ success: false, message: "Invalid location JSON format" });
//       }
//     }

//     if (!parsedLocation.city) {
//       return res.status(400).json({ success: false, message: "City in location is required" });
//     }

//     // Create product
//     const product = await Product.create({
//       seller_id: req.user._id, // From authMiddleware
//       product_name: product_name.trim(),
//       slug,
//       price: Number(price),
//       unit,
//       min_order_quantity: min_order_quantity ? Number(min_order_quantity) : 1,
//       description: description ? description.trim() : "",
//       images,
//       category,
//       location: parsedLocation,
//       is_active: typeof is_active === "boolean" ? is_active : true,
//     });

//     // Populate references for response
//     await product.populate([
//       { path: "category", select: "name slug" },
//       { path: "unit", select: "name short_code" },
//       { path: "seller_id", select: "name phone" }
//     ]);

//     return res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Create Product Error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Product with this slug or name already exists",
//       });
//     }

//     if (error.name === "CastError") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid ID format for category, unit, or seller",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create product",
//       error: error.message,
//     });
//   }
// };


export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      price,
      unit,
      min_order_quantity,
      description,
      category,
      location,
      is_active,
      target_seller_id // Optional: Agar admin kisi specific seller ke behalf par daal raha ho
    } = req.body;

    // Validation
    if (!product_name || price === undefined || !unit || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Product name, price, unit, category, and location are required",
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

    // Check if unit exists
    const unitExists = await Unit.findById(unit);
    if (!unitExists) {
      return res.status(404).json({
        success: false,
        message: "Selected unit not found",
      });
    }

    // --- Role-Based Seller ID Assignment Logic ---
    let assignedSellerId = req.user._id; // Default to logged-in user

    if (req.user.role === 'admin') {
      // Agar admin ne explicitly kisi seller ke behalf par product add karne ke liye ID bheji hai
      if (target_seller_id) {
        assignedSellerId = target_seller_id;
      }
      // Optional: Agar admin chahta hai ki admin ke daale hue products par status 'verified: true' ho jaye
    }

    // Handle image file paths uploaded via multer
    const images = req.files ? req.files.map(file => file.path) : [];
    const slug = generateSlug(product_name);

    // Parse location if it comes as a string from form-data
    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid location JSON format" });
      }
    }

    if (!parsedLocation.city) {
      return res.status(400).json({ success: false, message: "City in location is required" });
    }

    // Create product
    const product = await Product.create({
      seller_id: assignedSellerId, // 👈 Dynamic seller assignment based on role
      product_name: product_name.trim(),
      slug,
      price: Number(price),
      unit,
      min_order_quantity: min_order_quantity ? Number(min_order_quantity) : 1,
      description: description ? description.trim() : "",
      images,
      category,
      location: parsedLocation,
      is_verified: req.user.role === 'admin' ? true : false, // Admin ka dala hua product direct verified bhi kar sakte hain
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    // Populate references for response
    await product.populate([
      { path: "category", select: "name slug" },
      { path: "unit", select: "name short_code" },
      { path: "seller_id", select: "name phone role" }
    ]);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product with this slug or name already exists",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format for category, unit, seller, or target_seller",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// =====================================================
// BULK CREATE PRODUCTS
// POST /product/bulk-create
// =====================================================
export const bulkCreateProducts = async (req, res) => {
  try {
    const productsArray = req.body.products;
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty products array",
      });
    }

    const processedProducts = productsArray.map(item => ({
      ...item,
      seller_id: req.user._id,
      slug: generateSlug(item.product_name),
      min_order_quantity: item.min_order_quantity || 1
    }));

    const insertedProducts = await Product.insertMany(processedProducts);

    return res.status(201).json({
      success: true,
      message: `${insertedProducts.length} products created successfully`,
      products: insertedProducts,
    });
  } catch (error) {
    console.error("Bulk Create Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk create products",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL PRODUCTS (With Search & Filter)
// GET /product/list
// =====================================================
// =====================================================
// GET ALL PRODUCTS (With Search, Filter & All Status Support)
// GET /product/list
// =====================================================
export const productList = async (req, res) => {
  try {
    const { search, category, city, is_active, page = 1, limit = 10 } = req.query;
    const query = {}; // 👈 Default empty query rakhi hai taaki sabhi products aayein

    // Agar frontend/admin se explicitly is_active filter bheja jaye tabhi filter ho, warna sabhi aayein
    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (city) {
      query['location.city'] = city;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("unit", "name short_code")
      .populate("seller_id", "name phone")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    console.error("Product List Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE PRODUCT BY ID
// GET /product/:id
// =====================================================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("unit", "name short_code")
      .populate("seller_id", "name phone");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT
// PUT /product/update/:id
// =====================================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (updateData.product_name !== undefined) {
      if (!updateData.product_name.trim()) {
        return res.status(400).json({ success: false, message: "Product name cannot be empty" });
      }
      product.product_name = updateData.product_name.trim();
      product.slug = generateSlug(updateData.product_name);
    }

    if (updateData.price !== undefined) product.price = Number(updateData.price);
    if (updateData.min_order_quantity !== undefined) product.min_order_quantity = Number(updateData.min_order_quantity);
    if (updateData.description !== undefined) product.description = updateData.description.trim();

    if (updateData.category !== undefined) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Selected category not found" });
      }
      product.category = updateData.category;
    }

    if (updateData.unit !== undefined) {
      const unitExists = await Unit.findById(updateData.unit);
      if (!unitExists) {
        return res.status(404).json({ success: false, message: "Selected unit not found" });
      }
      product.unit = updateData.unit;
    }

    if (updateData.location !== undefined) {
      let parsedLocation = updateData.location;
      if (typeof parsedLocation === "string") {
        try {
          parsedLocation = JSON.parse(parsedLocation);
        } catch (e) {
          return res.status(400).json({ success: false, message: "Invalid location JSON format" });
        }
      }
      product.location = parsedLocation;
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    if (updateData.is_active !== undefined) {
      product.is_active = updateData.is_active;
    }

    await product.save();
    await product.populate([
      { path: "category", select: "name slug" },
      { path: "unit", select: "name short_code" },
      { path: "seller_id", select: "name phone" }
    ]);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product, category, or unit ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT STATUS (Active / Verified Flags)
// PATCH /product/status/:id
// =====================================================
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, is_verified } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        return res.status(400).json({ success: false, message: "is_active must be a boolean value" });
      }
      product.is_active = is_active;
    }

    if (is_verified !== undefined) {
      if (typeof is_verified !== "boolean") {
        return res.status(400).json({ success: false, message: "is_verified must be a boolean value" });
      }
      product.is_verified = is_verified;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Status Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product status",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT
// DELETE /product/remove/:id
// =====================================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete Product Request for ID:", id);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};