import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    durationDays: {
      type: Number,
      default: 0, // 0 can mean lifetime or unlimited
      min: 0,
    },

    adsLimit: {
      type: Number,
      default: 0, // 0 = unlimited ads
      min: 0,
    },

    enableTopAds: {
      type: Boolean,
      default: false,
    },

    topAdsLimit: {
      type: Number,
      default: 0, // 0 = unlimited top ads
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("MembershipPlan", membershipPlanSchema);
