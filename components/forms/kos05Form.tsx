import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos05Service } from "../../services/farmer";
import { GiWeight } from "react-icons/gi";
import moment from "moment";
type Kos05FormProps = {
  kos05: UseQueryResult<ResponseGetFarmerKos05Service, Error>;
};
function Kos05Form({ kos05 }: Kos05FormProps) {
  return (
    <main className="grid h-full w-11/12 grid-cols-2 gap-5 rounded-lg bg-fourth-color p-5 xl:grid-cols-3">
      {kos05.data?.harvests.map((harvestLog, index) => {
        const harvestDate = moment(harvestLog.harvestDate)
          .locale("th")
          .format("DD/MM/YYYY");
        return (
          <section className="flex h-max w-full flex-col gap-3 rounded-lg bg-[#F1E4C3] p-5">
            <header className="flex items-center justify-between">
              <div className="rounded-lg bg-[#502D16] px-4 py-1 text-xl font-semibold text-white">
                แปลงที่ {harvestLog.plotNumber}
              </div>
            </header>
            <main className="flex h-max w-full flex-col items-center justify-center gap-2">
              <h1 className="max-w-80 truncate text-2xl font-semibold text-[#502D16] ">
                {harvestLog.plantType}
              </h1>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-lg text-super-main-color">
                  <div className="flex items-center justify-center rounded-full bg-super-main-color p-1 text-white">
                    <GiWeight />
                  </div>
                  {harvestLog.amount.toLocaleString()} กิโลกรัม
                </div>
                <span className="text-base text-super-main-color">
                  {harvestDate}
                </span>
              </div>
            </main>
            <p className="mt-4 h-max w-full break-words font-semibold  text-super-main-color ">
              <span className="text-black">แหล่งจำหน่าย :</span>
              <span>{harvestLog.marketing}</span>
            </p>
          </section>
        );
      })}
    </main>
  );
}

export default Kos05Form;
