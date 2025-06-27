import axios from "axios";
import { parseCookies } from "nookies";
import { User } from "../model";

export async function GetAllFarmerCountService(): Promise<number> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const farmer = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/farmer/get-all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return farmer.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export async function GetAllSuccessEvaluationCountService(): Promise<number> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const evaluation = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/evaluation/get-success`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return evaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export async function GetAllFailEvaluationCountService(): Promise<number> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const evaluation = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/evaluation/get-fail`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return evaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export async function GetAllPendingEvaluationCountService(): Promise<number> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const evaluation = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/evaluation/get-pending`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return evaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export type GroupsType = {
  _count: {
    [key in "plant"]: number;
  };
  plant: string;
  _sum: {
    raiTotal: number;
  };
};
export async function GetAllPlantTypeByGroupService(input?: {
  amphure?: string;
  tambon?: string;
}): Promise<GroupsType[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const plants = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/get-plants/by-group`,
      params: input,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return plants.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

export type GroupsFarmerType = {
  _count: {
    [key in "district" | "subdistrict"]: number;
  };
  district: string;
  subdistrict: string;
};
export async function GetAllFarmereByGroupService(input?: {
  amphure?: string;
}): Promise<GroupsFarmerType[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const plants = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/overview/get-farmer/by-group`,
      params: input,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return plants.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
