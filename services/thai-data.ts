import axios from "axios";
import { Amphure, Tambon } from "../model";

export type ResponseGetAllAmphuresByProvinceService = Amphure[];

export async function GetAllAmphuresByProvinceService(): Promise<ResponseGetAllAmphuresByProvinceService> {
  try {
    const amphures = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_THAI_DATA_URL}/amphure/get-all-by-province-id`,
      params: {
        provinceId: 19,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return amphures.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export type ResponseGetAllTambonByAmphureService = Tambon[];
export type RequestGetAllTambonByAmphureService = {
  amphureId: number;
};
export async function GetAllTambonByAmphureService(
  input: RequestGetAllTambonByAmphureService,
): Promise<ResponseGetAllTambonByAmphureService> {
  try {
    const tambons = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_THAI_DATA_URL}/tambon/get-all-by-amphure-id`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return tambons.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
