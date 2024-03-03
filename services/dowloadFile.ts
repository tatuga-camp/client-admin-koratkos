import axios from "axios";
import { parseCookies } from "nookies";

type RequestDowloadHTMLService = {
  farmerId: string;
  access_token: string;
};
export async function DowloadHTMLService(input: RequestDowloadHTMLService) {
  try {
    const urlPDF = await axios<string>({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/file-generate/download-html/report`,
      params: {
        ...input,
      },
      responseType: "json",
      headers: {
        Authorization: `Bearer ${input.access_token}`,
      },
    });

    return urlPDF.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}
