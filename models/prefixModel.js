import { Schema, model } from "mongoose";

const prefixSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("Prefix", prefixSchema);

