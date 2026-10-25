






import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { generateAccessToken, generateRefreshToken } from '../utiles/tokenCreate.js'

/* ===============================
   ✅ REGISTER
================================ */
export const register = async (req, res) => {
    try {
        const { fullName, email, password, mobileNo } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobileNo
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

/* ===============================
   ✅ LOGIN
================================ */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // // ✅ Set cookies
        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "Strict",
        //     maxAge: 15 * 60 * 1000
        // });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "Strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, // production में true
            sameSite: "None", // 🔥 CHANGE THIS
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None", // 🔥 CHANGE THIS
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("error is =======>", error)
        res.status(500).json({ error: "Login failed" });
    }
};

/* ===============================
   ✅ GET CURRENT USER (/me)
================================ */
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/* ===============================
   🔁 REFRESH TOKEN
================================ */
export const refresh = (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ error: "No refresh token" });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        res.json({ message: "Token refreshed" });

    } catch (error) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

/* ===============================
   🚪 LOGOUT
================================ */
export const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
};



