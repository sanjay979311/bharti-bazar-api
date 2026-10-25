

// import mongoose from 'mongoose';

// const businessSchema = new mongoose.Schema({

//   name: String,

//   slug: String,

//   phone: String,

//   address: String,

//   // CATEGORY
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category'
//   },

//   // SUBCATEGORY
//   subcategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'SubCategory'
//   },

//   city: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'City'
//   },

//   area: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Area'
//   },

//   // FILTER FIELDS
//   rating: {
//     type: Number,
//     default: 0
//   },

//   reviewsCount: {
//     type: Number,
//     default: 0
//   },

//   isOpen: {
//     type: Boolean,
//     default: true
//   },

//   quickResponse: {
//     type: Boolean,
//     default: false
//   },

//   isVerified: {
//     type: Boolean,
//     default: false
//   },

//   trusted: {
//     type: Boolean,
//     default: false
//   },

//   hasDeals: {
//     type: Boolean,
//     default: false
//   },

//   featured: {
//     type: Boolean,
//     default: false
//   },

//   services: [String],

//   tags: [String],

//   isActive: {
//     type: Boolean,
//     default: true
//   }

// }, { timestamps: true });


// // SEO + FILTER PERFORMANCE INDEX
// businessSchema.index({
//   category: 1,
//   subcategory: 1,
//   city: 1,
//   area: 1,
//   rating: -1,
//   isVerified: 1,
//   trusted: 1,
//   isOpen: 1,
//   isActive: 1
// });

// const Business =
//   mongoose.models.Business ||
//   mongoose.model('Business', businessSchema);

// export default Business;




import mongoose from 'mongoose';

// ==========================================
// 1. TIMING SLOT SUB-SCHEMA
// ==========================================
const TimeSlotSchema = new mongoose.Schema({
  openAt: {
    type: String,
    required: true,
    trim: true // e.g., "10:00 AM"
  },
  closeAt: {
    type: String,
    required: true,
    trim: true // e.g., "08:00 PM"
  }
}, { _id: false });

// ==========================================
// 2. GEOJSON POINT SUB-SCHEMA (For Distance Sorting)
// ==========================================
const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude] -> Note: longitude array mein pehle aata hai
    required: [true, 'Coordinates are required for distance-based sorting']
  }
}, { _id: false });

// ==========================================
// 3. MAIN BUSINESS SCHEMA
// ==========================================
const BusinessSchema = new mongoose.Schema({
  
  // --- Section 1: Business Info & Categories ---
  businessName: {
    type: String,
    required: [true, 'Business Title / Company Name is required'],
    trim: true,
    index: true 
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: [true, 'At least one service category is required']
  }],
  // NEWLY ADDED: Subcategory reference array (Multiple subcategories allowed)
  subcategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }],
  selectedDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }],
  timeSlots: {
    type: [TimeSlotSchema],
    default: [{ openAt: '10:00 AM', closeAt: '' }]
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },

  // --- Section 2: Location Details ---
  location: {
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian pincode']
    },
    buildingName: {
      type: String,
      required: [true, 'Block Number / Building Name is required'],
      trim: true
    },
    streetAddress: {
      type: String,
      required: [true, 'Street / Colony Name is required'],
      trim: true
    },
    // NEWLY UPDATED: Area ab string nahi balki 'Area' collection ka ObjectId reference hai
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: [true, 'Area reference is required'],
      index: true
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    // NEWLY UPDATED: City ab string nahi balki 'City' collection ka ObjectId reference hai
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City reference is required'],
      index: true
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State reference is required'],
      index: true
    },
    // Geolocation data for "Sort by Distance"
    geoCoordinates: {
      type: PointSchema,
      required: false 
    }
  },

  // --- Section 3: Contact Details ---
  contact: {
    title: {
      type: String,
      enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof'],
      default: 'Mr'
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    mobileNumbers: [{
      type: String,
      required: [true, 'At least one mobile number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
    }],
    whatsAppNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit WhatsApp number'],
      default: ''
    },
    isWhatsAppSameAsMobile: {
      type: Boolean,
      default: false
    },
    landlineNumbers: [{
      type: String,
      trim: true
    }],
    emails: [{
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    }]
  },

  // --- Section 4: Media Upload ---
  businessImages: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5 uploads']
  },

  // --- Section 5: Side Menu Filters & Sorting Metrics ---
  isVerified: {
    type: Boolean,
    default: false, // Maps to "Jd Verified"
    index: true
  },
  hasDeals: {
    type: Boolean,
    default: false, // Maps to "Deals"
    index: true
  },
  isTrusted: {
    type: Boolean,
    default: false, // Maps to "Jd Trust"
    index: true
  },
  responseTimeInMins: {
    type: Number,
    default: null   // Maps to "Quick Response"
  },
  ratingAverage: {
    type: Number,
    default: 0.0,   // Maps to Ratings (3.5+, 4.0+) & "Sort by Rating"
    min: 0,
    max: 5,
    index: true
  },
  reviewCount: {
    type: Number,
    default: 0      // Helps weight calculation for "Sort by Popular"
  },
  viewCount: {
    type: Number,
    default: 0      // Maps to "Sort by Popular"
  }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Custom validator for image upload limits
function arrayLimit(val) {
  return val.length <= 5;
}

// ==========================================
// 4. DATABASE INDEXES FOR HIGH SPEED
// ==========================================

// 1. 2dsphere index for distance geo-queries
BusinessSchema.index({ "location.geoCoordinates": "2dsphere" });

// 2. Text Search index for business discovery
BusinessSchema.index({ 
  businessName: 'text', 
  description: 'text'
});

// 3. Optimized composite indexes for dropdown side-filters execution
BusinessSchema.index({ 'location.city': 1, 'location.area': 1 });
BusinessSchema.index({ isVerified: 1, ratingAverage: -1 });
BusinessSchema.index({ hasDeals: 1, ratingAverage: -1 });

const Business =
  mongoose.models.Business ||
  mongoose.model('Business', BusinessSchema);

export default Business;