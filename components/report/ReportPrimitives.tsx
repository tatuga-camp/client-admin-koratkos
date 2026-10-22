import React, { ReactNode } from "react";
import { Farmer } from "../../model";
import { formatIdCard } from "./reportFormat";

const SCHEME_NAME = "มาตรฐานเกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา";

type ReportSheetProps = {
  code: string;
  title: string;
  farmer: Farmer;
  children: ReactNode;
};

/**
 * One KOS document. On screen it is an A4-sized sheet; in print the sheet
 * chrome is removed (see the report page's print CSS) and @page sets the paper.
 */
export function ReportSheet({ code, title, farmer, children }: ReportSheetProps) {
  return (
    <article
      aria-label={`${code} ${title}`}
      className="report-sheet mx-auto w-full max-w-[210mm] bg-white p-5 shadow-md shadow-super-main-color/10 sm:min-h-[297mm] sm:px-[14mm] sm:py-[16mm]"
    >
      <header>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Plain <img>: next/image lazy-loads, which can leave it blank in print. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ks_logo_photo.png" alt="" width={44} height={44} className="size-11" />
            <div className="leading-tight">
              <p className="text-[11pt] font-bold text-main-color">
                Korat Organic Standard (KOS)
              </p>
              <p className="text-[8.5pt] text-super-main-color/80">{SCHEME_NAME}</p>
            </div>
          </div>
          <p className="shrink-0 rounded border-2 border-super-main-color px-3 py-1 text-[11pt] font-bold tracking-wide">
            {code}
          </p>
        </div>
        <div className="mt-3 h-[2px] bg-main-color" />
        <h1 className="mt-4 text-balance text-center text-[14pt] font-bold leading-snug">
          {title}
        </h1>
        <dl className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 rounded border border-super-main-color/20 bg-fourth-color px-3 py-2 text-[9pt]">
          <div className="flex gap-2">
            <dt className="text-super-main-color/70">ผู้ขอการรับรอง</dt>
            <dd className="font-semibold">
              {farmer.title} {farmer.firstName} {farmer.lastName}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-super-main-color/70">เลขประจำตัวประชาชน</dt>
            <dd className="font-semibold tabular-nums">{formatIdCard(farmer.identityCardId)}</dd>
          </div>
        </dl>
      </header>
      <div className="report-body mt-6 flex flex-col gap-6 text-[10pt] leading-relaxed">{children}</div>
    </article>
  );
}

export function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="report-section">
      <h2 className="mb-2 border-b border-super-main-color/20 pb-1 text-[11pt] font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FieldGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  // The printed A4 content area (~690px) is wider than `sm`, so print gets these columns too.
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[columns];
  return <dl className={`grid grid-cols-1 gap-x-6 gap-y-2.5 ${cols}`}>{children}</dl>;
}

export function Field({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`min-w-0 ${wide ? "col-span-full" : ""}`}>
      <dt className="text-[8.5pt] text-super-main-color/70">{label}</dt>
      <dd className="break-words font-medium">{value}</dd>
    </div>
  );
}

/** Bordered, formal table; header rows repeat on each printed page. */
export function ReportTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="report-table w-full border-collapse text-[9pt]">
        <thead className="bg-third-color/70">{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const th =
  "border border-super-main-color/30 px-2 py-1.5 text-center align-middle font-semibold";
export const td = "border border-super-main-color/30 px-2 py-1.5 align-top";

export function ReportImages({ urls, label }: { urls: string[]; label: string }) {
  if (urls.length === 0) return <EmptyNote>ไม่มีรูปภาพ</EmptyNote>;
  return (
    <div className="grid grid-cols-2 gap-3">
      {urls.map((url, index) => (
        <figure key={url} className="report-figure m-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`${label} ${index + 1}`}
            loading="eager"
            className="aspect-[4/3] w-full rounded border border-super-main-color/20 bg-fourth-color object-contain print:aspect-auto print:h-[52mm]"
          />
        </figure>
      ))}
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-dashed border-super-main-color/30 px-3 py-4 text-center text-[9pt] text-super-main-color/70">
      {children}
    </p>
  );
}

const hasText = (value?: string) => !!value && value.trim() !== "";

/** Signature line with the printed name and position underneath. */
export function SignatureBlock({ name, role }: { name?: string; role?: string }) {
  return (
    <div className="report-signature flex w-full flex-col items-center gap-1 text-center text-[9.5pt]">
      <div className="flex w-full max-w-[56mm] items-end gap-2">
        <span>ลงชื่อ</span>
        <span className="h-9 flex-1 border-b border-dotted border-super-main-color" />
      </div>
      {/* Non-breaking spaces keep the blank brackets wide enough to write in. */}
      <p>({hasText(name) ? name : " ".repeat(40)})</p>
      <p className="text-super-main-color/80">
        {hasText(role) ? role : "ตำแหน่ง ................................"}
      </p>
    </div>
  );
}
