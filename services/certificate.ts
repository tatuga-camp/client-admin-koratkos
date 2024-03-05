import axios from "axios";
import { parseCookies } from "nookies";
import { Certificate, Farmer } from "../model";

export type ResponseGetCertificateService = Certificate & { farmer: Farmer };
export async function GetCertificateService(input: {
  certificateId: string;
}): Promise<ResponseGetCertificateService> {
  try {
    const certificate = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/certificate/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return certificate.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export type ResponseGetAllCertificateService = Certificate[];
export async function GetAllCertificateService(input: {
  farmerId: string;
}): Promise<ResponseGetAllCertificateService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const certificate = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/certificate/get-all`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return certificate.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export type ResponseCreateCertificateService = Certificate;
export async function CreateCertificateService(input: {
  farmerId: string;
  certRequestDate: string;
  certExpiredDate: string;
}): Promise<ResponseCreateCertificateService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const certificate = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/certificate/create`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return certificate.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export async function DeleteCertificateService(input: {
  certificateId: string;
}): Promise<{ message: string }> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const certificate = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/certificate/delete`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return certificate.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
