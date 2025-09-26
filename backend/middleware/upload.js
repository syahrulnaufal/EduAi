// backend/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// __dirname = folder tempat file ini berada (backend/middleware)
const __dirname = path.resolve();

// path ke ../public/img (keluar dari backend)
const dest = path.resolve(__dirname, "../public/img");

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) => {
    const base = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, "_")
      .toLowerCase();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png") cb(null, true);
  else cb(new Error("Icon wajib PNG"), false);
};

export default multer({ storage, fileFilter });
