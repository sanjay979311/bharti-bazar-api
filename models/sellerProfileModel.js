
const mongoose = require("mongoose");

const sellerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    sellerType: {
      type: String,
      required: true,
      enum: [
        "manufacturer",
        "wholesaler",
        "distributor",
        "supplier",
        "trader",
        "exporter",
        "importer",
        "other",
      ],
    },

    businessConstitution: {
      type: String,
      enum: [
        "proprietorship",
        "partnership",
        "llp",
        "private_limited",
        "public_limited",
        "other",
      ],
    },

    categoryIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],

    description: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    employeeCount: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "500+",
      ],
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      match: /^\d{6}$/,
    },

    gstin: {
      type: String,
      uppercase: true,
      trim: true,
      match: /^[0-9A-Z]{15}$/,
    },

    gstVerificationStatus: {
      type: String,
      enum: ["not_submitted", "pending", "verified", "rejected"],
      default: "not_submitted",
    },

    businessVerificationStatus: {
      type: String,
      enum: ["not_submitted", "pending", "verified", "rejected"],
      default: "not_submitted",
    },

    listingStatus: {
      type: String,
      enum: ["draft", "pending_review", "published", "suspended"],
      default: "draft",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "SellerProfile",
  sellerProfileSchema
);
