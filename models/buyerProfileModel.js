
const mongoose = require("mongoose");

const buyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    buyerType: {
      type: String,
      enum: [
        "wholesaler",
        "retailer",
        "manufacturer",
        "distributor",
        "trader",
        "importer",
        "exporter",
        "other",
      ],
    },

    categoryIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      trim: true,
      index: true,
    },

    state: {
      type: String,
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

    preferredSupplierLocations: [{
      city: String,
      state: String,
    }],

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
  "BuyerProfile",
  buyerProfileSchema
);
