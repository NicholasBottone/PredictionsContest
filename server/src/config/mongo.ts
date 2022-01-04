import mongoose from "mongoose";

export function mongoConnection() {
  // connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || "", () => {
    console.log("Connected to MongoDB!");
  });
  // Init the mongoose models
  require("../models/Category");
  require("../models/Prediction");
  require("../models/User");
  require("../models/Contest");
  require("../models/Episode");
}
