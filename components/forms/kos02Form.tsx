import { UseQueryResult } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { ResponseGetFarmerKos02Service } from "../../services/farmer";
import Image from "next/image";
import moment from "moment";
import { backgroundImageBase64 } from "../../data/base64Images";

type Kos02FormProps = {
  kos02: UseQueryResult<ResponseGetFarmerKos02Service, Error>;
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
      <span aria-hidden="true" className="h-4 w-1 rounded-full bg-fifth-color" />
      {children}
    </h3>
  );
}

function Item({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-xs text-super-main-color/70">{label}</dt>
      <dd className="break-words font-medium">{children}</dd>
    </div>
  );
}

function Kos02Form({ kos02 }: Kos02FormProps) {
  const files = kos02.data?.files ?? [];
  const plans = kos02.data?.orgCropProdCalForKos2s ?? [];

  return (
    <div className="flex flex-col divide-y divide-third-color">
      <section className="flex flex-col gap-4 pb-5">
        <SectionTitle>แผนผังแปลง</SectionTitle>
        {files.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => {
              return (
                <li key={file.id ?? index}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-lg border border-third-color bg-third-color
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color focus-visible:ring-offset-2"
                  >
                    <Image
                      fill
                      src={file.url}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      blurDataURL={backgroundImageBase64}
                      placeholder="blur"
                      className="object-cover transition group-hover:opacity-90"
                      alt={`แผนผังแปลง ภาพที่ ${index + 1} (เปิดในแท็บใหม่)`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-super-main-color/80">ยังไม่มีแผนผังแปลง</p>
        )}
      </section>

      <section className="flex flex-col gap-4 pt-5">
        <SectionTitle>แผนการผลิตพืชอินทรีย์</SectionTitle>
        {plans.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((orgCropProd) => {
              const rangeDate = orgCropProd.rangeDate
                .map((time) => moment(time).locale("th").format("MMMM"))
                .join(", ");
              const yearPlan = moment(orgCropProd.yearPlan).format("YYYY");
              return (
                <li
                  key={orgCropProd.id}
                  className="flex flex-col gap-3 rounded-lg border border-third-color bg-fourth-color/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-base font-semibold">
                      แปลงที่ {orgCropProd.plotNumber}
                    </h4>
                    <span className="rounded-full bg-third-color px-2.5 py-0.5 text-xs font-semibold">
                      ประจำปีการผลิต {yearPlan}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <Item label="ชนิดพืช" className="col-span-2">
                      <span className="text-base font-semibold">
                        {orgCropProd.plantType}
                      </span>
                    </Item>
                    <Item label="แหล่งที่มา">{orgCropProd.source || "-"}</Item>
                    <Item label="เมล็ด">{orgCropProd.seed || "-"}</Item>
                    <Item label="พื้นที่">{orgCropProd.landArea} ไร่</Item>
                    <Item label="ผลผลิต">
                      {orgCropProd.yieldPerRai?.toLocaleString() ?? "-"} กก./ไร่
                    </Item>
                    <Item label="เดือน" className="col-span-2">
                      {rangeDate || "-"}
                    </Item>
                  </dl>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-super-main-color/80">
            ยังไม่มีแผนการผลิตพืชอินทรีย์
          </p>
        )}
      </section>
    </div>
  );
}

export default Kos02Form;
