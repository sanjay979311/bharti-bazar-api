// const mongoose = require("mongoose");

// const textBankSchema = new mongoose.Schema({
//   category: {
//     type: String,
//     required: true,
//     unique: true
//   },

//   templates: {
//     tagline: {
//       type: String,
//       required: true
//     },
//     contact: {
//       type: String,
//       required: true
//     },
//     rating_text: {
//       type: String,
//       required: true
//     },
//     description_text: String
//   },

//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("TextBank", textBankSchema);



import mongoose from "mongoose";

const textBankSchema = new mongoose.Schema({
   type: {
      type: String,
      required: true,
   },

   categorySlug: {
      type: String,
      required: true,
   },

   texts: [
      {
         type: String,
      }
   ],
});

export default mongoose.model(
   "TextBank",
   textBankSchema
);


