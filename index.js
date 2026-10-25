

import express from 'express';
import mongoose from 'mongoose'; // 👈 Direct mongoose import
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectToDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// 🟢 MongoDB Connection
connectToDB()

// Middleware setup
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

// Dynamic CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests like Postman / curl where origin is undefined
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.warn('Blocked by CORS:', origin);
            return callback(null, false); // don't throw an error, just deny
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // fix for legacy browsers
}));

// Simple: allow your frontend
// app.use(cors({ origin: true, credentials: true }));

// Serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Route imports
import mailRoutes from './routes/sendMailRoute.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categoryRoute.js';
import prefixRoutes from './routes/prefixRoutes.js';
import blukPostRoutes from './routes/bulkPostRoute.js';
import postRoutes from './routes/postRoute.js'
import courseRoutes from './routes/courseRoute.js';
import subCategoryRoutes from './routes/subCategoryRoute.js';
import unitRoutes from './routes/unitRoute.js';
import keywordTagRoutes from './routes/keywordTagRoutes.js';
import productRoutes from './routes/productRoute.js';
import countryRoutes from './routes/countryRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import cityRoutes from './routes/cityRoute.js';
import areaRoutes from './routes/areaRoute.js';

import logoRoute from './routes/logoRoute.js';
import bannerRoutes from './routes/bannerRoute.js';
import membershipPlansRoute from './routes/membershipPlanRoutes.js';
import pricingPlanRoute from './routes/pricingPlanRoute.js';
import subscriptionRoute from './routes/subscriptionRoute.js';

import webInfoRoute from './routes/webInfoRoute.js'
import dashboardRoute from './routes/dashboardRoute.js';

// seo route 
import businessRoute from './routes/businessRoute.js';
import sitemapRoute from './routes/sitemapRoute.js';
import seoContentRoute from "./routes/seoContentRoute.js";
import SeoTemplateRoute from './routes/seoTemplateRoutes.js';


// import paymentRoutes from './routes/paymentRoutes.js';

// Route setup
app.use('/api/send-mail', mailRoutes);
app.use('/api', categoryRoutes);
app.use('/api/prefix', prefixRoutes);
app.use('/api', blukPostRoutes);
app.use('/api', postRoutes);
app.use('/api', courseRoutes);

app.use('/api/sub-category', subCategoryRoutes);
app.use('/api/unit', unitRoutes);
app.use('/api/keyword-tag', keywordTagRoutes);
app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/area',areaRoutes)
app.use('/api/logo', logoRoute);
app.use('/api/banner', bannerRoutes);
app.use('/api/membership-plan', membershipPlansRoute);
app.use('/api/pricing-plan',pricingPlanRoute );
app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/web-info', webInfoRoute);
app.use('/api/dashboard', dashboardRoute);

app.use('/api/business', businessRoute);
app.use('/api', sitemapRoute);
app.use("/api/seo-textbank", seoContentRoute);
app.use('/api/seo-template', SeoTemplateRoute);

// app.use('/api/payment', paymentRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
