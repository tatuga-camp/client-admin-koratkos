import axios from "axios";
import { parseCookies } from "nookies";
import { User, UserCreateKey } from "../model";

export async function GetAllUserCreateKeyService(): Promise<UserCreateKey[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const userCreateKey = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user-create-key/get-all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return userCreateKey.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestRefetchUserCreateKey = {
  userCreateKeyId: string;
};

export async function RefetchUserCreateKey(
  input: RequestRefetchUserCreateKey,
): Promise<UserCreateKey> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const userCreateKey = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user-create-key/refetch`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return userCreateKey.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
