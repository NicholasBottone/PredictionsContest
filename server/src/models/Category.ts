import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  episode: {
    type: Schema.Types.ObjectId,
    ref: "Episode",
  },
  predictions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prediction",
    },
  ],
  correctPrediction: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
});

export interface ICategory extends Document {
  _id: string;
  title: string;
  episode: any;
  predictions: any[];
  correctPrediction?: string;
  dueDate?: Date;
}

const Category = model<ICategory>("Category", CategorySchema);
export default Category;
