import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import { LuInbox } from "react-icons/lu";
import { ResponseGetFarmerKos05Service } from "../../services/farmer";
type Kos05FormProps = {
  kos05: UseQueryResult<ResponseGetFarmerKos05Service, Error>;
};

const formatDate = (date?: string) =>
  date ? moment(date).locale("th").format("D MMM YYYY") : "-";

function Kos05Form({ kos05 }: Kos05FormProps) {
  const harvests = kos05.data?.harvests ?? [];

  if (harvests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <LuInbox aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ยังไม่มีบันทึกการเก็บเกี่ยว</p>
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
              <th scope="col" className="px-4 py-3">แปลงที่</th>
              <th scope="col" className="px-3 py-3">วันที่เก็บเกี่ยว</th>
              <th scope="col" className="px-3 py-3">ชนิดพืชที่เก็บเกี่ยว</th>
              <th scope="col" className="px-3 py-3 text-right">ปริมาณ</th>
              <th scope="col" className="px-4 py-3">การตลาด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-third-color">
            {harvests.map((harvestLog, index) => (
              <tr key={harvestLog.id ?? index} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                  {harvestLog.plotNumber}
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                  {formatDate(harvestLog.harvestDate)}
                </td>
                <td className="break-words px-3 py-3 font-semibold">
                  {harvestLog.plantType || "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                  {harvestLog.amount?.toLocaleString() ?? "-"} {harvestLog.typeAmount}
                </td>
                <td className="break-words px-4 py-3">{harvestLog.marketing || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="flex flex-col gap-3 md:hidden">
        {harvests.map((harvestLog, index) => (
          <li
            key={harvestLog.id ?? index}
            className="rounded-lg border border-third-color bg-fourth-color/60 p-4"
          >
            <p className="text-xs font-medium text-super-main-color/70">
              แปลงที่ {harvestLog.plotNumber}
            </p>
            <h4 className="break-words font-semibold">
              {harvestLog.plantType || "-"}
            </h4>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-super-main-color/70">วันที่เก็บเกี่ยว</dt>
                <dd className="font-medium">{formatDate(harvestLog.harvestDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-super-main-color/70">ปริมาณ</dt>
                <dd className="font-medium">
                  {harvestLog.amount?.toLocaleString() ?? "-"} {harvestLog.typeAmount}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-super-main-color/70">การตลาด</dt>
                <dd className="break-words font-medium">
                  {harvestLog.marketing || "-"}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Kos05Form;
