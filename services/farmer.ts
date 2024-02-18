import axios from "axios";
import { parseCookies } from "nookies";
import {
  ActivityKos3,
  DocKos1,
  DocKos2,
  DocKos3,
  DocKos4,
  DocKos5,
  FactoryKos4,
  FarmDocKos1,
  Farmer,
  FileActivityKos3,
  HarvestLogDocKos5,
  OrgCropProdCalForKos2,
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

type RequestGetFarmerKos02Service = {
  farmerId: string;
};
export type ResponseGetFarmerKos02Service = DocKos2 & {
  orgCropProdCalForKos2s: OrgCropProdCalForKos2[];
};
export async function GetFarmerKos02Service(
  input: RequestGetFarmerKos02Service,
): Promise<ResponseGetFarmerKos02Service> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const dockos02 = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/docKos2/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return dockos02.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestGetFarmerKos03Service = {
  farmerId: string;
};
export type ResponseGetFarmerKos03Service = DocKos3 & {
  activities: (ActivityKos3 & { files: FileActivityKos3[] })[];
};
export async function GetFarmerKos03Service(
  input: RequestGetFarmerKos03Service,
): Promise<ResponseGetFarmerKos03Service> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const docKos03 = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/docKos3/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return docKos03.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestGetFarmerKos04Service = {
  farmerId: string;
};
export type ResponseGetFarmerKos04Service = DocKos4 & {
  factors: FactoryKos4[];
};
export async function GetFarmerKos04Service(
  input: RequestGetFarmerKos04Service,
): Promise<ResponseGetFarmerKos04Service> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const docKos04 = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/docKos4/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return docKos04.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestGetFarmerKos05Service = {
  farmerId: string;
};
export type ResponseGetFarmerKos05Service = DocKos5 & {
  harvests: HarvestLogDocKos5[];
};
export async function GetFarmerKos05Service(
  input: RequestGetFarmerKos05Service,
): Promise<ResponseGetFarmerKos05Service> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const docKos05 = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/docKos5/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return docKos05.data;
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
