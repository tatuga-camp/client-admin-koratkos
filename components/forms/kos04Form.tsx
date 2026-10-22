import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos04Service } from "../../services/farmer";
import moment from "moment";
import { LuInbox } from "react-icons/lu";

type Kos04FormProps = {
  kos04: UseQueryResult<ResponseGetFarmerKos04Service, Error>;
};

const formatDate = (date?: string) =>
  date ? moment(date).locale("th").format("D MMM YYYY") : "-";

function Kos04Form({ kos04 }: Kos04FormProps) {
  const factors = kos04.data?.factors ?? [];

  if (factors.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <LuInbox aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ยังไม่มีบันทึกปัจจัยการผลิต</p>
      </div>
    );
  }

  return (
    <>
      {/* Tablet and desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-third-color md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-third-color bg-fourth-color/70 text-xs font-semibold text-super-main-color/80">
            <tr>
              <th scope="col" className="px-4 py-3">ปัจจัยที่</th>
              <th scope="col" className="px-3 py-3">ชนิดของปัจจัย</th>
              <th scope="col" className="px-3 py-3">วันที่(ที่ซื้อ/ได้มา)</th>
              <th scope="col" className="px-3 py-3 text-right">ปริมาณ</th>
              <th scope="col" className="px-4 py-3">แหล่งที่มา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-third-color">
            {factors.map((factor, index) => (
              <tr key={factor.id ?? index} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">{index + 1}</td>
                <td className="break-words px-3 py-3 font-semibold">
                  {factor.prodFactorTypes || "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                  {formatDate(factor.purchaseDate)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                  {factor.amount?.toLocaleString() ?? "-"} {factor.typeAmount}
                </td>
                <td className="break-words px-4 py-3">{factor.source || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="flex flex-col gap-3 md:hidden">
        {factors.map((factor, index) => (
          <li
            key={factor.id ?? index}
            className="rounded-lg border border-third-color bg-fourth-color/60 p-4"
          >
            <p className="text-xs font-medium text-super-main-color/70">
              ปัจจัยที่ {index + 1}
            </p>
            <h4 className="break-words font-semibold">
              {factor.prodFactorTypes || "-"}
            </h4>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-super-main-color/70">วันที่(ที่ซื้อ/ได้มา)</dt>
                <dd className="font-medium">{formatDate(factor.purchaseDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-super-main-color/70">ปริมาณ</dt>
                <dd className="font-medium">
                  {factor.amount?.toLocaleString() ?? "-"} {factor.typeAmount}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-super-main-color/70">แหล่งที่มา</dt>
                <dd className="break-words font-medium">{factor.source || "-"}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Kos04Form;
