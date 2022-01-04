import { model, Schema } from "mongoose";

const PredictionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  prediction: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface IPrediction extends Document {
  _id: string;
  user: any;
  category: any;
  prediction: string;
  createdAt: Date;
}

const Prediction = model<IPrediction>("Prediction", PredictionSchema);
export default Prediction;
