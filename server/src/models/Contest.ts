import { Document, model, Schema } from "mongoose";

const ContestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  episodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
  leaderboard: [
    {
      type: String,
    },
  ],
});

export interface IContest extends Document {
  _id: string;
  title: string;
  episodes: any[];
  leaderboard: string[];
}

const Contest = model<IContest>("Contest", ContestSchema);
export default Contest;
