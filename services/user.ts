import axios from "axios";
import { parseCookies } from "nookies";
import { User } from "../model";

export async function GetUserService({
  access_token,
}: {
  access_token?: string;
}): Promise<User> {
  try {
    let accessToken = "";
    if (access_token) {
      accessToken = access_token;
    } else {
      const cookies = parseCookies();
      accessToken = cookies.access_token;
    }
    const user = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return user.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
