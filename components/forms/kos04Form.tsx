import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos04Service } from "../../services/farmer";
import { GiWeight } from "react-icons/gi";
import moment from "moment";

type Kos04FormProps = {
  kos04: UseQueryResult<ResponseGetFarmerKos04Service, Error>;
};
function Kos04Form({ kos04 }: Kos04FormProps) {
  return (
    <main className="grid w-11/12 grid-cols-2 gap-5 rounded-lg  bg-fourth-color p-5 xl:grid-cols-3">
      {kos04.data?.factors.map((factor, index) => {
        const purchaseDate = moment(factor.purchaseDate)
          .locale("th")
          .format("DD/MM/YYYY");
        return (
          <section className="flex h-max w-full flex-col gap-3 rounded-lg bg-[#F1E4C3] p-5">
            <header className="flex items-center justify-between">
              <div className="rounded-lg bg-[#502D16] px-4 py-1 text-xl font-semibold text-white">
                ปัจจัยที่ {index + 1}
              </div>
            </header>
            <main className="flex flex-col items-center justify-center gap-2">
              <h1 className="max-w-80 truncate text-2xl font-semibold text-[#502D16] ">
                {factor.prodFactorTypes}
              </h1>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-lg text-super-main-color">
                  <div className="flex items-center justify-center rounded-full bg-super-main-color p-1 text-white">
                    <GiWeight />
                  </div>
                  {factor.amount.toLocaleString()} กิโลกรัม
                </div>
                <span className="text-base text-super-main-color">
                  {purchaseDate}
                </span>
              </div>
              <span className="mt-4 text-lg font-semibold text-super-main-color">
                <span className="text-black">แหล่งที่มา :</span> {factor.source}
              </span>
            </main>
          </section>
        );
      })}
    </main>
  );
}

export default Kos04Form;
