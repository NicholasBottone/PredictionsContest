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
