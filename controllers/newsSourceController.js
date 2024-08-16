import Newssource from "../models/newsSource.js";

const createNewsSource = async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file.path; // Path from Cloudinary

    // Create new news source
    const newsSource = new Newssource({
      name,
      image: imagePath,
    });

    await newsSource.save();
    res.status(201).json(newsSource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllNewsSources = async (req, res) => {
  try {
    const sources = await Newssource.find();
    res.status(200).json(sources);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export { getAllNewsSources, createNewsSource };
