import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  discordId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  discriminator: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

export interface IUser extends Document {
  _id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  admin: boolean;
}

const User = model<IUser>("User", UserSchema);
export default User;
