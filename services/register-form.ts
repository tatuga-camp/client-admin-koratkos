import axios from "axios";
import { parseCookies } from "nookies";
import {
  Farmer,
  FormEvaluation,
  Pagination,
  RegisterFormEvaluation,
  StatusEvaluation,
} from "../model";

export type RequestGetAllReadyRegisterFormByPage = {
  page: number;
  limit: number;
  status?: StatusEvaluation | "all";
  firstName?: string;
  orderBy?: {
    summitEvaluationDate: "asc" | "desc";
  };
};
export type ResponseGetAllRegisterFormaEvaluation = Pagination<{
  farmer: Farmer;
  registerForm: RegisterFormEvaluation;
}>;
export async function GetAllReadyRegisterFormByPage(
  input: RequestGetAllReadyRegisterFormByPage,
): Promise<ResponseGetAllRegisterFormaEvaluation> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (input.status === null) delete input.status;
    if (input.firstName === "") delete input.firstName;
    const farmer = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/register-form/get-all`,
      data: {
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
