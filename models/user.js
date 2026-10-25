



import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    // },

    email: {
  type: String,
  required: false, // <-- required: true HATA DEIN (Required mat rakhein)
  sparse: true,   // <-- sparse: true LAGAYEIN (Taaki multiple null emails allow hon)
  trim: true,
  lowercase: true,
  match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
},
    mobileNo: {
        type: String,
        required: false,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },

   
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null, // User may not have subscription initially
    },


    otp: { type: String },
    otpExpires: { type: Date },

    password: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        maxlength: [300, "Bio cannot exceed 300 characters"],
        default: "",
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: null // Optional, can be null or required
    },

   
    status: {
        type: String,
        enum: ["Active", "Blocked", "Pending", "Suspended"],
        default: "Active",
    },
    dob: {
        type: Date
    },


    address: {
        type: String,
        default: ''
    },
    locality: {
        type: String,
        default: ''
    },

    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: false,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: false,
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    pincode: {
        type: String,
        default: ''
    },

    extra_phone_numbers: {
        type: String,
        default: ''
    },
    profile_picture: {
        type: String,
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    
    // },

     roles: {
      type: [{
        type: String,
        enum: ["buyer", "seller", "admin"],
      }],
      default: ["buyer"],
      required: true,
    },
    


}, { timestamps: true });

export default model('User', userSchema);


