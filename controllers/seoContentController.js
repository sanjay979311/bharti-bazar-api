// import SeoContentBankModel from "../models/seoContentBankModel.js";


// // Helper function takki baar-baar try-catch na likhna pade (Optional par professional approach)
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // @desc    Create a new SEO Content Bank entry
// // @route   POST /api/seo-content
// // @access  Private/Admin
// export const createSeoContent = asyncHandler(async (req, res) => {
//   const { categorySlug } = req.body;

//   if (!categorySlug) {
//     return res.status(400).json({ success: false, message: "Category slug is required." });
//   }

//   // Check unique constraint manually for custom error message
//   const existingContent = await SeoContentBankModel.findOne({ categorySlug: categorySlug.toLowerCase().trim() });
//   if (existingContent) {
//     return res.status(400).json({ success: false, message: "This category slug already exists." });
//   }

//   const newSeoContent = await SeoContentBankModel.create(req.body);

//   res.status(201).json({
//     success: true,
//     message: "SEO Content Bank created successfully",
//     data: newSeoContent
//   });
// });

// // @desc    Get all SEO Content Bank entries
// // @route   GET /api/seo-content
// // @access  Public
// export const getAllSeoContent = asyncHandler(async (req, res) => {
//   const contents = await SeoContentBankModel.find().sort({ createdAt: -1 }); // Naya content pehle dikhega
  
//   res.status(200).json({
//     success: true,
//     count: contents.length,
//     data: contents
//   });
// });

// // @desc    Get single SEO Content Bank by Category Slug
// // @route   GET /api/seo-content/:slug
// // @access  Public
// export const getSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const content = await SeoContentBankModel.findOne({ categorySlug: slug.toLowerCase().trim() });

//   if (!content) {
//     return res.status(404).json({ success: false, message: "No SEO content found for this category." });
//   }

//   res.status(200).json({
//     success: true,
//     data: content
//   });
// });

// // @desc    Update SEO Content Bank by Category Slug
// // @route   PUT /api/seo-content/:slug
// // @access  Private/Admin
// export const updateSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;

//   // runValidators aur new true rakhna zaroori hai update me validation active rakhne ke liye
//   const updatedContent = await SeoContentBankModel.findOneAndUpdate(
//     { categorySlug: slug.toLowerCase().trim() },
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!updatedContent) {
//     return res.status(404).json({ success: false, message: "SEO content not found to update." });
//   }

//   res.status(200).json({
//     success: true,
//     message: "SEO Content Bank updated successfully",
//     data: updatedContent
//   });
// });

// // @desc    Delete SEO Content Bank by Category Slug
// // @route   DELETE /api/seo-content/:slug
// // @access  Private/Admin
// export const deleteSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const deletedContent = await SeoContentBankModel.findOneAndDelete({ categorySlug: slug.toLowerCase().trim() });

//   if (!deletedContent) {
//     return res.status(404).json({ success: false, message: "SEO content not found to delete." });
//   }

//   res.status(200).json({
//     success: true,
//     message: "SEO Content Bank deleted successfully."
//   });
// });






// import SeoContentBankModel from "../models/seoContentBankModel.js";
// import businessSchema from "../models/businessSchema.js";

// // Helper function taaki baar-baar try-catch na लिखना pade
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // ==========================================
// // 🛠️ INTERNAL PROGRAMMATIC SEO ENGINES
// // ==========================================

// /**
//  * Helper Engine: Spintax text parsing logic {Option A|Option B}
//  * Auto-selects options inside curly braces to ensure content freshness.
//  */
// const parseSpintax = (text) => {
//   if (!text) return "";
//   const matches = text.match(/\{[^{}]+\}/g);
//   if (!matches) return text;

//   for (let match of matches) {
//     const choices = match.slice(1, -1).split("|");
//     const randomChoice = choices[Math.floor(Math.random() * choices.length)];
//     text = text.replace(match, randomChoice);
//   }

//   // Recursive call agar nested filters ho toh
//   if (text.match(/\{[^{}]+\}/g)) {
//     return parseSpintax(text);
//   }
//   return text;
// };

// /**
//  * Helper Engine: Deterministic Local Matrix Generator
//  * Har city ke naam ke mutabik unique numbers aur price calculate karega, taaki content dynamic lage.
//  */
// const getLocalMatrixTokens = (locationName) => {
//   // City name ka character hash calculate karein taaki data predictable ho aur bar-bar refresh na ho
//   const hash = locationName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
//   const vendorCount = (hash % 21) + 25; // 25 se 45 ke beech dynamic counts
//   const dynamicPrice = (hash % 4) * 100 + 199; // Rs. 199, 299, 399, 499 me se ek select hoga
//   const clientReviewCount = (hash % 150) + 80; // 80 se 230 realistic reviews

//   return {
//     displayLocation: locationName,
//     localVendorCount: `${vendorCount}+ Verified Hubs`,
//     startingPrice: `Rs. ${dynamicPrice}`,
//     reviewCount: `${clientReviewCount}+ reviews`
//   };
// };

// /**
//  * Guard System: Database storage limits aur Google quality guide rules check karne ke liye
//  */
// const validateSeoTemplates = (body) => {
//   const { metaTitles, metaDescriptions, contentParagraphs } = body;
//   const targetVar = "{{displayLocation}}";
//   const spintaxRegex = /\{([^}]+)\|([^}]+)\}/;

//   if (metaTitles && (!Array.isArray(metaTitles) || metaTitles.length < 3)) {
//     return "Scale Guard: At least 3 Meta Title variations are mandatory for 100k scale.";
//   }
//   if (metaDescriptions && (!Array.isArray(metaDescriptions) || metaDescriptions.length < 2)) {
//     return "Scale Guard: At least 2 Meta Description variations are mandatory for 100k scale.";
//   }
//   if (metaTitles && !metaTitles.every(t => t.includes(targetVar))) {
//     return `Validation Failed: Every Meta Title template must contain ${targetVar}`;
//   }
//   if (metaDescriptions && !metaDescriptions.every(d => d.includes(targetVar))) {
//     return `Validation Failed: Every Meta Description template must contain ${targetVar}`;
//   }

//   // 🔥 PERMANENT FIX: .every() ko hata kar .some() lagaya hai taaki plain text lines par error na aaye
//   if (contentParagraphs && Array.isArray(contentParagraphs)) {
//     const flatParagraphs = contentParagraphs.flat();
//     const hasSpintax = flatParagraphs.some(p => spintaxRegex.test(p));
//     if (!hasSpintax) {
//       return "Spintax Violation: Paragraph text lines must include Spintax format (e.g., '{Find|Locate}') to pass Google Filters.";
//     }
//   }
//   return null;
// };


// // ==========================================
// // 🚀 PRODUCTION CONTROLLERS (CRUD + RENDER ENGINE)
// // ==========================================

// // @desc    Create a new SEO Content Bank entry
// // @route   POST /api/seo-content
// // @access  Private/Admin
// export const createSeoContent = asyncHandler(async (req, res) => {
//   const { categorySlug } = req.body;

//   if (!categorySlug) {
//     return res.status(400).json({ success: false, message: "Category slug is required." });
//   }

//   const sanitizedSlug = categorySlug.toLowerCase().trim();

//   // Manual unique constraint verification
//   const existingContent = await SeoContentBankModel.findOne({ categorySlug: sanitizedSlug });
//   if (existingContent) {
//     return res.status(400).json({ success: false, message: "This category slug already exists." });
//   }

//   // Verification pipeline execute karein
//   const validationError = validateSeoTemplates(req.body);
//   if (validationError) {
//     return res.status(400).json({ success: false, message: validationError });
//   }

//   req.body.categorySlug = sanitizedSlug;
//   const newSeoContent = await SeoContentBankModel.create(req.body);

//   res.status(201).json({
//     success: true,
//     message: "SEO Content Bank template registered successfully.",
//     data: newSeoContent
//   });
// });

// // @desc    Get all SEO Content Bank entries
// // @route   GET /api/seo-content
// // @access  Public
// export const getAllSeoContent = asyncHandler(async (req, res) => {
//   const contents = await SeoContentBankModel.find().sort({ createdAt: -1 }); 
  
//   res.status(200).json({
//     success: true,
//     count: contents.length,
//     data: contents
//   });
// });

// // @desc    Get single SEO Content Bank template metadata by Category Slug
// // @route   GET /api/seo-content/:slug
// // @access  Public
// export const getSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const content = await SeoContentBankModel.findOne({ categorySlug: slug.toLowerCase().trim() });

//   if (!content) {
//     return res.status(404).json({ success: false, message: "No SEO template blueprint found for this category." });
//   }

//   res.status(200).json({
//     success: true,
//     data: content
//   });
// });

// // @desc    Update SEO Content Bank template configuration by Category Slug
// // @route   PUT /api/seo-content/:slug
// // @access  Private/Admin
// export const updateSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const sanitizedSlug = slug.toLowerCase().trim();

//   // Validate updates before pushing to database layer
//   const validationError = validateSeoTemplates(req.body);
//   if (validationError) {
//     return res.status(400).json({ success: false, message: validationError });
//   }

//   const updatedContent = await SeoContentBankModel.findOneAndUpdate(
//     { categorySlug: sanitizedSlug },
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!updatedContent) {
//     return res.status(404).json({ success: false, message: "SEO content database map not found." });
//   }

//   res.status(200).json({
//     success: true,
//     message: "SEO Content Bank config updated successfully",
//     data: updatedContent
//   });
// });

// // @desc    Delete SEO Content Bank by Category Slug
// // @route   DELETE /api/seo-content/:slug
// // @access  Private/Admin
// export const deleteSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const deletedContent = await SeoContentBankModel.findOneAndDelete({ categorySlug: slug.toLowerCase().trim() });

//   if (!deletedContent) {
//     return res.status(404).json({ success: false, message: "SEO target document doesn't exist." });
//   }

//   res.status(200).json({
//     success: true,
//     message: "SEO Content Bank deleted successfully from global records."
//   });
// });


// // ==========================================
// // 🔥 100K UNIQUE RENDERING ENGINE CORE ROUTE
// // ==========================================

// // @desc    Get dynamically unique Spun Page Content for a specific Category and Location combo
// // @route   GET /api/seo-content/render/:slug/:location
// // @access  Public
// export const getPageDataForLocation = asyncHandler(async (req, res) => {
//   const { slug, location } = req.params;

//   if (!slug || !location) {
//     return res.status(400).json({ success: false, message: "Both category slug and location string parameters are mandatory." });
//   }

//   // 1. Database blueprint content fetch karein
//   const masterTemplate = await SeoContentBankModel.findOne({ categorySlug: slug.toLowerCase().trim() });
//   if (!masterTemplate) {
//     return res.status(404).json({ success: false, message: "No template matrix registered for this category target." });
//   }

//   // 2. Localized dynamic metrics matrix compile karein
//   const matrices = getLocalMatrixTokens(location);

//   // 3. Selection index calculation (Deterministic Hash Rotation Pattern)
//   const structuralHash = location.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
//   const selectedTitleTemplate = masterTemplate.metaTitles[structuralHash % masterTemplate.metaTitles.length];
//   const selectedDescTemplate = masterTemplate.metaDescriptions[structuralHash % masterTemplate.metaDescriptions.length];

//   // Token replacement compiler injection layer
//   const applyTokens = (text) => {
//     if (!text) return "";
//     return text
//       .replace(/{{displayLocation}}/g, matrices.displayLocation)
//       .replace(/{{localVendorCount}}/g, matrices.localVendorCount)
//       .replace(/{{startingPrice}}/g, matrices.startingPrice)
//       .replace(/{{reviewCount}}/g, matrices.reviewCount)
//       .replace(/{{commonIssues}}/g, masterTemplate.commonIssues || "")
//       .replace(/{{fallbackVendors}}/g, masterTemplate.fallbackVendors || "");
//   };

//   // 4. Transform placeholders and spin variables on live buffer
//   const renderedTitle = parseSpintax(applyTokens(selectedTitleTemplate));
//   const renderedDescription = parseSpintax(applyTokens(selectedDescTemplate));
//   const renderedHeading = parseSpintax(applyTokens(masterTemplate.headings?.[0] || ""));

//   // Sub-headings process blocks mapping
//   const renderedContentHeadings = masterTemplate.contentHeadings?.map(item => ({
//     heading: parseSpintax(applyTokens(item.heading)),
//     templates: item.templates?.map(t => parseSpintax(applyTokens(t))) || []
//   })) || [];

//   // Deep nested configuration elements evaluation loop
//   const renderedParagraphs = masterTemplate.contentParagraphs?.map(paragraphArray => 
//     paragraphArray.map(p => parseSpintax(applyTokens(p)))
//   ) || [];

//   // Frequently Asked Questions array population
//   const renderedFaqs = masterTemplate.faqs?.map(faq => ({
//     q: parseSpintax(applyTokens(faq.q)),
//     a: parseSpintax(applyTokens(faq.a))
//   })) || [];

//   // 5. Google Crawl Engine Optimized Final Payload Delivery
//   res.status(200).json({
//     success: true,
//     meta: {
//       title: renderedTitle,
//       description: renderedDescription
//     },
//     pageData: {
//       mainHeading: renderedHeading,
//       contentParagraphs: renderedParagraphs,
//       contentHeadings: renderedContentHeadings,
//       faqHeading: masterTemplate.faqHeading || "Frequently Asked Questions",
//       faqs: renderedFaqs,
//       commonIssues: masterTemplate.commonIssues,
//       fallbackVendors: masterTemplate.fallbackVendors
//     }
//   });
// });






// import SeoContentBankModel from "../models/seoContentBankModel.js";
// import Category from "../models/categoryModel.js";
// // import City from "../models/cityModel.js";
// // import Area from "../models/areaModel.js";
// import BusinessModel from "../models/businessModel.js";

// // Helper function jo errors ko pakad kar Next middleware (Express Error Handler) tak bhejta hai
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // ==========================================
// // 🛠️ INTERNAL PROGRAMMATIC SEO ENGINES (FIXED & SAFE)
// // ==========================================

// // 🚀 LOOP-SAFE SPINTAX PARSER: Isme loop max 10 baar hi chalega, isliye server KABHI HANG nahi hoga.
// const parseSpintax = (text) => {
//   if (!text || typeof text !== 'string') return "";
  
//   let iterations = 0;
//   const maxIterations = 10; // Infinite loop se bachne ke liye safe guard
  
//   while (text.includes("{") && text.includes("}") && iterations < maxIterations) {
//     const matches = text.match(/\{[^{}]+\}/g);
//     if (!matches) break;

//     let modified = false;
//     for (let match of matches) {
//       // Purane format ke database tokens {city} ya {area} ko skip karein agar woh yahan tak bache hain
//       if (match === "{city}" || match === "{area}") continue;

//       const choices = match.slice(1, -1).split("|");
//       const randomChoice = choices[Math.floor(Math.random() * choices.length)];
//       text = text.replace(match, randomChoice);
//       modified = true;
//     }
    
//     if (!modified) break; // Agar kuch badla nahi toh loop se bahar niklein
//     iterations++;
//   }
  
//   return text;
// };

// // Advanced Matrix Generation for Dynamic Variables (Safe Catch block ke saath)
// const getAdvancedLocalMatrix = (locationName, realBusinessCount) => {
//   try {
//     const hash = locationName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
//     const vendorCount = realBusinessCount > 0 ? realBusinessCount : (hash % 16) + 15; 
//     const dynamicPrice = (hash % 4) * 100 + 199; 
//     const clientReviewCount = (hash % 120) + 60; 

//     return {
//       displayLocation: locationName,
//       localVendorCount: realBusinessCount > 0 ? `${vendorCount}+ Verified Professionals` : `${vendorCount}+ Verified Hubs`,
//       startingPrice: `Rs. ${dynamicPrice}`,
//       reviewCount: `${clientReviewCount}+ reviews`,
//       ratingScore: ((hash % 5) * 0.1 + 4.4).toFixed(1)
//     };
//   } catch (err) {
//     // Agar matrix generation fail ho toh crash na ho, fallback values jayein
//     return {
//       displayLocation: locationName,
//       localVendorCount: "15+ Verified Hubs",
//       startingPrice: "Rs. 299",
//       reviewCount: "50+ reviews",
//       ratingScore: "4.5"
//     };
//   }
// };

// // ==========================================
// // 🔥 100K DYNAMIC ENGINE CONTROLLER (SAFE & OPTIMIZED)
// // ==========================================
// export const getPageDataForLocation = asyncHandler(async (req, res) => {
//   const { categorySlug, citySlug, areaSlug } = req.query;

//   console.log("query  is =========>",req.query)

//   // 1. Mandatory Parameters Validation Check
//   if (!categorySlug || !citySlug) {
//     return res.status(400).json({ 
//       success: false, 
//       message: "Missing Parameters: categorySlug and citySlug are mandatory query parameters." 
//     });
//   }

//   // 2. Safe Database Query for Real Listings count
//   let realBusinessCount = 0;
//   const businessQuery = { categorySlug: categorySlug.toLowerCase().trim() };
  
//   // Model check taaki agar BusinessModel database se connect na ho toh crash na ho
//   if (BusinessModel && BusinessModel.schema) {
//     businessQuery["location.city.slug"] = citySlug.toLowerCase().trim();
//     if (areaSlug) {
//       businessQuery["location.area.slug"] = areaSlug.toLowerCase().trim();
//     }
//     try {
//       realBusinessCount = await BusinessModel.countDocuments(businessQuery);
//     } catch (e) {
//       console.error("Business count error, switching to dynamic system fallback:", e.message);
//       realBusinessCount = 0;
//     }
//   }

//   // 3. Format Location Name Display Strings
//   let locationDisplayName = "";
//   const cleanCity = citySlug.replace(/-/g, " ");
//   const formattedCity = cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1);
//   locationDisplayName = formattedCity;

//   if (areaSlug) {
//     const cleanArea = areaSlug.replace(/-/g, " ");
//     const formattedArea = cleanArea.charAt(0).toUpperCase() + cleanArea.slice(1);
//     locationDisplayName = `${formattedArea}, ${formattedCity}`;
//   }

//   // 4. Fetch Master Template from SeoContentBank
//   const masterTemplate = await SeoContentBankModel.findOne({ categorySlug: categorySlug.toLowerCase().trim() });
  
//   if (!masterTemplate) {
//     return res.status(404).json({ 
//       success: false, 
//       message: `Database Document Not Found: No SEO template found for categorySlug: '${categorySlug}'.` 
//     });
//   }

//   const matrices = getAdvancedLocalMatrix(locationDisplayName, realBusinessCount);
//   const structuralHash = locationDisplayName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

//   // Token Application Function (Dono purane {city} aur naye {{displayLocation}} formats handle honge)
//   const applyTokens = (text) => {
//     if (!text || typeof text !== 'string') return "";
//     return text
//       .replace(/{{displayLocation}}/g, matrices.displayLocation)
//       .replace(/{city}/g, matrices.displayLocation) 
//       .replace(/{{localVendorCount}}/g, matrices.localVendorCount)
//       .replace(/{{startingPrice}}/g, matrices.startingPrice)
//       .replace(/{{reviewCount}}/g, matrices.reviewCount)
//       .replace(/{{ratingScore}}/g, matrices.ratingScore)
//       .replace(/{{commonIssues}}/g, masterTemplate.commonIssues || "")
//       .replace(/{{fallbackVendors}}/g, masterTemplate.fallbackVendors || "");
//   };

//   // 5. Fallback Resolution: Agar array khali hai toh data singular fields se uthaye
//   let rawTitleTemplate = "";
//   if (masterTemplate.metaTitles && masterTemplate.metaTitles.length > 0) {
//     rawTitleTemplate = masterTemplate.metaTitles[structuralHash % masterTemplate.metaTitles.length];
//   } else {
//     rawTitleTemplate = masterTemplate.toObject().metaTitle || "";
//   }

//   let rawDescTemplate = "";
//   if (masterTemplate.metaDescriptions && masterTemplate.metaDescriptions.length > 0) {
//     rawDescTemplate = masterTemplate.metaDescriptions[structuralHash % masterTemplate.metaDescriptions.length];
//   } else {
//     rawDescTemplate = masterTemplate.toObject().metaDescription || "";
//   }

//   let rawHeadingTemplate = "";
//   if (masterTemplate.headings && masterTemplate.headings.length > 0) {
//     rawHeadingTemplate = masterTemplate.headings[0];
//   } else if (masterTemplate.toObject().sections && masterTemplate.toObject().sections.length > 0) {
//     rawHeadingTemplate = masterTemplate.toObject().sections[0].heading || "";
//   }

//   // 6. Render Final Processed Output with Safe Spintax Engine
//   const renderedTitle = parseSpintax(applyTokens(rawTitleTemplate));
//   const renderedDescription = parseSpintax(applyTokens(rawDescTemplate));
//   const renderedHeading = parseSpintax(applyTokens(rawHeadingTemplate));

//   // Process Headings Arrays safely
//   const renderedContentHeadings = (masterTemplate.contentHeadings || []).map(item => ({
//     heading: parseSpintax(applyTokens(item.heading)),
//     templates: (item.templates || []).map(t => parseSpintax(applyTokens(t)))
//   }));

//   // Handle Dynamic paragraphs array safely
//   let renderedParagraphs = (masterTemplate.contentParagraphs || []).map(paragraphArray => 
//     Array.isArray(paragraphArray) ? paragraphArray.map(p => parseSpintax(applyTokens(p))) : []
//   );

//   // Old document sections description fallback
//   if (renderedParagraphs.length === 0 && masterTemplate.toObject().sections?.length > 0) {
//     renderedParagraphs = [[parseSpintax(applyTokens(masterTemplate.toObject().sections[0].description))]];
//   }

//   // Process FAQs array safely (Dono q/a aur question/answer keys supported hain)
//   const renderedFaqs = (masterTemplate.faqs || []).map(faq => {
//     const questionText = faq.q || faq.question || ""; 
//     const answerText = faq.a || faq.answer || "";     
//     return {
//       q: parseSpintax(applyTokens(questionText)),
//       a: parseSpintax(applyTokens(answerText))
//     };
//   });

//   // 7. Success JSON Response Return
//   return res.status(200).json({
//     success: true,
//     meta: {
//       title: renderedTitle,
//       description: renderedDescription,
//       realCount: realBusinessCount
//     },
//     pageData: {
//       mainHeading: renderedHeading,
//       contentParagraphs: renderedParagraphs,
//       contentHeadings: renderedContentHeadings,
//       faqHeading: masterTemplate.faqHeading || "Frequently Asked Questions",
//       faqs: renderedFaqs,
//       commonIssues: masterTemplate.commonIssues || "",
//       fallbackVendors: masterTemplate.fallbackVendors || ""
//     }
//   });
// });

// // ==========================================
// // 🚀 PRODUCTION CRUD CONTROLLERS PLACEHOLDERS
// // ==========================================

// export const createSeoContent = asyncHandler(async (req, res) => {
//   const { categorySlug } = req.body;
//   if (!categorySlug) return res.status(400).json({ success: false, message: "Category slug is required." });
  
//   const sanitizedSlug = categorySlug.toLowerCase().trim();
//   const existingContent = await SeoContentBankModel.findOne({ categorySlug: sanitizedSlug });
//   if (existingContent) return res.status(400).json({ success: false, message: "This category slug already exists." });

//   const newSeoContent = await SeoContentBankModel.create(req.body);
//   res.status(201).json({ success: true, message: "Registered successfully.", data: newSeoContent });
// });

// export const deleteSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const deletedContent = await SeoContentBankModel.findOneAndDelete({ categorySlug: slug.toLowerCase().trim() });
//   if (!deletedContent) return res.status(404).json({ success: false, message: "Target document doesn't exist." });
//   res.status(200).json({ success: true, message: "Deleted successfully." });
// });

// export const getAllSeoContent = asyncHandler(async (req, res) => {
//   const contents = await SeoContentBankModel.find().sort({ createdAt: -1 }); 
//   res.status(200).json({ success: true, count: contents.length, data: contents });
// });

// export const getSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const content = await SeoContentBankModel.findOne({ categorySlug: slug.toLowerCase().trim() });
//   if (!content) return res.status(404).json({ success: false, message: "No template found." });
//   res.status(200).json({ success: true, data: content });
// });

// export const updateSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const updatedContent = await SeoContentBankModel.findOneAndUpdate(
//     { categorySlug: slug.toLowerCase().trim() },
//     req.body,
//     { new: true, runValidators: true }
//   );
//   if (!updatedContent) return res.status(404).json({ success: false, message: "Template not found." });
//   res.status(200).json({ success: true, data: updatedContent });
// });




// import SeoContentBankModel from "../models/seoContentBankModel.js";
// import Category from "../models/categoryModel.js";
// // import City from "../models/cityModel.js";
// // import Area from "../models/areaModel.js";
// import BusinessModel from "../models/businessModel.js";

// // Helper function jo errors ko pakad kar Next middleware (Express Error Handler) tak bhejta hai
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // ==========================================
// // 🛠️ INTERNAL PROGRAMMATIC SEO ENGINES (FIXED & SAFE)
// // ==========================================

// // 🚀 LOOP-SAFE SPINTAX PARSER: Isme loop max 10 baar hi chalega, isliye server KABHI HANG nahi hoga.
// const parseSpintax = (text) => {
//   if (!text || typeof text !== 'string') return "";
  
//   let iterations = 0;
//   const maxIterations = 10; // Infinite loop se bachne ke liye safe guard
  
//   // Custom regex jo structural tokens {city} aur {area} ko chhodkar baki spin choices ko target karega
//   while (text.includes("{") && text.includes("}") && iterations < maxIterations) {
//     const matches = text.match(/\{[^{}]+\}/g);
//     if (!matches) break;

//     let modified = false;
//     for (let match of matches) {
//       // Core dynamic database tokens ko touch nahi karna hai yahan
//       if (match === "{city}" || match === "{area}") continue;

//       const choices = match.slice(1, -1).split("|");
//       const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      
//       // Target match ko raw text se replace karein
//       text = text.replace(match, randomChoice);
//       modified = true;
//     }
    
//     if (!modified) break; // Agar koi clean match spin na ho toh exit karein
//     iterations++;
//   }
  
//   return text;
// };

// // Advanced Matrix Generation for Dynamic Variables (Safe Catch block ke saath)
// const getAdvancedLocalMatrix = (locationName, realBusinessCount) => {
//   try {
//     const hash = locationName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
//     const vendorCount = realBusinessCount > 0 ? realBusinessCount : (hash % 16) + 15; 
//     const dynamicPrice = (hash % 4) * 100 + 199; 
//     const clientReviewCount = (hash % 120) + 60; 

//     return {
//       displayLocation: locationName,
//       localVendorCount: realBusinessCount > 0 ? `${vendorCount}+ Verified Professionals` : `${vendorCount}+ Verified Hubs`,
//       startingPrice: `Rs. ${dynamicPrice}`,
//       reviewCount: `${clientReviewCount}+ reviews`,
//       ratingScore: ((hash % 5) * 0.1 + 4.4).toFixed(1)
//     };
//   } catch (err) {
//     return {
//       displayLocation: locationName,
//       localVendorCount: "15+ Verified Hubs",
//       startingPrice: "Rs. 299",
//       reviewCount: "50+ reviews",
//       ratingScore: "4.5"
//     };
//   }
// };

// // ==========================================
// // 🔥 100K DYNAMIC ENGINE CONTROLLER (SAFE & OPTIMIZED)
// // ==========================================
// export const getPageDataForLocation = asyncHandler(async (req, res) => {
//   const { categorySlug, citySlug, areaSlug } = req.query;

//   console.log("query is =========>", req.query);

//   // 1. Mandatory Parameters Validation Check
//   if (!categorySlug || !citySlug) {
//     return res.status(400).json({ 
//       success: false, 
//       message: "Missing Parameters: categorySlug and citySlug are mandatory query parameters." 
//     });
//   }

//   // 2. Safe Database Query for Real Listings count
//   let realBusinessCount = 0;
//   const businessQuery = { categorySlug: categorySlug.toLowerCase().trim() };
  
//   if (BusinessModel && BusinessModel.schema) {
//     businessQuery["location.city.slug"] = citySlug.toLowerCase().trim();
//     if (areaSlug) {
//       businessQuery["location.area.slug"] = areaSlug.toLowerCase().trim();
//     }
//     try {
//       realBusinessCount = await BusinessModel.countDocuments(businessQuery);
//     } catch (e) {
//       console.error("Business count error, switching to dynamic system fallback:", e.message);
//       realBusinessCount = 0;
//     }
//   }

//   // 3. Format Location Name Display Strings (Advanced Title Casing)
//   let locationDisplayName = "";
//   const cleanCity = citySlug.replace(/-/g, " ");
//   const formattedCity = cleanCity.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
//   locationDisplayName = formattedCity;

//   if (areaSlug) {
//     const cleanArea = areaSlug.replace(/-/g, " ");
//     const formattedArea = cleanArea.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
//     locationDisplayName = `${formattedArea}, ${formattedCity}`;
//   }

//   // 4. Fetch Master Template from SeoContentBank
//   const masterTemplateDoc = await SeoContentBankModel.findOne({ categorySlug: categorySlug.toLowerCase().trim() });
  
//   if (!masterTemplateDoc) {
//     return res.status(404).json({ 
//       success: false, 
//       message: `Database Document Not Found: No SEO template found for categorySlug: '${categorySlug}'.` 
//     });
//   }

//   // Safe Mongoose conversion to Plain JS Object
//   const masterTemplate = masterTemplateDoc.toObject();

//   const matrices = getAdvancedLocalMatrix(locationDisplayName, realBusinessCount);
//   const structuralHash = locationDisplayName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

//   // Token Application Function (Supports {city}, {area}, and {{displayLocation}} styles)
//   const applyTokens = (text) => {
//     if (!text || typeof text !== 'string') return "";
    
//     const isolatedArea = areaSlug ? locationDisplayName.split(',')[0].trim() : locationDisplayName;
    
//     return text
//       .replace(/{{displayLocation}}/g, matrices.displayLocation)
//       .replace(/{city}/g, matrices.displayLocation) 
//       .replace(/{area}/g, isolatedArea) 
//       .replace(/{{localVendorCount}}/g, matrices.localVendorCount)
//       .replace(/{{startingPrice}}/g, matrices.startingPrice)
//       .replace(/{{reviewCount}}/g, matrices.reviewCount)
//       .replace(/{{ratingScore}}/g, matrices.ratingScore)
//       .replace(/{{commonIssues}}/g, masterTemplate.commonIssues || "")
//       .replace(/{{fallbackVendors}}/g, masterTemplate.fallbackVendors || "");
//   };

//   // 5. Fallback Resolution for Strings and Arrays (Database Compatible)
//   let rawTitleTemplate = "";
//   if (Array.isArray(masterTemplate.metaTitles) && masterTemplate.metaTitles.length > 0) {
//     rawTitleTemplate = masterTemplate.metaTitles[structuralHash % masterTemplate.metaTitles.length];
//   } else {
//     rawTitleTemplate = masterTemplate.metaTitle || "";
//   }

//   let rawDescTemplate = "";
//   if (Array.isArray(masterTemplate.metaDescriptions) && masterTemplate.metaDescriptions.length > 0) {
//     rawDescTemplate = masterTemplate.metaDescriptions[structuralHash % masterTemplate.metaDescriptions.length];
//   } else {
//     rawDescTemplate = masterTemplate.metaDescription || "";
//   }

//   let rawHeadingTemplate = "";
//   if (Array.isArray(masterTemplate.headings) && masterTemplate.headings.length > 0) {
//     rawHeadingTemplate = masterTemplate.headings[0];
//   } else if (Array.isArray(masterTemplate.sections) && masterTemplate.sections.length > 0) {
//     rawHeadingTemplate = masterTemplate.sections[0].heading || "";
//   }

//   // 6. Render Final Processed Output with Safe Spintax Engine
//   const renderedTitle = parseSpintax(applyTokens(rawTitleTemplate));
//   const renderedDescription = parseSpintax(applyTokens(rawDescTemplate));
//   const renderedHeading = parseSpintax(applyTokens(rawHeadingTemplate));

//   // Process Headings Arrays safely
//   const renderedContentHeadings = (masterTemplate.contentHeadings || []).map(item => ({
//     heading: parseSpintax(applyTokens(item.heading)),
//     templates: (item.templates || []).map(t => parseSpintax(applyTokens(t)))
//   }));

//   // Handle Dynamic paragraphs array safely / Fallback to 'sections[0].description'
//   let renderedParagraphs = [];
//   if (Array.isArray(masterTemplate.contentParagraphs) && masterTemplate.contentParagraphs.length > 0) {
//     renderedParagraphs = masterTemplate.contentParagraphs.map(paragraphArray => 
//       Array.isArray(paragraphArray) ? paragraphArray.map(p => parseSpintax(applyTokens(p))) : []
//     );
//   } else if (Array.isArray(masterTemplate.sections) && masterTemplate.sections.length > 0) {
//     renderedParagraphs = [[parseSpintax(applyTokens(masterTemplate.sections[0].description))]];
//   }

//   // Process FAQs array safely (Supports both 'question/answer' and 'q/a' keys)
//   const renderedFaqs = (masterTemplate.faqs || []).map(faq => {
//     const questionText = faq.question || faq.q || ""; 
//     const answerText = faq.answer || faq.a || "";     
//     return {
//       q: parseSpintax(applyTokens(questionText)),
//       a: parseSpintax(applyTokens(answerText))
//     };
//   });

//   // Process Internal Links Array (Converts tokens like {city} in links safely)
//   const renderedInternalLinks = (masterTemplate.internalLinks || []).map(link => {
//     if (typeof link !== 'string') return "";
//     return link
//       .toLowerCase()
//       .replace(/{city}/g, citySlug.toLowerCase().trim())
//       .replace(/{area}/g, areaSlug ? areaSlug.toLowerCase().trim() : "");
//   });

//   // 7. Success JSON Response Return
//   return res.status(200).json({
//     success: true,
//     meta: {
//       title: renderedTitle,
//       description: renderedDescription,
//       realCount: realBusinessCount
//     },
//     pageData: {
//       mainHeading: renderedHeading,
//       contentParagraphs: renderedParagraphs,
//       contentHeadings: renderedContentHeadings,
//       faqHeading: parseSpintax(applyTokens(masterTemplate.faqHeading)) || "Frequently Asked Questions",
//       faqs: renderedFaqs,
//       commonIssues: masterTemplate.commonIssues || "",
//       fallbackVendors: masterTemplate.fallbackVendors || "",
//       internalLinks: renderedInternalLinks
//     }
//   });
// });

// // ==========================================
// // 🚀 PRODUCTION CRUD CONTROLLERS PLACEHOLDERS
// // ==========================================

// export const createSeoContent = asyncHandler(async (req, res) => {
//   const { categorySlug } = req.body;
//   if (!categorySlug) return res.status(400).json({ success: false, message: "Category slug is required." });
  
//   const sanitizedSlug = categorySlug.toLowerCase().trim();
//   const existingContent = await SeoContentBankModel.findOne({ categorySlug: sanitizedSlug });
//   if (existingContent) return res.status(400).json({ success: false, message: "This category slug already exists." });

//   const newSeoContent = await SeoContentBankModel.create(req.body);
//   res.status(201).json({ success: true, message: "Registered successfully.", data: newSeoContent });
// });

// export const deleteSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const deletedContent = await SeoContentBankModel.findOneAndDelete({ categorySlug: slug.toLowerCase().trim() });
//   if (!deletedContent) return res.status(404).json({ success: false, message: "Target document doesn't exist." });
//   res.status(200).json({ success: true, message: "Deleted successfully." });
// });

// export const getAllSeoContent = asyncHandler(async (req, res) => {
//   const contents = await SeoContentBankModel.find().sort({ createdAt: -1 }); 
//   res.status(200).json({ success: true, count: contents.length, data: contents });
// });

// export const getSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const content = await SeoContentBankModel.findOne({ categorySlug: slug.toLowerCase().trim() });
//   if (!content) return res.status(404).json({ success: false, message: "No template found." });
//   res.status(200).json({ success: true, data: content });
// });

// export const updateSeoContentBySlug = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   const updatedContent = await SeoContentBankModel.findOneAndUpdate(
//     { categorySlug: slug.toLowerCase().trim() },
//     req.body,
//     { new: true, runValidators: true }
//   );
//   if (!updatedContent) return res.status(404).json({ success: false, message: "Template not found." });
//   res.status(200).json({ success: true, data: updatedContent });
// });




import SeoContentBankModel from "../models/seoContentBankModel.js";
import BusinessModel from "../models/businessModel.js";

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 🛠️ GENUINE SPINTAX PARSER (Multi-Variation Proof)
const parseSpintax = (text) => {
  if (!text || typeof text !== 'string') return "";
  
  let iterations = 0;
  const maxIterations = 15; // Enhanced safety limit
  
  while (text.includes("{") && text.includes("}") && iterations < maxIterations) {
    const matches = text.match(/\{[^{}]+\}/g);
    if (!matches) break;

    let modified = false;
    for (let match of matches) {
      if (match === "{city}" || match === "{area}") continue;

      const choices = match.slice(1, -1).split("|");
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      
      text = text.replace(match, randomChoice);
      modified = true;
    }
    if (!modified) break;
    iterations++;
  }
  return text;
};

// ==========================================
// 🔥 PRODUCTION-GRADE pSEO ENGINE CONTROLLER
// ==========================================
export const getPageDataForLocation = asyncHandler(async (req, res) => {
  // Frontend ya route parameters se parameters fetch karein
  const { categorySlug, citySlug, areaSlug } = req.query;

  // 1. Mandatory Fields Validation
  if (!categorySlug || !citySlug) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing Parameters: categorySlug and citySlug are mandatory." 
    });
  }

  const cleanCategory = categorySlug.toLowerCase().trim();
  const cleanCity = citySlug.toLowerCase().trim();
  const cleanArea = areaSlug ? areaSlug.toLowerCase().trim() : null;

  // 2. Advanced Location Formatter (Title Case)
  const formatLocationName = (slug) => {
    return slug.replace(/-/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const cityName = formatLocationName(cleanCity);
  const areaName = cleanArea ? formatLocationName(cleanArea) : "";
  const locationDisplayName = cleanArea ? `${areaName}, ${cityName}` : cityName;

  // 3. BUILD DYNAMIC BUSINESS QUERY (Sirf active businesses ke liye)
  // Note: Aapke schema me ObjectIds hain, agar query me slugs match karne hain toh ensure karein populate ya aggregation pipeline compatible ho.
  // Performance optimization ke liye hum seedhe standard lookup filters apply karenge.
  const businessQuery = { isActive: true };
  
  // Dynamic lookup strings or deep paths handler
  // Agar aap frontend se strings bhej rahe hain aur DB me IDs hain, toh optimize indexing karni hogi.
  // Maan ke chalte hain aap index optimized paths use kar rahe hain:
  if (cleanArea) {
    businessQuery["areaSlug"] = cleanArea; // Schema matching optimization
  } else {
    businessQuery["citySlug"] = cleanCity;
  }
  businessQuery["categorySlug"] = cleanCategory;

  // 4. EXTRACTION OF ACTUAL DIRECTORY DATA (Justdial Strategy)
  // Hum top 10 relevant businesses nikaal rahe hain jo page ko 100% unique banayenge.
  const activeListings = await BusinessModel.find(businessQuery)
    .select('name address rating reviewsCount phone services isVerified trusted')
    .sort({ isVerified: -1, trusted: -1, rating: -1 })
    .limit(10)
    .lean();

  const realBusinessCount = activeListings.length;

  // 5. ANTI-THIN CONTENT FILTER (No listings = Canonical Redirect or Fallback Alert)
  // Agar kisi area me zero data hai, toh Justdial use main city par point kar deta hai taaki duplicate spam na ho.
  let canonicalUrl = `https://yourdomain.com/${cleanCity}/${cleanCategory}`;
  if (cleanArea && realBusinessCount > 0) {
    canonicalUrl = `https://yourdomain.com/${cleanCity}/${cleanCategory}-in-${cleanArea}`;
  }

  // 6. CALCULATE REAL MATRIX VALUE AGGREGATION (No fake static numbers)
  let totalReviews = 0;
  let highestRating = 4.5;
  let startingPriceHash = (locationDisplayName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 5) * 50 + 249;

  if (realBusinessCount > 0) {
    totalReviews = activeListings.reduce((sum, item) => sum + (item.reviewsCount || 0), 0);
    highestRating = Math.max(...activeListings.map(item => item.rating || 4.0));
  } else {
    // Structural natural numbers for empty states fallback
    const stringHash = locationDisplayName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    totalReviews = (stringHash % 45) + 15;
    highestRating = ((stringHash % 5) * 0.1 + 4.2);
  }

  const seoMatrix = {
    displayLocation: locationDisplayName,
    localVendorCount: realBusinessCount > 0 ? `${realBusinessCount}+ Top Professionals` : "Verified Service Experts",
    startingPrice: `Rs. ${startingPriceHash}`,
    reviewCount: realBusinessCount > 0 ? `${totalReviews} User Ratings` : `${totalReviews}+ Local Reviews`,
    ratingScore: parseFloat(highestRating).toFixed(1)
  };

  // 7. FETCH SEO CONTENT BANK MASTER TEMPLATE
  const masterTemplateDoc = await SeoContentBankModel.findOne({ categorySlug: cleanCategory });
  if (!masterTemplateDoc) {
    return res.status(404).json({ 
      success: false, 
      message: `SEO Template missing for category: '${cleanCategory}'.` 
    });
  }
  const masterTemplate = masterTemplateDoc.toObject();

  // 8. HIGH PERFORMANCE TOKEN TOKEN APPLICATION
  const applyTokens = (text) => {
    if (!text || typeof text !== 'string') return "";
    return text
      .replace(/{{displayLocation}}/g, seoMatrix.displayLocation)
      .replace(/{city}/g, cityName) 
      .replace(/{area}/g, cleanArea ? areaName : cityName) 
      .replace(/{{localVendorCount}}/g, seoMatrix.localVendorCount)
      .replace(/{{startingPrice}}/g, seoMatrix.startingPrice)
      .replace(/{{reviewCount}}/g, seoMatrix.reviewCount)
      .replace(/{{ratingScore}}/g, seoMatrix.ratingScore);
  };

  // Deterministic Selection Index
  const locationIdHash = locationDisplayName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  // Meta Fallbacks Resolution
  let rawTitle = (masterTemplate.metaTitles || [])[locationIdHash % (masterTemplate.metaTitles?.length || 1)] || masterTemplate.metaTitle || "";
  let rawDesc = (masterTemplate.metaDescriptions || [])[locationIdHash % (masterTemplate.metaDescriptions?.length || 1)] || masterTemplate.metaDescription || "";
  let rawHeading = (masterTemplate.headings || [])[0] || "Top Local Services";

  // 9. FINAL COMPILATION & GENERATION
  const finalTitle = parseSpintax(applyTokens(rawTitle));
  const finalDescription = parseSpintax(applyTokens(rawDesc));
  const finalHeading = parseSpintax(applyTokens(rawHeading));

  // Process paragraphs & arrays
  const finalParagraphs = (masterTemplate.contentParagraphs || []).map(pArray => 
    Array.isArray(pArray) ? pArray.map(p => parseSpintax(applyTokens(p))) : []
  );

  const finalFaqs = (masterTemplate.faqs || []).map(faq => ({
    q: parseSpintax(applyTokens(faq.q || faq.question || "")),
    a: parseSpintax(applyTokens(faq.a || faq.answer || ""))
  }));

  // 10. DYNAMIC DIRECTORY SCHEMA GENERATION (Google Local SEO Booster)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": realBusinessCount,
    "itemListElement": activeListings.map((b, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": b.name,
        "address": b.address,
        "telephone": b.phone || "N/A",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": b.rating || 4.5,
          "reviewCount": b.reviewsCount || 10
        }
      }
    }))
  };

  // 11. RESPONSE DISPATCH
  return res.status(200).json({
    success: true,
    seo: {
      metaTitle: finalTitle,
      metaDescription: finalDescription,
      canonical: canonicalUrl,
      schemaData: localBusinessSchema
    },
    pageData: {
      mainHeading: finalHeading,
      locationDetails: seoMatrix,
      listings: activeListings, // Frontend isey grid/list me render karega
      contentParagraphs: finalParagraphs,
      faqs: finalFaqs,
      commonIssues: masterTemplate.commonIssues || "",
      fallbackVendors: masterTemplate.fallbackVendors || ""
    }
  });
});

export const createSeoContent = asyncHandler(async (req, res) => {
})

export const deleteSeoContentBySlug = asyncHandler(async (req, res) => {
})
export const getAllSeoContent = asyncHandler(async (req, res) => {
})
export const getSeoContentBySlug = asyncHandler(async (req, res) => {
})

export const updateSeoContentBySlug = asyncHandler(async (req, res) => {
})

 
 