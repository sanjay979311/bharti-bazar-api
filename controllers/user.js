



import User from '../models/user.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  generateAccessToken,
  generateRefreshToken,
  sendAuthCookies,
} from '../utiles/token.js'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, email, mobileNo, password } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { mobileNo }],
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      mobileNo,
      password: hashed,
    });

    res.status(201).json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Register error" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { input, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: input }, { mobileNo: input }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendAuthCookies(res, accessToken, refreshToken);

    res.json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Login error" });
  }
};

// ✅ GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatar: picture,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendAuthCookies(res, accessToken, refreshToken);

    res.json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Google login error" });
  }
};

// ✅ ME
export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, user });
};

// ✅ REFRESH TOKEN
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken({ _id: decoded.id });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ success: true });
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json({ success: true, user });
};


