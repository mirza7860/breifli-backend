import express from "express";

const router = express.Router();

import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

router.post("/", createCategory);
router.get("/", getCategories);

export default router;
