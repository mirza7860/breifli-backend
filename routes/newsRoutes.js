import express from "express";
import { upload, sourceUpload } from "../config/cloudinary.js";
import {
  createNews,
  deleteNews,
  getNews,
  getNewsById,
  updateNews,
} from "../controllers/newsController.js";
import {
  createNewsSource,
  getAllNewsSources,
} from "../controllers/newsSourceController.js";

const router = express.Router();

// News Source Routes
router.post("/sources", sourceUpload.single("image"), createNewsSource);
router.get("/sources", getAllNewsSources);

router.post("/", upload.single("image"), createNews);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.put("/:id", upload.single("image"), updateNews);
router.delete("/:id", deleteNews);

export default router;
