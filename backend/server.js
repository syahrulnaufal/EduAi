import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";

// Gunakan port dari environment variable (diberikan oleh Render), atau 5000 untuk development
const PORT = process.env.PORT || 5000;

// ambil __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load env
dotenv.config({ path: path.join(__dirname, ".env") });

import jenjangroutes from "./routes/jenjangroutes.js";
import pelajaranroutes from "./routes/pelajaranroutes.js";
import loginroutes from "./routes/loginroutes.js";
import materiroutes from "./routes/materiroutes.js";
import babroutes from "./routes/babroutes.js";
import subbabroutes from "./routes/subbabroutes.js";
import chatRoutes from "./routes/chatroutes.js";
import quiz from "./routes/quizroutes.js";
import soal from "./routes/soalroutes.js";
import guru from "./routes/gururoutes.js";
import course from "./routes/courseroutes.js";
import pembelian from "./routes/pembelianroutes.js";
import dasboard from "./routes/dasboardroutes.js";
import users from "./routes/usersroutes.js";
import googleAuthRoutes from "./routes/google_routes.js";

const app = express();
app.set('trust proxy', 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// cors
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tech-edu-ai.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: "rahasia-super-aman",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // true kalau https
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    },
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Konfigurasi Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://eduai-s3k0.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // cek di database
        const [rows] = await db.query("SELECT * FROM users WHERE id_google = ?", [googleId]);

        let user;
        if (rows.length > 0) {
          user = rows[0];
        } else {
          const [result] = await db.query(
            "INSERT INTO users (username, email, id_google, role) VALUES (?, ?, ?, ?)",
            [name, email, googleId, "user"]
          );
          user = {
            id_user: result.insertId,
            username: name,
            email,
            id_google: googleId,
            role: "user",
          };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// static folder
app.use(express.static(path.resolve(__dirname, "../public")));

// route api
app.use("/api/auth", loginroutes);
app.use("/api/jenjang", jenjangroutes);
app.use("/api/pelajaran", pelajaranroutes);
app.use("/api/materi", materiroutes);
app.use("/api/bab", babroutes);
app.use("/api/subbab", subbabroutes);
app.use("/api/quiz", quiz);
app.use("/api/soal", soal);
app.use("/api/chat", chatRoutes);
app.use("/api/guru", guru);
app.use("/api/course", course);
app.use("/api/pembelian", pembelian);
app.use("/api/dashboard", dasboard);
app.use("/api/users", users);
app.use("/auth", googleAuthRoutes);

// endpoint untuk cek user login
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Belum login" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Rute tidak ditemukan" });
});

// error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
});

// app.listen(5000, () => console.log("Server running on port 5000"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
