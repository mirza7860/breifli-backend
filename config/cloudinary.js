import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "news-images",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const sourceStorage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "newssource-images",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

// Create multer instance with Cloudinary storage
const upload = multer({ storage: storage });
const sourceUpload = multer({ storage: sourceStorage });

export { upload, sourceUpload };
