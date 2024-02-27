import axios from "axios";
import { User } from "../model";

type RequestSignUpService = {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  phone: string;
  password: string;
  createUserKey: string;
};

type ResponseSignUpService = {
  access_token: string;
  user: User;
};

export async function SignUpService(
  input: RequestSignUpService,
): Promise<ResponseSignUpService> {
  try {
    const signUp = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/sign-up`,
      data: { ...input },
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

type RequestSignInService = {
  email: string;
  password: string;
};

type ResponseSignInService = {
  access_token: string;
  user: User;
};

export async function SignInService(
  input: RequestSignInService,
): Promise<ResponseSignInService> {
  try {
    const signIn = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/sign-in`,
      data: { ...input },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return signIn.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestForgetPasswordService = {
  email: string;
};

type ResponseForgetPasswordService = {
  message: string;
};

export async function ForgetPasswordService(
  input: RequestForgetPasswordService,
): Promise<ResponseForgetPasswordService> {
  try {
    const forget = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/forgot-password`,
      params: { ...input },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return forget.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestResetPasswordService = {
  passwordResetToken: string;
  newPassword: string;
};

type ResponseResetPasswordService = User;

export async function ResetPasswordService(
  input: RequestResetPasswordService,
): Promise<ResponseResetPasswordService> {
  try {
    const reset = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/reset-password`,
      data: { ...input },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return reset.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
