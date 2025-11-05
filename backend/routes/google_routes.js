import express from "express";
import passport from "passport";

const API_BASE = import.meta.env.FRONTEND_URL || 'http://localhost:5000';

const router = express.Router();

// 1. route untuk mulai login google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. route callback dari Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    // ✅ simpan session user
    req.session.user = {
      id: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image
    };

    res.redirect(
      `${API_BASE}/login?id_user=${encodeURIComponent(
        user.id_user
      )}&username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(
        user.email
      )}&role=${encodeURIComponent(user.role)}`
    );
  }
);

// ✅ tambahkan ini
export default router;
