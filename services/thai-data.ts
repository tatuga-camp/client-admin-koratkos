import axios from "axios";
import { Amphure, Tambon } from "../model";

// server-thai-data has returned error objects with HTTP 200, so don't trust the
// status code alone — consumers (e.g. PrimeReact Dropdown) crash on non-arrays.
function assertArray<T>(data: unknown, endpoint: string): T[] {
  if (!Array.isArray(data)) {
    throw new Error(
      `${endpoint} returned an unexpected response: ${JSON.stringify(data)}`,
    );
  }
  return data;
}

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
    return assertArray<Amphure>(amphures.data, "amphure/get-all-by-province-id");
  } catch (error: any) {
    console.error(error?.response?.data ?? error);
    throw error?.response?.data ?? error;
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
    return assertArray<Tambon>(tambons.data, "tambon/get-all-by-amphure-id");
  } catch (error: any) {
    console.error(error?.response?.data ?? error);
    throw error?.response?.data ?? error;
  }
}
