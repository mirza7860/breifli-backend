import mongoose from "mongoose";

const newsSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Newssource = mongoose.model("Newssource", newsSourceSchema);

export default Newssource;
