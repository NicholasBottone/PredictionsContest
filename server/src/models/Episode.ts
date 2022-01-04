import { model, Schema } from "mongoose";

const EpisodeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  contest: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
  },
  image: {
    type: String,
    required: false,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

export interface IEpisode extends Document {
  _id: string;
  title: string;
  image: string;
  contest: any;
  categories: any[];
}

const Episode = model<IEpisode>("Episode", EpisodeSchema);
export default Episode;
