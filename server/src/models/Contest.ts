import { model, Schema } from "mongoose";

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
});

export interface IContest extends Document {
  _id: string;
  title: string;
  episodes: any[];
}

const Contest = model<IContest>("Contest", ContestSchema);
export default Contest;
