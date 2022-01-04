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
  user: any;
  category: any;
  prediction: string;
  createdAt: Date;
}

export interface IEpisode {
  _id: string;
  title: string;
  contest: any;
  categories: any[];
}

export interface IContest {
  _id: string;
  title: string;
  episodes: any[];
}

export interface ICategory {
  _id: string;
  title: string;
  episode: any;
  predictions: any[];
  correctPrediction?: string;
  dueDate?: Date;
}
