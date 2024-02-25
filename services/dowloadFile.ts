import axios from "axios";
import { parseCookies } from "nookies";

type RequestDowloadPDFService = {
  farmerId: string;
};
export async function DowloadPDFService(input: RequestDowloadPDFService) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const urlPDF = await axios<string>({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/file-generate/download-pdf`,
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        downloadFile(urlPDF.data, "file.pdf");
        resolve();
      }, 5000);
    });
  } catch (error: any) {
    console.error(error.response.data);
    throw error?.response?.data;
  }
}

// Function to trigger the file download
function downloadFile(url: string, fileName: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.target = "_blank";
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
