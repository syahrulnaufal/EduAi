import express from 'express';
import { loginUser,
  signinUser,
  getUserById,
  listUsers,
  updateUser,
  updatePassword,
  deleteUser } from '../control/logincontrol.js';
import { verifyUser, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginUser);
// POST /api/auth/signin
router.post('/signin', signinUser);

// POST /api/auth/logout
router.post("/logout", verifyUser, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout gagal" });
    }
    res.clearCookie("connect.sid"); // hapus cookie session
    return res.json({ message: "Logout berhasil" });
  });
});

router.get("/me", verifyUser, (req, res) => {
  res.json({ user: req.session.user });
});

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