import multer from "multer";
import path from "path";

// Configure multer for memory storage (we'll process files in memory)
const storage = multer.memoryStorage();

// File filter - accept only PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF and image files (JPEG, PNG) are allowed"));
  }
};

// Configure upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});
