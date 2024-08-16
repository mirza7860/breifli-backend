import News from "../models/news.js";
import Category from "../models/category.js";
import Newssource from "../models/newsSource.js";
import mongoose from "mongoose";

// Validate or create categories and validate source
const validateOrCreateCategories = async (categories) => {
  const categoryIds = [];

  for (const categoryName of categories) {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({ name: categoryName });
      await category.save();
    }

    categoryIds.push(category._id);
  }

  return categoryIds;
};

const validateSource = async (sourceId) => {
  const validSource = await Newssource.findById(sourceId);
  if (!validSource) {
    throw new Error("Invalid news source.");
  }
};

const createNews = async (req, res) => {
  try {
    const { title, description, categories, source, rank } = req.body;

    console.log(req.body);

    // Ensure categories is an array
    const categoriesArray = Array.isArray(categories)
      ? categories
      : [categories];

    // Validate or create categories and validate source
    const categoryIds = await validateOrCreateCategories(categoriesArray);
    await validateSource(source);

    const image = req.file.path;

    const news = new News({
      title,
      description,
      image,
      categories: categoryIds,
      source,
      rank,
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find().populate("categories").populate("source");

    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid news ID" });
    }

    const news = await News.findById(req.params.id)
      .populate("categories")
      .populate("source");

    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { title, description, categories, source, rank } = req.body;
    const updates = { title, description, rank };

    if (categories) {
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];
      const categoryIds = await validateOrCreateCategories(categoriesArray);
      updates.categories = categoryIds;
    }

    if (source) {
      await validateSource(source);
      updates.source = source;
    }

    if (req.file) {
      updates.image = req.file.path;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("categories")
      .populate("source");

    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid news ID" });
    }

    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createNews, getNews, getNewsById, updateNews, deleteNews };
