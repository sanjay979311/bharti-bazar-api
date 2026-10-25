



// import mongoose from "mongoose";

// const seoTemplateSchema = new mongoose.Schema(
//     {
//         categorySlug: {
//             type: String,
//             required: true,
//             unique: true,
//         },

//         categoryName: {
//             type: String,
//             required: true,
//         },

//         metaTitle: {
//             type: String,
//             required: true,
//         },

//         metaDescription: {
//             type: String,
//             required: true,
//         },

//         sections: [
//             {
//                 headingType: {
//                     type: String,
//                     enum: [
//                         "h1",
//                         "h2",
//                         "h3",
//                         // "h4",
//                         // "h5",
//                         // "h6",
//                     ],
//                     default: "h2",
//                 },

//                 heading: {
//                     type: String,
//                     required: true,
//                 },

//                 description: {
//                     type: String,
//                     required: true,
//                 },
//             },
//         ],

//         faqs: [
//             {
//                 question: {
//                     type: String,
//                     required: true,
//                 },

//                 answer: {
//                     type: String,
//                     required: true,
//                 },
//             },
//         ],

//         internalLinks: [String],
//     },
//     {
//         timestamps: true,
//     }
// );

// export default mongoose.model(
//     "SeoTemplate",
//     seoTemplateSchema
// );


// models/SeoTemplate.js

import mongoose from "mongoose";

const seoTemplateSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      unique: true,
      required: true,
    },

    titles: [String],

    descriptions: [String],

    introTemplates: [String],

    faqTemplates: [
      {
        q: String,
        a: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SeoTemplate",
  seoTemplateSchema
);