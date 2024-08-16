import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT || 6666;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Serve static files from the 'public' directory
app.use(express.static("views"));

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/news", newsRoutes);

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
