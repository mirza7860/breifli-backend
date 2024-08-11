import News from "../models/news.js";

const createNews = async (req, res) => {
  try {
     const { title, description, categories } = req.body;
     const image = req.file.path; 

     const news = new News({
       title,
       description,
       image,
       categories,
     });

     await news.save();
     res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find().populate("categories");
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("categories");
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { title, description, categories } = req.body;
    const updates = { title, description, categories };

    if (req.file) {
      updates.image = req.file.path; 
    }

    const news = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createNews, getNews, getNewsById, updateNews, deleteNews };
