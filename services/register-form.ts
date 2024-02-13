import axios from "axios";
import { parseCookies } from "nookies";
import {
  Farmer,
  FormEvaluation,
  Pagination,
  RegisterFormEvaluation,
} from "../model";

type RequestGetAllReadyRegisterFormByPage = {
  page: number;
  limit: number;
};
export type ResponseGetAllRegisterFormaEvaluation = Pagination<{
  farmer: Farmer;
  registerForm: RegisterFormEvaluation & { forms: FormEvaluation[] };
}>;
export async function GetAllReadyRegisterFormByPage(
  input: RequestGetAllReadyRegisterFormByPage,
): Promise<ResponseGetAllRegisterFormaEvaluation> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const farmer = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/register-form/get-all`,
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
