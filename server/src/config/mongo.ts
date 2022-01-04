import mongoose from "mongoose";
import secrets from "./secrets";

export function mongoConnection() {
  // connect to MongoDB
  mongoose.connect(secrets.MONGODB_URI, () => {
    console.log("Connected to MongoDB!");
  });
  // Init the mongoose models
  require("../models/Category");
  require("../models/Prediction");
  require("../models/User");
  require("../models/Contest");
  require("../models/Episode");
}
