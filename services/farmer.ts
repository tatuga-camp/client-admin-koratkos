import axios from "axios";
import { parseCookies } from "nookies";
import { Farmer, User } from "../model";

type RequestGetListFarmersService = {
  firstName: string;
};
export async function GetListFarmersService(
  input: RequestGetListFarmersService,
): Promise<Farmer[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const farmers = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/farmer/get-all`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return farmers.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
