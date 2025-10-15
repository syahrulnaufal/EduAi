import express from 'express';
import { loginUser,
  signinUser,
  getUserById,
  listUsers,
  updateUser,
  updatePassword,
  deleteUser,
  updateProfile,
  updateProfilePassword } from '../control/logincontrol.js';
import { verifyUser, adminOnly } from "../middleware/auth.js";

const router = express.Router();



// POST /api/auth/login
router.post('/login', loginUser);
// POST /api/auth/signin
router.post('/signin', signinUser);

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Gagal hapus session:", err);
        return res.status(500).json({ message: "Gagal logout" });
      }
      res.clearCookie("connect.sid"); // cookie session default express-session
      return res.json({ message: "Logout berhasil" });
    });
  } else {
    return res.json({ message: "Tidak ada session untuk dihapus" });
  }
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Silakan login dulu" });
  }
  res.json({ user: req.session.user });
});

// PUT /api/auth/profile - update user profile
router.put("/profile", verifyUser, updateProfile);

// PUT /api/auth/password - update user password
router.put("/password", verifyUser, updateProfilePassword);

// hanya admin
router.get("/users", verifyUser, adminOnly, listUsers);


// GET /api/admin/test -> hanya admin
router.get("/admin/test", verifyUser, adminOnly, (req, res) => {
  res.json({
    message: "Halo Admin!",
    user: req.session.user
  });
});


export default router;