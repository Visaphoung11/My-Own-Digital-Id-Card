import axios from "@/lib/api/request";
import { IUser } from "@/type/user-type";

export const userRequest = () => {
  const PROFILE = async (): Promise<IUser> => {
    return await axios({
      url: "/user/me",
      method: "GET",
    });
  };
  return {
    PROFILE,
  };
};
