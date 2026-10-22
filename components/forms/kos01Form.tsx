import { UseQueryResult } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ResponseGetFarmerKos01Service } from "../../services/farmer";
import moment from "moment";
import { LuMapPin } from "react-icons/lu";
import MapDisplay from "../cards/mapDisplay";
import PlantCard from "../cards/plantCard";

type Kos01FormProps = {
  kos01: UseQueryResult<ResponseGetFarmerKos01Service, Error>;
};

function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0">
      <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
        <span aria-hidden="true" className="h-4 w-1 rounded-full bg-fifth-color" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
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
      <dt className="text-xs font-medium text-super-main-color/70">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium">{children}</dd>
    </div>
  );
}

const fieldGrid = "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3";
const isBlank = (value: unknown) =>
  value === undefined || value === null || value === "";
const show = (value?: ReactNode) => (isBlank(value) ? "-" : value);
const area = (rai?: number, ngan?: number) =>
  isBlank(rai) && isBlank(ngan) ? "-" : `${rai ?? 0} ไร่ ${ngan ?? 0} งาน`;
const plots = (total?: number) => (isBlank(total) ? "-" : `${total} แปลง`);

function Kos01Form({ kos01 }: Kos01FormProps) {
  const [triggerMap, setTriggerMap] = useState(false);
  const farm = kos01.data?.farmKos1;
  const plants = kos01.data?.plantKOS1s ?? [];

  return (
    <div className="flex flex-col divide-y divide-third-color">
      {triggerMap && <MapDisplay kos01={kos01} setTriggerMap={setTriggerMap} />}

      <DocSection title="ข้อมูลพื้นฐาน">
        <dl className={fieldGrid}>
          <Field label="ที่อยู่เลขที่">{show(kos01.data?.address)}</Field>
          <Field label="หมู่ที่">{show(kos01.data?.villageNumber)}</Field>
          <Field label="ตำบล">{show(kos01.data?.subdistrict)}</Field>
          <Field label="อำเภอ">{show(kos01.data?.district)}</Field>
          <Field label="จังหวัด">{show(kos01.data?.province)}</Field>
        </dl>
      </DocSection>

      <DocSection title="ที่ตั้งสถานที่ผลิตพืชอินทรีย์">
        <dl className={fieldGrid}>
          <Field label="ที่อยู่เลขที่">{show(farm?.address)}</Field>
          <Field label="หมู่ที่">{show(farm?.villageNumber)}</Field>
          <Field label="ตำบล">{show(farm?.subdistrict)}</Field>
          <Field label="อำเภอ">{show(farm?.district)}</Field>
          <Field label="จังหวัด">{show(farm?.province)}</Field>
        </dl>
      </DocSection>

      <DocSection title="กระบวนการผลิต">
        <dl className={fieldGrid}>
          <Field label="วันที่ยื่นขอการรับรอง">
            {farm?.certRequestDate
              ? moment(farm.certRequestDate).locale("th").format("D MMM YYYY")
              : "-"}
          </Field>
          <Field label="กระบวนการผลิต">
            {show(
              Array.isArray(farm?.productionProcess)
                ? farm?.productionProcess.join(", ")
                : farm?.productionProcess,
            )}
          </Field>
          <Field label="วิธีการผลิต">{show(farm?.productionMethod)}</Field>
          <Field label="พิกัดแปลง" className="sm:col-span-2 lg:col-span-3">
            {farm?.latitude && farm?.longitude ? (
              <button
                type="button"
                onClick={() => setTriggerMap(true)}
                aria-label={`ดูแผนที่พิกัดแปลง ${farm.latitude}, ${farm.longitude}`}
                className="mt-1 inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg border border-third-color bg-white px-3 py-2 text-left
                  font-semibold text-main-color transition hover:bg-fourth-color
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
              >
                <LuMapPin aria-hidden="true" className="size-4 shrink-0" />
                <span className="break-all tabular-nums">
                  {farm.latitude}, {farm.longitude}
                </span>
              </button>
            ) : (
              "-"
            )}
          </Field>
        </dl>
      </DocSection>

      <DocSection title="ชนิดพืชที่ขอการรับรอง">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
          <Field label="จำนวนแปลงทั้งหมด">{plots(farm?.plotsTotal)}</Field>
          <Field label="พื้นที่">{area(farm?.raiTotal, farm?.nganTotal)}</Field>
          <Field label="จำนวนแปลงที่ขอรับรอง KOS">
            {plots(farm?.certicatedPlotTotal)}
          </Field>
          <Field label="พื้นที่ที่ขอรับรอง">
            {area(farm?.certicatedRaiTotal, farm?.certicatedNganTotal)}
          </Field>
        </dl>
        {plants.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {plants.map((plant, index) => {
              return <PlantCard key={plant.id} index={index} plant={plant} />;
            })}
          </ul>
        ) : (
          <p className="text-sm text-super-main-color/80">ยังไม่มีข้อมูลชนิดพืช</p>
        )}
      </DocSection>
    </div>
  );
}

export default Kos01Form;
