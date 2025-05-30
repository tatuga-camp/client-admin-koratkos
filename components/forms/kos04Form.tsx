import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos04Service } from "../../services/farmer";
import { GiWeight } from "react-icons/gi";
import moment from "moment";
import { Input, Label, TextField } from "react-aria-components";
import { Calendar } from "primereact/calendar";
import TypeAmountCombox from "../combox/typeAmountCombox";

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
          <section
            key={index}
            className="flex h-max w-full flex-col gap-3 rounded-lg  p-2 ring-1 ring-black"
          >
            <header className="flex items-center justify-between">
              <div className="rounded-lg bg-[#502D16] px-4 py-1 text-xl font-semibold text-white">
                ปัจจัยที่ {index + 1}
              </div>
            </header>
            <Label className="mt-10 w-80 rounded-lg bg-third-color  py-2 text-center text-lg font-bold text-black">
              ปัจจัยการผลิต - {factor.prodFactorTypes}
            </Label>

            <TextField className="flex w-80 flex-col  items-start justify-start gap-2 ">
              <Label className="w-max text-xl font-semibold text-super-main-color">
                วันที่(ที่ซื้อ/ได้มา) :
              </Label>
              <Calendar
                className="w-full"
                dateFormat="dd/MM/yy"
                disabled
                value={
                  factor?.purchaseDate ? new Date(factor?.purchaseDate) : null
                }
                locale="th"
              />
            </TextField>
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                ชนิดของปัจจัย :
              </Label>
              <Input
                disabled
                name="prodFactorTypes"
                value={factor?.prodFactorTypes}
                type="text"
                className="w-full rounded-lg p-3 ring-1 ring-gray-300"
              />
            </TextField>
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                ปริมาณ :
              </Label>
              <div className="flex w-full items-start justify-center gap-2">
                <Input
                  disabled
                  name="amount"
                  value={factor?.amount}
                  type="number"
                  inputMode="numeric"
                  className="h-12 w-full rounded-lg p-3 ring-1 ring-gray-300"
                />
                <TypeAmountCombox factor={factor} />
              </div>
            </TextField>
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                แหล่งที่มา :
              </Label>
              <Input
                disabled
                name="source"
                value={factor?.source}
                type="text"
                className="w-full rounded-lg p-3 ring-1 ring-gray-300"
              />
            </TextField>
          </section>
        );
      })}
    </main>
  );
}

export default Kos04Form;
