import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import categoryRoutes from "./routes/categoryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 6666;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/categories", categoryRoutes);
app.use("/api/news", newsRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
