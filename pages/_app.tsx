import "@/styles/globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { PrimeReactProvider, addLocale } from "primereact/api";
import NextTopLoader from "nextjs-toploader";
import "moment/locale/th";
import type { AppProps } from "next/app";
import "moment/locale/th";
import { useRouter } from "next/router";
import AuthLayout from "@/layouts/authLayout";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60, // 1 hour in ms
            refetchOnWindowFocus: false, // Disables automatic refetching when browser window is focused.
          },
        },
      }),
  );
  addLocale("th", {
    firstDayOfWeek: 1,
    dayNames: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
    dayNamesMin: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
    monthNames: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    monthNamesShort: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    today: "วันนี้",
    clear: "ล้าง",
  });

  const router = useRouter();
  const pageAuth = ['/auth/sign-up', '/auth/sign-in','/auth/forget-password'];
  const useLayout = pageAuth.includes(router.pathname);


  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <PrimeReactProvider>
        <NextTopLoader color="#5C430D" showSpinner={false} />
        {useLayout ? (
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        ) : (
          <Component {...pageProps} />
        )}
        
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}
