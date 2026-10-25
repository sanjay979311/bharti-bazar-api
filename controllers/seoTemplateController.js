




// import { formatText, pickStableValue, replaceTemplate } from "../utiles/seoHelpers.js";

// // Justdial की तरह "Near Me", "Top 20" और "Best" का परफेक्ट कॉम्बिनेशन
// const titleTemplates = [
//   "{category} Near Me in {location} - Compare Charges, Reviews & Experts",
//   "Top 20 {category} in {location} - Best {category} Classes {location} - Justdial",
//   "Best {category} in {location} - Ratings, Reviews & Service Charges",
//   "{category} Services in {location} - Verified Providers Near You"
// ];

// const descriptionTemplates = [
//   "Looking for {category_lowercase} near you in {location}? Our platform helps you compare trusted local experts. Check ratings, charges & choose the right service near you.",
//   "{category} in {location}. Find ✓{category} Classes, ✓ {category} Tutorials. Get Phone Numbers, Address, Reviews, Photos, Maps for top {category} near me on our directory.",
//   "Find the best {category} in {location}. Compare ratings, reviews, service charges, and direct contact details of verified local providers instantly."
// ];

// export const getListingPageSeo = async (req, res) => {
//   try {
//     const { categorySlug, citySlug, areaSlug } = req.query;

//     // 1. Strict Validation: Category and City must always exist
//     if (!categorySlug || !citySlug) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing parameters: categorySlug and citySlug are required."
//       });
//     }

//     // 2. Programmatic Text Generation (Handles Gorakhpur vs Sahjanwa, Gorakhpur)
//     const categoryText = formatText(categorySlug);
//     const cityText = formatText(citySlug);
//     const areaText = areaSlug ? formatText(areaSlug) : "";
    
//     // Justdial स्टाइल लोकेशन हैंडलिंग
//     const locationText = areaText ? `${areaText}, ${cityText}` : cityText;

//     // 3. Dynamic Template Injection
//     const pathKey = areaSlug ? `${categorySlug}-${citySlug}-${areaSlug}` : `${categorySlug}-${citySlug}`;
    
//     const templateValues = {
//       category: categoryText,
//       category_lowercase: categoryText.toLowerCase(),
//       location: locationText
//     };

//     const titleTemplate = pickStableValue(`${pathKey}-title`, titleTemplates);
//     const descriptionTemplate = pickStableValue(`${pathKey}-desc`, descriptionTemplates);

//     const title = replaceTemplate(titleTemplate, templateValues);
//     const description = replaceTemplate(descriptionTemplate, templateValues);

//     // 4. Clean & Consistent URL Routing for Canonical Tags
//     const baseUrl = process.env.SITE_URL || "https://yourwebsite.com";
//     const cleanUrlPath = areaSlug 
//       ? `${citySlug}/${categorySlug}/${areaSlug}` 
//       : `${citySlug}/${categorySlug}`;
    
//     const canonicalUrl = `${baseUrl}/${cleanUrlPath}`.toLowerCase();
//     const ogImage = `${baseUrl}/images/default-listing-banner.jpg`;

//     // 5. Justdial-Style Comma Separated Keywords (String Format)
//     const keywords = `${categoryText} in ${locationText}, ${categoryText} ${cityText}, Best ${categoryText} in ${cityText}, Reviews, Map, Address, Phone Number, Contact Number, Ratings, Services Near Me`;

//     // 6. DYNAMIC SCHEMA GENERATION (गूगल इंडेक्सिंग को 10x फ़ास्ट करने के लिए)
//     const jsonLdSchema = {
//       "@context": "https://schema.org",
//       "@type": "ItemList",
//       "name": `Top ${categoryText} in ${locationText}`,
//       "description": description,
//       "url": canonicalUrl,
//       "itemListElement": [] // आपका फ्रंटएंड इस एरे में वेंडर्स की लिस्ट मैप कर सकता है
//     };

//     // 7. Return Structured SEO Payload
//     return res.status(200).json({
//       success: true,
//       data: {
//         htmlLang: "en-IN",
//         title,
//         description,
//         canonical: canonicalUrl,
//         keywords,
//         schema: jsonLdSchema, // इसे फ्रंटएंड के <head> में <script type="application/ld+json"> में डालें
//         openGraph: {
//           title,
//           description,
//           url: canonicalUrl,
//           type: "website",
//           image: ogImage
//         },
//         twitter: {
//           card: "summary_large_image",
//           title,
//           description,
//           image: ogImage
//         }
//       }
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "SEO Generation Error",
//       error: error.message
//     });
//   }
// };







// export const getSeoMeta = async() =>{
  
// }


// controllers/seoTemplateController.js






import SeoTemplate from "../models/seoTemplateModel.js";

/* =================================
   CREATE SEO TEMPLATE
================================= */
export const createSeoTemplate =
    async (req, res) => {
        try {
            const {
                categorySlug,
                categoryName,
                metaTitle,
                metaDescription,
                sections,
                faqs,
                internalLinks,
            } = req.body;
            console.log("seo template is ============>",req.body)

            

            // Check Existing Template
            const existingTemplate =
                await SeoTemplate.findOne({
                    categorySlug,
                });

            if (existingTemplate) {
                return res.status(409).json({
                    success: false,
                    message:
                        "SEO Template already exists",
                });
            }

            // Create Template
            const template =
                await SeoTemplate.create({
                    categorySlug,
                    categoryName,
                    metaTitle,
                    metaDescription,
                    sections,
                    faqs,
                    internalLinks,
                });

            return res.status(201).json({
                success: true,
                message:
                    "SEO Template created successfully",
                data: template,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create SEO Template",
            });
        }
    };

/* =================================
   GET ALL SEO TEMPLATES
================================= */
export const getSeoTemplates =
    async (req, res) => {
        try {
            const templates =
                await SeoTemplate.find().sort({
                    createdAt: -1,
                });

            return res.status(200).json({
                success: true,
                count: templates.length,
                data: templates,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch SEO Templates",
            });
        }
    };

/* =================================
   GET SINGLE SEO TEMPLATE
================================= */
export const getSingleSeoTemplate =
    async (req, res) => {
        try {
            const { id } = req.params;

            const template =
                await SeoTemplate.findById(
                    id
                );

            if (!template) {
                return res.status(404).json({
                    success: false,
                    message:
                        "SEO Template not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: template,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch SEO Template",
            });
        }
    };

/* =================================
   UPDATE SEO TEMPLATE
================================= */
export const updateSeoTemplate =
    async (req, res) => {
        try {
            const { id } = req.params;

            const updatedTemplate =
                await SeoTemplate.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!updatedTemplate) {
                return res.status(404).json({
                    success: false,
                    message:
                        "SEO Template not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "SEO Template updated successfully",
                data: updatedTemplate,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update SEO Template",
            });
        }
    };

/* =================================
   DELETE SEO TEMPLATE
================================= */
export const deleteSeoTemplate =
    async (req, res) => {
        try {
            const { id } = req.params;

            const template =
                await SeoTemplate.findById(
                    id
                );

            if (!template) {
                return res.status(404).json({
                    success: false,
                    message:
                        "SEO Template not found",
                });
            }

            await template.deleteOne();

            return res.status(200).json({
                success: true,
                message:
                    "SEO Template deleted successfully",
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete SEO Template",
            });
        }
    };