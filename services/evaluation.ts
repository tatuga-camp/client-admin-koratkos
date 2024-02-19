import axios from "axios";
import { parseCookies } from "nookies";
import {
  ChildEvalTopicKos06,
  EvalTopicKos06,
  FormEvaluation,
  ListFormEvaluation,
} from "../model";

type RequestGetFormEvaluationsService = {
  farmerId: string;
};
export type ResponseGetFormEvaluationsService = FormEvaluation[];
export async function GetFormEvaluationsService(
  input: RequestGetFormEvaluationsService,
): Promise<ResponseGetFormEvaluationsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formEvaluations = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/get-all`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return formEvaluations.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestCrateFormEvaluationService = {
  farmerId: string;
  evaluatedDate: string;
  docKos06Id: string;
};
export type ResponseCrateFormEvaluationService = FormEvaluation;
export async function CrateFormEvaluationService(
  input: RequestCrateFormEvaluationService,
): Promise<ResponseCrateFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formEvaluation = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/create`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return formEvaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestGetFormEvaluationService = {
  farmerId: string;
  formEvaluationId: string;
};
export type ResponseGetFormEvaluationService = {
  formEvaluation: FormEvaluation;
} & {
  topics: (EvalTopicKos06 & {
    childs: (ChildEvalTopicKos06 & {
      listFormEvaluation: ListFormEvaluation | null;
    })[];
  })[];
};
export async function GetFormEvaluationService(
  input: RequestGetFormEvaluationService,
): Promise<ResponseGetFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formEvaluation = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/get`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return formEvaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
