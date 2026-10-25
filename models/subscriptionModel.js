// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
     paymentId: {
      type: String,
      unique: true,
      index: true,
    },
    startDate: {
      type: Date,
      default: null, // Will be set when admin assigns or user subscribes
    },
    endDate: {
      type: Date,
      default: null, // Calculated from startDate + plan.durationDays
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "expired", "cancelled"],
      default: "inactive",
    },
    assignedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
