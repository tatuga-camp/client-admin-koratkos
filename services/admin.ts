import axios from "axios";
import { parseCookies } from "nookies";
import { User } from "../model";

export async function GetAllUserService(): Promise<User[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const user = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return user.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestDeleteUserService = {
  userId: string;
};
export async function DeleteUserService(
  input: RequestDeleteUserService,
): Promise<User> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const user = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/delete`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return user.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestUnDeleteUserService = {
  userId: string;
};
export async function UnDeleteUserService(
  input: RequestUnDeleteUserService,
): Promise<User> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const user = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/unDelete`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return user.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
