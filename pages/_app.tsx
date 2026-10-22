import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import NextTopLoader from "nextjs-toploader";
import "moment/locale/th";
import type { AppProps } from "next/app";
import { Anuphan } from "next/font/google";

// Self-hosted at build time; exposed as a CSS variable on :root so overlays
// rendered outside the React tree (SweetAlert2, dialogs) get it too.
const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  display: "swap",
  // next/font has no fallback metrics for Anuphan; skip the adjustment instead of warning.
  adjustFontFallback: false,
});

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

  return (
    <QueryClientProvider client={queryClient}>
      <style jsx global>{`
        :root {
          --font-anuphan: ${anuphan.style.fontFamily};
        }
      `}</style>
      <ReactQueryDevtools initialIsOpen={false} />
      <NextTopLoader color="#597E52" showSpinner={false} />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
