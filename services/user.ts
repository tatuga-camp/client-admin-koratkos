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

type RequestUploadProfileUserService = {
  file: File;
};
export async function UploadProfileUserService(
  input: RequestUploadProfileUserService,
): Promise<User> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formData = new FormData();
    formData.append("file", input.file);
    const user = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/upload-profile`,
      data: { ...input },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return user.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestUpdatePasswordUserService = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};
export async function UpdatePasswordUserService(
  input: RequestUpdatePasswordUserService,
): Promise<User> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const user = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/update-password`,
      data: { ...input },
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

type RequestUpdateUserService = {
  firstName: string;
  lastName: string;
  phone: string;
  organization: string;
};
export async function UpdateUserService(
  input: RequestUpdateUserService,
): Promise<User> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const user = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/update`,
      data: { ...input },
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
