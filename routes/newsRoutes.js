import express from "express";
import upload from "../config/cloudinary.js";
import {
  createNews,
  deleteNews,
  getNews,
  getNewsById,
  updateNews,
} from "../controllers/newsController.js";

const router = express.Router();

router.post("/", upload.single("image"), createNews);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.put("/:id", upload.single("image"), updateNews);
router.delete("/:id", deleteNews);

export default router;
