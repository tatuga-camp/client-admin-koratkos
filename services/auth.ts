import axios from "axios";
import { User } from "../model";

type ResponseSignUpService = {
  access_token: string;
  user: User;
};
export async function SignUpService(): Promise<ResponseSignUpService> {
  try {
    const signUp = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/sign-up`,
      data: {},
      headers: {
        "Content-Type": "application/json",
      },
    });
    return signUp.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
