import express from 'express';
import cors from 'cors';
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// For ES modules, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

import jenjangroutes from './routes/jenjangroutes.js';
import pelajaranroutes from './routes/pelajaranroutes.js';
import loginroutes from './routes/loginroutes.js';
import materiroutes from './routes/materiroutes.js';
import babroutes from './routes/babroutes.js';
import subbabroutes from './routes/subbabroutes.js';
import chatRoutes from "./routes/chatroutes.js";
import quiz from './routes/quizroutes.js';
import soal from './routes/soalroutes.js';
import guru from './routes/gururoutes.js';
import course from './routes/courseroutes.js';
import pembelian from './routes/pembelianroutes.js';
import dasboard from './routes/dasboardroutes.js';


// import signinroutes from './routes/signinroutes.js';

// .env already loaded above

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend kamu
  credentials: true                // penting biar cookie dikirim
}));

app.use(express.json());

// untuk sesion
app.use(session({
  secret: "rahasia-super-aman", // ganti dengan string panjang random
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true kalau pakai https
    httpOnly: true,
    sameSite: "lax", // biar cookie bisa terkirim ke FE
    maxAge: 1000 * 60 * 60 // 1 jam
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve folder public yang ada di root project
app.use(express.static(path.resolve(__dirname, "../public")))
// Register routes
// app.use('/api/regis', signinroutes);
app.use('/api/auth', loginroutes);
app.use('/api/jenjang', jenjangroutes);
app.use('/api/pelajaran', pelajaranroutes);
app.use('/api/materi', materiroutes);
app.use('/api/bab', babroutes);
app.use('/api/subbab', subbabroutes);
app.use('/api/quiz', quiz);
app.use('/api/soal', soal);
app.use('/api/chat', chatRoutes);
app.use('/api/guru', guru);
app.use('/api/course', course);
app.use('/api/pembelian', pembelian);
app.use('/api/dashboard', dasboard);


// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rute tidak ditemukan' });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
});

app.listen(5000, () => console.log('Server running on port 5000'));