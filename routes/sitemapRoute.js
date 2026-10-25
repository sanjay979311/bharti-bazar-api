// import express from "express";

// import {sitemapIndex,adsSitemap  } from "../controllers/sitemapController.js";

// const router = express.Router();

// // Public routes (NO auth middleware)
// router.get("/sitemap.xml", sitemapIndex);
// router.get("/sitemap-ads.xml", adsSitemap);

// export default router;


import express from "express";
import { sitemapIndex, adsSitemap, pagesSitemap, categoriesSitemap, locationsSitemap } from "../controllers/sitemapController.js";

const router = express.Router();

// Public sitemaps
router.get("/sitemap.xml", sitemapIndex);
router.get("/sitemap-ads.xml", adsSitemap);
router.get("/sitemap-pages.xml", pagesSitemap);
router.get("/sitemap-categories.xml", categoriesSitemap);
router.get("/sitemap-locations.xml", locationsSitemap);

export default router;
