import axios from "axios";
import { parseCookies } from "nookies";
import {
  DocKos1,
  FarmDocKos1,
  Farmer,
  PlantKos1,
  RegisterFormEvaluation,
  User,
} from "../model";

type RequestGetListFarmersService = {
  firstName: string;
};
export async function GetListFarmersService(
  input: RequestGetListFarmersService,
): Promise<Farmer[]> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (!input.firstName) throw new Error("firstName is required");
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

type RequestGetFarmerKos01Service = {
  farmerId: string;
};
export type ResponseGetFarmerKos01Service = DocKos1 & {
  farmKos1: FarmDocKos1;
} & { plantKOS1s: PlantKos1[] };
export async function GetFarmerKos01Service(
  input: RequestGetFarmerKos01Service,
): Promise<ResponseGetFarmerKos01Service> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const docKos01 = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/docKos1/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return docKos01.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestGetFarmerService = {
  farmerId: string;
};
export async function GetFarmerService(
  input: RequestGetFarmerService,
): Promise<Farmer & { register: RegisterFormEvaluation }> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const farmer = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/farmer/get`,
      params: {
        ...input,
      },
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
