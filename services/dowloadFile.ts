import axios from "axios";
import { parseCookies } from "nookies";

type RequestDowloadPDFService = {
  farmerId: string;
};
export async function DowloadPDFService(input: RequestDowloadPDFService) {
  const cookies = parseCookies();
  const access_token = cookies.access_token;
  const formEvaluations = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/file-generate/download-pdf`,
    params: {
      ...input,
    },
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => {
      downloadFile(response.data, "download.pdf", "application/pdf");
    })
    .catch(async (error) => {
      // Check if the error response is a blob and its type is 'application/json'
      if (
        error.response?.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        try {
          // Convert the blob to text
          const errorText = await error.response.data.text();
          // Parse the text as JSON
          const errorJson = JSON.parse(errorText);
          // Log the error message
          console.error(errorJson);
          // You might want to throw a more readable error or the parsed JSON
          throw errorJson;
        } catch (parseError: any) {
          // If there's an error parsing the blob as text or parsing the text as JSON
          console.error("Error parsing error response:", parseError);
          // Throw the original error or a custom error message
          throw parseError;
        }
      } else {
        // If the response is not a blob or not 'application/json', log the original error
        console.error(error.response?.data || error);
        // Throw the original error or a custom error message
        throw error?.response?.data || new Error("An unknown error occurred.");
      }
    });
}

// Function to trigger the file download
function downloadFile(data: Blob, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
