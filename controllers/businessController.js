





// import Category from '../models/categoryModel.js';
// import Business from '../models/blogModel.js'; // Aapka business listing model
// import City from '../models/cityModel.js';     // Isko sahi kar diya hai
// import Area from '../models/areaModel.js';

// // ==========================================
// // 🚀 UNIQUE TEXT SPINNING DATA BANK
// // ==========================================
// // Yeh bank har page ko unique banayega taaki Google isse duplicate content na maane
// const seoTextBank = {
//   "ac-repair-services": {
//     headings: [
//       "Best {{displayCategory}} in {{displayLocation}} (Doorstep Service)",
//       "Top-Rated {{displayCategory}} Experts Near {{displayLocation}}",
//       "Verified {{displayCategory}} in {{displayLocation}} | Low Charges"
//     ],
//     templates: [
//       [
//         "Garmi ke mausam me agar aapka air conditioner properly cool nahi kar raha hai, to {{displayLocation}} me is samay total {{totalListings}} verified technicians available hain. Hamare top experts jaise {{topVendors}} specialized hain {{commonIssues}} jaise major faults ko short out karne me.",
//         "{{displayLocation}} ke market standards ke hisab se AC maintenance aur gas charging ki shuruaat ₹{{minPrice}} onwards se hoti hai. Aap bina kisi third-party commission ke direct contact numbers aur user ratings ko compare karke professional choice bana sakte hain.",
//         "Hamari directory par aapko wahi vendors milenge jinki average user rating {{avgRating}} Star hai, jo transparent billing aur post-service warranty ki guarantee dete hain."
//       ],
//       [
//         "Kya aapka AC cooling drop kar raha hai ya noise aa rahi hai? {{displayLocation}} me specialized {{displayCategory}} ke liye {{totalListings}} professional teams active hain. Inme {{topVendors}} ko customers ne sabse zyada pasand kiya hai.",
//         "Yahan ke local residential areas me troubleshooting ka base price ₹{{minPrice}} se start hota hai. Aap rates check karke direct WhatsApp ya call par appointment book kar sakte hain.",
//         "Sabhi listed agencies trusted hain aur doorstep repair offer karti hain, jisse aapka time aur extra transport cost dono bach jaate hain."
//       ]
//     ],
//     commonIssues: "Gas Leakage, Compressor repair aur Circuit Board (PCB) problems",
//     fallbackVendors: "local AC technicians",
//     faqs: [
//       {
//         q: "{{displayLocation}} me AC service ke charges kya hain?",
//         a: "{{displayLocation}} me standard AC servicing aur repair ki shuruaat lagbhag ₹{{minPrice}} se ho jaati hai, jo ki issue aur AC ke type par depend karta hai."
//       },
//       {
//         q: "Kya is list me diye gaye vendors door-step service dete hain?",
//         a: "Ji haan, {{displayLocation}} me listed lagbhag sabhi {{displayCategory}} providers doorstep inspection aur on-site repair ki facility dete hain."
//       }
//     ]
//   },
//   "default": {
//     headings: [
//       "Top-Rated {{displayCategory}} in {{displayLocation}} Near Me",
//       "Best {{displayCategory}} Services in {{displayLocation}} - Verified List"
//     ],
//     templates: [
//       [
//         "Agar aap apne local area me reliable {{displayCategory}} search kar rahe hain, to {{displayLocation}} me {{totalListings}} se zyada options listed hain. Inme {{topVendors}} jaise trusted service providers shamil hain.",
//         "Hamari directory par {{displayLocation}} ke businesses ke address, real-time reviews aur contact numbers available hain. Yahan quality services ki range lagbhag ₹{{minPrice}} se start ho jaati hai."
//       ]
//     ],
//     commonIssues: "professional support aur timely delivery",
//     fallbackVendors: "verified local businesses",
//     faqs: [
//       {
//         q: "How to find best {{displayCategory}} in {{displayLocation}}?",
//         a: "Aap hamari directory par unki ratings, user reviews aur experience ke basis par providers ko compare karke best option select kar sakte hain."
//       }
//     ]
//   }
// };

// // Helper function jo text me se {{tokens}} ko real data se replace karega
// const compileSeoTemplate = (templateStr, tokens) => {
//   return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
//     return tokens[key] !== undefined ? tokens[key] : match;
//   });
// };

// // ==========================================
// // 🎯 CORE CONTROLLER FUNCTION
// // ==========================================



// export const getDynamicListingPageData = async (req, res) => {
//   try {
//     // URL Slugs read karna (Format: /delhi/connaught-place/ac-repair-services)
//     // const { citySlug, areaSlug, categorySlug } = req.params;
//     const { categorySlug, citySlug, areaSlug } = req.query;
//     console.log("this is generate seo content")

//     console.log("generate dynamick content ",req.query)

//     // 1. Database se City aur Category check karna (Dono compulsory hain)
//     const [city, category] = await Promise.all([
//       City.findOne({ slug: citySlug }),
//       Category.findOne({ slug: categorySlug, isActive: true })
//     ]);

//     if (!city || !category) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Google Rule Violation: Selected City or Category does not exist." 
//       });
//     }

//     let area = null;
//     let matchQuery = { city: city._id, category: category._id, isActive: true };

//     // 2. Area Validation Check (Agar URL me area slug diya hua hai)
//     if (areaSlug) {
//       area = await Area.findOne({ slug: areaSlug, city: city._id });
//       if (!area) {
//         return res.status(404).json({ 
//           success: false, 
//           message: "Area routing failed or does not belong to this city." 
//         });
//       }
//       matchQuery.area = area._id;
//     } else {
//       // Agar area nahi hai, to pure city ka main page load hoga
//       matchQuery.area = { $exists: false }; 
//     }

//     // 3. Businesses ki list nikalna (Google high rated businesses ko pehle dekhe)
//     const businesses = await Business.find(matchQuery)
//       .select('name rating reviewsCount address phone slug image features')
//       .sort({ rating: -1, reviewsCount: -1 }) 
//       .limit(20);

//     const totalListings = await Business.countDocuments(matchQuery);

//     // Dynamic names set karna text generator ke liye
//     const displayLocation = area ? area.name : city.name;
//     const displayCategory = category.name;

//     // 4. Real-time Metrics Calculate karna
//     const ratingsArray = businesses.map(b => b.rating || 4).filter(Boolean);
//     const avgRating = ratingsArray.length > 0 
//       ? (ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1) 
//       : "4.2";

//     const topVendorsText = businesses.slice(0, 3).map(b => b.name).join(", ");
//     const bankConfig = seoTextBank[category.slug] || seoTextBank["default"];

//     // Tokens dynamic values map karne ke liye
//     const tokens = {
//       displayLocation,
//       displayCategory,
//       totalListings,
//       minPrice: category.basePrice || 299,
//       avgRating,
//       topVendors: topVendorsText || bankConfig.fallbackVendors,
//       commonIssues: bankConfig.commonIssues
//     };

//     // 5. Unique Text Generator Logic (Spinning Engine)
//     const randomHeadingIndex = Math.floor(Math.random() * bankConfig.headings.length);
//     const randomTemplateIndex = Math.floor(Math.random() * bankConfig.templates.length);

//     const compiledHeading = compileSeoTemplate(bankConfig.headings[randomHeadingIndex], tokens);
//     const compiledParagraphs = bankConfig.templates[randomTemplateIndex].map(para => 
//       compileSeoTemplate(para, tokens)
//     );

//     const compiledFaqs = bankConfig.faqs.map(faq => ({
//       question: compileSeoTemplate(faq.q, tokens),
//       answer: compileSeoTemplate(faq.a, tokens)
//     }));

//     // 6. Google Rich Snippet (JSON-LD Schema) Generation
//     const canonicalUrl = area 
//       ? `https://yourdomain.com/${city.slug}/${area.slug}/${category.slug}`
//       : `https://yourdomain.com/${city.slug}/${category.slug}`;

//     const jsonLdSchema = [
//       {
//         "@context": "https://schema.org",
//         "@type": "ItemList",
//         "name": `Top ${displayCategory} in ${displayLocation}`,
//         "url": canonicalUrl,
//         "numberOfItems": businesses.length,
//         "itemListElement": businesses.map((b, index) => ({
//           "@type": "ListItem",
//           "position": index + 1,
//           "name": b.name,
//           "url": `https://yourdomain.com/listing/${b.slug}`
//         }))
//       },
//       {
//         "@context": "https://schema.org",
//         "@type": "FAQPage",
//         "mainEntity": compiledFaqs.map(faq => ({
//           "@type": "Question",
//           "name": faq.question,
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text": faq.answer
//           }
//         }))
//       }
//     ];

//     // 7. Internal Links Structure (Sitemap spidering helper)
//     const internalAreas = await Area.find({ city: city._id, _id: { $ne: area?._id } }).limit(15);
//     const nearbyLocations = internalAreas.map(a => ({
//       label: `${displayCategory} in ${a.name}, ${city.name}`,
//       url: `/${city.slug}/${a.slug}/${category.slug}`
//     }));

//     // 8. Thin Content Safety Guard (Google Quality Checklist)
//     // Agar kisi area me ek bhi listing nahi hai to use noindex kar do taaki crawler penalize na kare
//     const robotsDirective = totalListings < 1 ? "noindex, follow" : "index, follow";

//     // 9. Send response to Next.js Front-end
//     return res.status(200).json({
//       success: true,
//       seoMeta: {
//         robots: robotsDirective,
//         canonical: canonicalUrl,
//         schema: jsonLdSchema
//       },
//       pageData: {
//         displayCategory,
//         displayLocation,
//         totalListings,
//         seoElements: {
//           pageContent: {
//             h2: compiledHeading,
//             paragraphs: compiledParagraphs,
//             faqs: compiledFaqs
//           }
//         },
//         businesses,
//         nearbyLocations
//       }
//     });

//   } catch (error) {
//     console.error("CRITICAL SEO ENGINE CRASH:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// ==========================================
// 🚀 EXTENDED HIGH-DENSITY SEO TEXT ENGINE DATA BANK (1000+ Words Structure)
// ==========================================




import City from "../models/cityModel.js";
import Category from "../models/categoryModel.js";
import Area from "../models/areaModel.js";
import Business from "../models/businessModel.js";
import SeoContentBankModel from "../models/seoContentBankModel.js";






export const getFilteredBusinesses = async (req, res) => {

  try {

    const {
      category,
      subcategory,
      city,
      area,
      rating,
      verified,
      trusted,
      openNow,
      quickResponse,
      deals,
      sort
    } = req.query;

    let filter = {
      isActive: true
    };

    // CATEGORY
    if (category) {
      filter.category = category;
    }

    // SUBCATEGORY
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // CITY
    if (city) {
      filter.city = city;
    }

    // AREA
    if (area) {
      filter.area = area;
    }

    // OPEN NOW
    if (openNow === 'true') {
      filter.isOpen = true;
    }

    // VERIFIED
    if (verified === 'true') {
      filter.isVerified = true;
    }

    // TRUSTED
    if (trusted === 'true') {
      filter.trusted = true;
    }

    // QUICK RESPONSE
    if (quickResponse === 'true') {
      filter.quickResponse = true;
    }

    // DEALS
    if (deals === 'true') {
      filter.hasDeals = true;
    }

    // RATINGS
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // SORTING
    let sortOption = {};

    switch (sort) {

      case 'rating':
        sortOption = { rating: -1 };
        break;

      case 'reviews':
        sortOption = { reviewsCount: -1 };
        break;

      case 'latest':
        sortOption = { createdAt: -1 };
        break;

      default:
        sortOption = { featured: -1, rating: -1 };
    }

    const businesses = await Business.find(filter)
      .populate('category')
      .populate('subcategory')
      .populate('city')
      .populate('area')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// =====================================
// ADD BUSINESS
// =====================================


export const addBusiness = async (req, res) => {
  try {
    console.log("Business Payload Received:", req.body);

    // 1. Instantiate the model with request body data
    const business = new Business(req.body);

    // 2. Save to MongoDB (This automatically triggers Mongoose schema validations)
    const savedBusiness = await business.save();

    // 3. Return success response
    return res.status(201).json({
      success: true,
      message: 'Business added successfully',
      data: savedBusiness
    });

  } catch (error) {
    console.error("Error creating business:", error);

    // Handle Mongoose Validation Errors specifically (e.g., wrong pincode, exceeded image limit)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle Duplicate Key Errors (if you add unique constraints later)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate data error. A business with this information already exists.'
      });
    }

    // Generic fallback for actual server issues
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred',
      error: error.message
    });
  }
};


// =====================================
// UPDATE BUSINESS
// =====================================
export const updateBusiness = async (req, res) => {
  try {

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      data: updatedBusiness
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// DELETE BUSINESS
// =====================================
export const deleteBusiness = async (req, res) => {
  try {

    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);

    if (!deletedBusiness) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// GET SINGLE BUSINESS
// =====================================
export const getSingleBusiness = async (req, res) => {
  try {

    const business = await Business.findById(req.params.id)
      .populate('category')
      .populate('city')
      .populate('area');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// =====================================
// GET ALL BUSINESSES
// =====================================
export const getAllBusinesses = async (req, res) => {
  try {

    const businesses = await Business.find()
      .populate('category')
      .populate('city')
      .populate('area')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// =====================================
// DYNAMIC LISTING PAGE DATA
// =====================================
export const getDynamicListingPageData = async (req, res) => {
  try {

    const {
      category,
      city,
      area
    } = req.query;

    let filter = {
      isActive: true
    };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.city = city;
    }

    if (area) {
      filter.area = area;
    }

    const businesses = await Business.find(filter)
      .populate('category')
      .populate('city')
      .populate('area')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};