import axios from "axios";
import { parseCookies } from "nookies";
import {
  ChildEvalTopicKos06,
  EvalTopicKos06,
  FileOnKos06,
  FileOnListFormEvaluation,
  FormEvaluation,
  ListFormEvaluation,
  StatusEvaluation,
  User,
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
        docKos06Id: process.env.NEXT_PUBLIC_DOC_KOS06_ID,
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

type RequestUpdateFormEvaluationService = {
  query: {
    formEvaluationId: string;
    farmerId: string;
  };
  body: {
    reason?: string;
    status?: StatusEvaluation;
    approveByUserId?: string;
    first_evaluator_name: string;
    first_evaluator_position: string;
    second_evaluator_name: string;
    second_evaluator_position: string;
    third_evaluator_name: string;
    third_evaluator_position: string;
  };
};
export type ResponseUpdateFormEvaluationService = FormEvaluation;
export async function UpdateFormEvaluationService(
  input: RequestUpdateFormEvaluationService,
): Promise<ResponseUpdateFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formEvaluation = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/update`,
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
  formEvaluation: FormEvaluation & {
    user: User;
    files: FileOnKos06[];
  };
} & {
  topics: (EvalTopicKos06 & {
    childs: (ChildEvalTopicKos06 & {
      listFormEvaluation:
        | (ListFormEvaluation & {
            fileOnListFormEvaluations: FileOnListFormEvaluation[];
          })
        | null;
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

type RequestCreateListFormEvaluationService = {
  status: StatusEvaluation;
  formEvaluationId: string;
  farmerId: string;
  childEvalTopicKos06Id: string;
  evalTopicKos06Id: string;
  suggestion: string;
};
export type ResponseCreateListFormEvaluationService = ListFormEvaluation;
export async function CreateListFormEvaluationService(
  input: RequestCreateListFormEvaluationService,
): Promise<ResponseCreateListFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const listFormEvaluation = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/list-evaluation/create`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return listFormEvaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestUpdateListFormEvaluationService = {
  query: {
    listFormEvaluationId: string;
  };
  body: {
    status: StatusEvaluation;
    suggestion: string;
  };
};
export type ResponseUpdateListFormEvaluationService = ListFormEvaluation;
export async function UpdateListFormEvaluationService(
  input: RequestUpdateListFormEvaluationService,
): Promise<ResponseUpdateListFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const listFormEvaluation = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/list-evaluation/update`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return listFormEvaluation.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestCreateFileOnListFormEvaluationService = {
  listFormEvaluationId: string;
  farmerId: string;
  type: string;
  url: string;
};
export type ResponseCreateFileOnListFormEvaluationService =
  FileOnListFormEvaluation;
export async function CreateFileOnListFormEvaluationService(
  input: RequestCreateFileOnListFormEvaluationService,
): Promise<ResponseCreateFileOnListFormEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const fileKos06 = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/create-fileOnListEvaluation`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return fileKos06.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestCreateFileOnEvaulationService = {
  formEvaluationId: string;
  farmerId: string;
  type: string;
  url: string;
};
export type ResponseCreateFileOnEvaulationService = FileOnKos06;
export async function CreateFileOnEvaulationService(
  input: RequestCreateFileOnEvaulationService,
): Promise<ResponseCreateFileOnEvaulationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const fileKos06 = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/create-fileFormEvaluation`,
      data: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return fileKos06.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestDeleteFileOnEvaluationService = {
  fileOnFormEvaluationId: string;
};
export type ResponseDeleteFileOnEvaluationService = { message: string };
export async function DeleteFileOnEvaluationService(
  input: RequestDeleteFileOnEvaluationService,
): Promise<ResponseDeleteFileOnEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const fileKos06 = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/delete-fileFormEvaluation`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return fileKos06.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

type RequestDeleteFileOnListEvaluationService = {
  fileOnListFormEvaluationId: string;
};
export type ResponseDeleteFileOnListEvaluationService = { message: string };
export async function DeleteFileOnListEvaluationService(
  input: RequestDeleteFileOnListEvaluationService,
): Promise<ResponseDeleteFileOnListEvaluationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const fileKos06 = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/evaluation/delete-fileOnListFormEvaluation`,
      params: {
        ...input,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return fileKos06.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
