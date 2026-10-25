
import mongoose from "mongoose";

const SeoContentBankSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Kyunki aap har category ke liye ek unique template pool bana rahe hain
      lowercase: true,
    },

    metaTitles: {
      type: [String],
      default: [], // Kam se kam 3 variations store karne ke liye array
    },

    metaDescriptions: {
      type: [String],
      default: [], // Multiples descriptions variations store karne ke liye array
    },

    headings: {
      type: [String],
      default: [], // Page level headings ka pool
    },

    // Array of arrays - jaisa aapne form state me [[String]] banaya hai
    contentParagraphs: {
      type: [[String]], 
      default: [[]],
    },

    // Form data ke contentHeadings: [{ heading: "", templates: [""] }] ke liye sub-document structure
    contentHeadings: [
      {
        heading: {
          type: String,
          trim: true,
        },
        templates: {
          type: [String],
          default: [],
        },
      },
    ],

    commonIssues: {
      type: String,
      trim: true,
      default: "",
    },

    fallbackVendors: {
      type: String,
      trim: true,
      default: "",
    },

    faqHeading: {
      type: String,
      trim: true,
      default: "",
    },

    // Form data ke faqs: [{ q: "", a: "" }] ke liye structure
    faqs: [
      {
        q: {
          type: String,
          trim: true,
        },
        a: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { 
    timestamps: true // Isse createdAt aur updatedAt automatic manage ho jayenge
  }
);

// Mongoose model registration aur export
const SeoContentBankModel = mongoose.model("SeoContentBank", SeoContentBankSchema);
export default SeoContentBankModel;
