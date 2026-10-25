

// import Post from "../models/postModel.js";
// import State from "../models/stateModel.js";
// import City from "../models/cityModel.js";
// import Area from "../models/areaModel.js";
// import Category from "../models/categoryModel.js";



// const slugify = (text = "") =>
//   text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-");

// export const adsSitemap = async (req, res) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const posts = await Post.find({ status: "published" })
//       .populate("state", "name")
//       .populate("city", "name")
//       .populate("area", "name")
//       .select("slug updatedAt state city area")
//       .lean();

//     let urls = "";

//     posts.forEach((post) => {
//       if (!post.state || !post.slug) return;

//       const state = slugify(post.state.name);
//       const city = post.city ? slugify(post.city.name) : null;
//       const area = post.area ? slugify(post.area.name) : null;

//       let loc = "";

//       if (state && city && area) {
//         loc = `${baseUrl}/ads/${state}/${city}/${area}/${post.slug}`;
//       } else if (state && city) {
//         loc = `${baseUrl}/ads/${state}/${city}/${post.slug}`;
//       } else {
//         loc = `${baseUrl}/ads/${state}/${post.slug}`;
//       }

//       urls += `
//   <url>
//     <loc>${loc}</loc>
//     <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
//     <changefreq>weekly</changefreq>
//     <priority>0.8</priority>
//   </url>`;
//     });

//     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${urls}
// </urlset>`;

//     res.setHeader("Content-Type", "application/xml");
//     res.status(200).send(sitemap);

//   } catch (error) {
//     console.error("Ads sitemap error:", error);
//     res.status(500).send("Failed to generate sitemap");
//   }
// };



// export const sitemapIndex = async (req, res) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get("host")}`;
//     const now = new Date().toISOString();

//     const sitemaps = [
//       { url: `${baseUrl}/sitemap-ads.xml`, lastmod: now },
//       // Future sitemaps can be added here
//       // { url: `${baseUrl}/sitemap-pages.xml`, lastmod: now },
//     ];

//     const xml = `<?xml version="1.0" encoding="UTF-8"?>
// <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${sitemaps
//   .map(
//     (s) => `
//   <sitemap>
//     <loc>${s.url}</loc>
//     <lastmod>${s.lastmod}</lastmod>
//   </sitemap>`
//   )
//   .join("")}
// </sitemapindex>`;

//     res.setHeader("Content-Type", "application/xml");
//     res.status(200).send(xml);
//   } catch (error) {
//     console.error("Sitemap index error:", error);
//     res.status(500).send("Failed to generate sitemap index");
//   }
// };



import Post from "../models/postModel.js";
import State from "../models/stateModel.js";
import City from "../models/cityModel.js";
import Area from "../models/areaModel.js";
import Category from "../models/categoryModel.js";

// ------------------
// Helper: slugify
// ------------------
const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// ------------------
// Cache Setup
// ------------------
let cache = {
  ads: { xml: null, time: 0 },
  pages: { xml: null, time: 0 },
  categories: { xml: null, time: 0 },
  locations: { xml: null, time: 0 },
};
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

// ------------------
// ADS SITEMAP
// ------------------
export const adsSitemap = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.ads.xml && now - cache.ads.time < CACHE_DURATION) {
      return res.header("Content-Type", "application/xml").send(cache.ads.xml);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const posts = await Post.find({ status: "published" })
      .populate("state", "name")
      .populate("city", "name")
      .populate("area", "name")
      .select("slug updatedAt state city area")
      .lean();

    const urls = posts
      .filter(post => post.state && post.slug)
      .map(post => {
        const state = slugify(post.state.name);
        const city = post.city ? slugify(post.city.name) : null;
        const area = post.area ? slugify(post.area.name) : null;

        let loc =
          state && city && area
            ? `${baseUrl}/ads/${state}/${city}/${area}/${post.slug}`
            : state && city
            ? `${baseUrl}/ads/${state}/${city}/${post.slug}`
            : `${baseUrl}/ads/${state}/${post.slug}`;

        return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    cache.ads = { xml, time: now };
    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Ads sitemap error:", err);
    res.status(500).send("Failed to generate ads sitemap");
  }
};

// ------------------
// PAGES SITEMAP
// ------------------
export const pagesSitemap = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.pages.xml && now - cache.pages.time < CACHE_DURATION) {
      return res.header("Content-Type", "application/xml").send(cache.pages.xml);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pages = ["/about", "/contact", "/services", "/faq"]; // Add more

    const urls = pages
      .map(path => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    cache.pages = { xml, time: now };
    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Pages sitemap error:", err);
    res.status(500).send("Failed to generate pages sitemap");
  }
};

// ------------------
// CATEGORIES SITEMAP
// ------------------
export const categoriesSitemap = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.categories.xml && now - cache.categories.time < CACHE_DURATION) {
      return res.header("Content-Type", "application/xml").send(cache.categories.xml);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const categories = await Category.find().select("slug updatedAt").lean();

    const urls = categories
      .map(cat => `
  <url>
    <loc>${baseUrl}/category/${slugify(cat.slug)}</loc>
    <lastmod>${new Date(cat.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    cache.categories = { xml, time: now };
    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Categories sitemap error:", err);
    res.status(500).send("Failed to generate categories sitemap");
  }
};

// ------------------
// LOCATIONS SITEMAP
// ------------------
export const locationsSitemap = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.locations.xml && now - cache.locations.time < CACHE_DURATION) {
      return res.header("Content-Type", "application/xml").send(cache.locations.xml);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const states = await State.find().lean();
    const cities = await City.find().populate("state", "name").lean();
    const areas = await Area.find()
      .populate({
        path: "city",
        select: "name state",
        populate: { path: "state", select: "name" },
      })
      .lean();

    const urls = [];

    states.forEach(state => {
      urls.push(`${baseUrl}/ads/${slugify(state.name)}`);
    });

    cities.forEach(city => {
      if (!city.state) return;
      urls.push(`${baseUrl}/ads/${slugify(city.state.name)}/${slugify(city.name)}`);
    });

    areas.forEach(area => {
      if (!area.city || !area.city.state) return;
      urls.push(
        `${baseUrl}/ads/${slugify(area.city.state.name)}/${slugify(area.city.name)}/${slugify(area.name)}`
      );
    });

    const xmlUrls = urls
      .map(loc => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`)
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

    cache.locations = { xml, time: now };
    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Locations sitemap error:", err);
    res.status(500).send("Failed to generate locations sitemap");
  }
};

// ------------------
// SITEMAP INDEX
// ------------------
export const sitemapIndex = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const now = new Date().toISOString();

    const sitemaps = [
      { url: `${baseUrl}/sitemap-ads.xml`, lastmod: now },
      { url: `${baseUrl}/sitemap-pages.xml`, lastmod: now },
      { url: `${baseUrl}/sitemap-categories.xml`, lastmod: now },
      { url: `${baseUrl}/sitemap-locations.xml`, lastmod: now },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `
  <sitemap>
    <loc>${s.url}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join("")}
</sitemapindex>`;

    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Sitemap index error:", err);
    res.status(500).send("Failed to generate sitemap index");
  }
};
