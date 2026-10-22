import { useQueries, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  LuArrowLeft,
  LuFileWarning,
  LuLoader2,
  LuPrinter,
  LuRefreshCw,
} from "react-icons/lu";
import {
  Kos01Report,
  Kos02Report,
  Kos03Report,
  Kos04Report,
  Kos05Report,
} from "../../../components/report/KosDocumentReports";
import Kos06Report from "../../../components/report/Kos06Report";
import { formatThaiDate } from "../../../components/report/reportFormat";
import {
  GetFormEvaluationService,
  GetFormEvaluationsService,
} from "../../../services/evaluation";
import {
  GetFarmerKos01Service,
  GetFarmerKos02Service,
  GetFarmerKos03Service,
  GetFarmerKos04Service,
  GetFarmerKos05Service,
  GetFarmerService,
} from "../../../services/farmer";

type ApiError = { statusCode?: number; message?: string } | null;

/** A KOS document the farmer hasn't filled in comes back as 404; that is not a failure. */
const isMissing = (error: unknown) => (error as ApiError)?.statusCode === 404;

/** Quotes or backslashes would break the CSS string used in the page footer. */
const cssText = (value: string) => value.replace(/["\\\n\r]/g, " ");

const printCss = (footerLabel: string, fontFamily: string) => `
@page {
  size: A4;
  margin: 16mm 14mm 18mm;
  @bottom-left {
    content: "${cssText(footerLabel)}";
    font-family: ${fontFamily};
    font-size: 8pt;
    color: #7d6a45;
  }
  @bottom-right {
    content: "หน้า " counter(page) " จาก " counter(pages);
    font-family: ${fontFamily};
    font-size: 8pt;
    color: #7d6a45;
  }
}
@media print {
  html, body { background: #fff !important; }
  .report-root {
    background: none !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .report-toolbar, .tsqd-parent-container { display: none !important; }
  .report-stack { gap: 0 !important; padding: 0 !important; }
  .report-sheet {
    max-width: none !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    break-after: page;
  }
  .report-sheet:last-child { break-after: auto; }
  .report-body { gap: 4.5mm !important; }
  .report-table thead { display: table-header-group; }
  .report-table tr, .report-figure, .report-signoff { break-inside: avoid; }
  .report-topic-row, .report-section > h2 { break-after: avoid; }
}
`;

function Report() {
  const router = useRouter();
  const farmerId = router.query.farmerId as string | undefined;
  const enabled = !!farmerId;
  const [preparing, setPreparing] = useState(false);
  const [fontFamily, setFontFamily] = useState("sans-serif");

  // @page footers can't read CSS variables, so pass the resolved font in.
  useEffect(() => {
    setFontFamily(getComputedStyle(document.body).fontFamily);
  }, []);

  // Same query keys as the farmer page, so already-loaded data is reused.
  const farmer = useQuery({
    queryKey: ["farmer", farmerId],
    queryFn: () => GetFarmerService({ farmerId: farmerId as string }),
    enabled,
  });
  const docOptions = { enabled, retry: (count: number, error: unknown) => !isMissing(error) && count < 2 };
  const kos01 = useQuery({
    queryKey: ["kos01", farmerId],
    queryFn: () => GetFarmerKos01Service({ farmerId: farmerId as string }),
    ...docOptions,
  });
  const kos02 = useQuery({
    queryKey: ["kos02", farmerId],
    queryFn: () => GetFarmerKos02Service({ farmerId: farmerId as string }),
    ...docOptions,
  });
  const kos03 = useQuery({
    queryKey: ["kos03", farmerId],
    queryFn: () => GetFarmerKos03Service({ farmerId: farmerId as string }),
    ...docOptions,
  });
  const kos04 = useQuery({
    queryKey: ["kos04", farmerId],
    queryFn: () => GetFarmerKos04Service({ farmerId: farmerId as string }),
    ...docOptions,
  });
  const kos05 = useQuery({
    queryKey: ["kos05", farmerId],
    queryFn: () => GetFarmerKos05Service({ farmerId: farmerId as string }),
    ...docOptions,
  });
  const rounds = useQuery({
    queryKey: ["formEvaluations", farmerId],
    queryFn: () => GetFormEvaluationsService({ farmerId: farmerId as string }),
    enabled,
  });
  const roundDetails = useQueries({
    queries: (rounds.data ?? [])
      .filter((round) => round.id)
      .map((round) => ({
        queryKey: ["formEvaluation", round.id],
        queryFn: () =>
          GetFormEvaluationService({
            formEvaluationId: round.id as string,
            farmerId: farmerId as string,
          }),
      })),
  });

  const docQueries = [kos01, kos02, kos03, kos04, kos05];
  const loading =
    !enabled ||
    farmer.isLoading ||
    rounds.isLoading ||
    docQueries.some((query) => query.isLoading) ||
    roundDetails.some((query) => query.isLoading);
  const failure =
    (farmer.error as ApiError) ??
    (rounds.error as ApiError) ??
    (docQueries.find((query) => query.error && !isMissing(query.error))?.error as ApiError) ??
    (roundDetails.find((query) => query.error)?.error as ApiError) ??
    null;
  const hasEvaluations = (rounds.data?.length ?? 0) > 0;
  const ready = !loading && !failure && !!farmer.data && hasEvaluations;

  const farmerName = farmer.data
    ? `${farmer.data.title} ${farmer.data.firstName} ${farmer.data.lastName}`
    : "";
  const printedOn = formatThaiDate(new Date());

  const handlePrint = async () => {
    setPreparing(true);
    // Wait for photos and the web font, otherwise they can be blank in the PDF.
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".report-root img"));
    await Promise.all(
      images.map((image) =>
        image.complete
          ? null
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
      ),
    );
    await document.fonts?.ready;
    setPreparing(false);
    window.print();
  };

  const retry = () => {
    [farmer, rounds, ...docQueries, ...roundDetails].forEach((query) => {
      if (query.isError) query.refetch();
    });
  };

  return (
    <div className="report-root min-h-screen bg-third-color/50 font-Anuphan text-super-main-color">
      <Head>
        {/* Chrome uses the title as the suggested PDF file name. */}
        <title>{farmerName ? `รายงาน KOS ${farmerName} ${printedOn}` : "รายงานเอกสาร KOS"}</title>
      </Head>
      <style dangerouslySetInnerHTML={{ __html: printCss(`รายงานเอกสาร KOS  ${farmerName}  พิมพ์เมื่อ ${printedOn}`, fontFamily) }} />

      <header className="report-toolbar sticky top-0 z-10 border-b border-third-color bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[230mm] flex-wrap items-center gap-3 px-4 py-3">
          <Link
            href={farmerId ? `/farmer/${farmerId}` : "/"}
            className="btn btn-ghost btn-sm -ml-2"
          >
            <LuArrowLeft aria-hidden="true" className="size-4" />
            กลับไปหน้าเกษตรกร
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">รายงานเอกสาร KOS</p>
            {farmerName && (
              <p className="truncate text-sm text-super-main-color/80">{farmerName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!ready || preparing}
            className="btn btn-primary w-full sm:w-auto"
          >
            {preparing ? (
              <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
            ) : (
              <LuPrinter aria-hidden="true" className="size-4" />
            )}
            {preparing ? "กำลังเตรียมเอกสาร" : "พิมพ์ / บันทึกเป็น PDF"}
          </button>
        </div>
        {ready && (
          <p className="mx-auto max-w-[230mm] px-4 pb-2 text-xs text-super-main-color/70">
            ในหน้าต่างพิมพ์ เลือกปลายทาง “บันทึกเป็น PDF” และขนาดกระดาษ A4
          </p>
        )}
      </header>

      {failure ? (
        <div className="flex justify-center px-4 py-16">
          <div className="card flex w-full max-w-md flex-col items-center gap-3 px-6 py-10 text-center">
            <LuFileWarning aria-hidden="true" className="size-10 text-fifth-color" />
            <h1 className="text-xl font-bold">โหลดข้อมูลรายงานไม่สำเร็จ</h1>
            {failure.message && (
              <p className="break-words text-sm text-super-main-color/80">{failure.message}</p>
            )}
            <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button type="button" onClick={retry} className="btn btn-secondary">
                <LuRefreshCw aria-hidden="true" className="size-4" />
                ลองอีกครั้ง
              </button>
              {failure.statusCode === 401 && (
                <Link href="/auth/sign-in" className="btn btn-dark">
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="report-stack flex flex-col gap-6 px-3 py-6 sm:px-6" aria-busy="true">
          <div className="mx-auto flex w-full max-w-[210mm] flex-col gap-4 bg-white p-[14mm] shadow-md sm:min-h-[297mm]">
            <div className="h-10 w-2/3 animate-pulse rounded bg-third-color" />
            <div className="h-6 w-1/2 animate-pulse self-center rounded bg-third-color/70" />
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-4 w-full animate-pulse rounded bg-third-color/60" />
            ))}
          </div>
          <p className="sr-only" role="status">กำลังโหลดข้อมูลรายงาน</p>
        </div>
      ) : !hasEvaluations ? (
        <div className="flex justify-center px-4 py-16">
          <div className="card flex w-full max-w-md flex-col items-center gap-3 px-6 py-10 text-center">
            <LuFileWarning aria-hidden="true" className="size-10 text-fifth-color" />
            <h1 className="text-xl font-bold">ยังพิมพ์รายงานไม่ได้</h1>
            <p className="text-sm text-super-main-color/80">
              รายงานจะพิมพ์ได้หลังจากเริ่มการประเมิน KOS-06 อย่างน้อย 1 ครั้ง
            </p>
          </div>
        </div>
      ) : (
        farmer.data && (
          <main className="report-stack flex flex-col gap-6 px-3 py-6 sm:px-6">
            <Kos01Report farmer={farmer.data} doc={kos01.data} />
            <Kos02Report farmer={farmer.data} doc={kos02.data} kos1={kos01.data} />
            <Kos03Report farmer={farmer.data} doc={kos03.data} />
            <Kos04Report farmer={farmer.data} doc={kos04.data} />
            <Kos05Report farmer={farmer.data} doc={kos05.data} />
            <Kos06Report
              farmer={farmer.data}
              evaluations={roundDetails.flatMap((query) => (query.data ? [query.data] : []))}
            />
          </main>
        )
      )}
    </div>
  );
}

export default Report;
