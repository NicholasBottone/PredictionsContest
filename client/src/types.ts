export interface IUser {
  _id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  admin: boolean;
}

export interface IPrediction {
  _id: string;
  user: IUser;
  category: ICategory;
  prediction: string;
  createdAt: Date;
}

export interface IEpisode {
  _id: string;
  title: string;
  image?: string;
  contest: IContest;
  categories: ICategory[];
}

export interface IContest {
  _id: string;
  title: string;
  episodes: IEpisode[];
  leaderboard: string[];
}

export interface ICategory {
  _id: string;
  title: string;
  episode: IEpisode;
  predictions: IPrediction[];
  correctPrediction?: string;
  dueDate?: Date;
}
