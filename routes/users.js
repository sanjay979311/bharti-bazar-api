


import express from "express";
import {
  register,
  login,
  logout,
  me,
  googleLogin,
  refreshToken,
  updateProfile,
} from "../controllers/user.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-new-user", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.get("/me", authMiddleware, me);
router.put("/update-user/:id", authMiddleware, updateProfile);

export default router;


