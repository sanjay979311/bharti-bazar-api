// import express from "express";
// import { getSeoMeta,getListingPageSeo } from "../controllers/seoTemplateController.js";

// const router = express.Router();

// // Example:
// // /api/seo/meta?categorySlug=ac-repair&locationSlug=kolkata
// router.get("/meta", getSeoMeta);
// router.get("/generate-metadata", getListingPageSeo);

// export default router;

// routes/seoTemplateRoutes.js

import express from "express";

import {
    createSeoTemplate,
    getSeoTemplates,
    getSingleSeoTemplate,
    updateSeoTemplate,
    deleteSeoTemplate,
} from "../controllers/seoTemplateController.js";

const router = express.Router();

/* =================================
   CREATE SEO TEMPLATE
================================= */
router.post(
    "/create",
    createSeoTemplate
);

/* =================================
   GET ALL SEO TEMPLATES
================================= */
router.get(
    "/all",
    getSeoTemplates
);

/* =================================
   GET SINGLE SEO TEMPLATE
================================= */
router.get(
    "/:id",
    getSingleSeoTemplate
);

/* =================================
   UPDATE SEO TEMPLATE
================================= */
router.put(
    "/update/:id",
    updateSeoTemplate
);

/* =================================
   DELETE SEO TEMPLATE
================================= */
router.delete(
    "/delete/:id",
    deleteSeoTemplate
);

export default router;
