import axios from "axios";
import { IUser } from "./types";

export async function getUser() {
  try {
    const res = await axios.get("/auth");
    if (res.status === 200 && res.data.success === true) {
      return res.data.user as IUser;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function getContests() {
  try {
    const res = await axios.get("/contest");
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function getContest(id: string) {
  try {
    const res = await axios.get(`/contest/${id}`);
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function getEpisode(id: string) {
  try {
    const res = await axios.get(`/contest/episode/${id}`);
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function postPrediction(id: string, prediction: string) {
  try {
    const res = await axios.post(`/contest/prediction/${id}`, { prediction });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function postContest(title: string) {
  try {
    const res = await axios.post("/contest", { title });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function postEpisode(
  contestId: string,
  title: string,
  image?: string
) {
  try {
    const res = await axios.post(`/contest/${contestId}/episode`, {
      title,
      image,
    });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function postCategory(episodeId: string, title: string) {
  try {
    const res = await axios.post(`/contest/episode/${episodeId}/category`, {
      title,
    });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function putCategory(
  id: string,
  title?: string,
  correctPrediction?: string,
  dueDate?: string
) {
  try {
    const res = await axios.put(`/contest/category/${id}`, {
      title,
      correctPrediction,
      dueDate,
    });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}

export async function putEpisode(id: string, title?: string, image?: string) {
  try {
    const res = await axios.put(`/contest/episode/${id}`, {
      title,
      image,
    });
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status, res.statusText, res.data);
  } catch (error) {
    console.error(error);
  }
}
