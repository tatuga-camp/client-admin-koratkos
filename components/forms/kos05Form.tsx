import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Input, Label, TextField } from "react-aria-components";
import { ResponseGetFarmerKos05Service } from "../../services/farmer";
import PlantCombox from "../combox/plantCombox";
import TypeAmountCombox from "../combox/typeAmountCombox";
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
          <section
            key={index}
            className="flex h-max w-full flex-col gap-3 rounded-lg  p-2 ring-1 ring-black"
          >
            <header className="flex items-center justify-between">
              <div className="rounded-lg bg-[#502D16] px-4 py-1 text-xl font-semibold text-white">
                แปลงที่ {harvestLog.plotNumber}
              </div>
            </header>
            <Label className="mt-10 w-80 rounded-lg bg-third-color  py-2 text-center text-lg font-bold text-black">
              เพิ่มบันทึกการเก็บเกี่ยว
            </Label>
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                แปลงที่ :
              </Label>
              <Input
                required
                type="number"
                name="plotNumber"
                value={harvestLog?.plotNumber}
                inputMode="numeric"
                className="w-full rounded-lg p-3 ring-1 ring-gray-300"
              />
            </TextField>
            <TextField className="flex w-80 flex-col  items-start justify-start gap-2 ">
              <Label className="w-max text-xl font-semibold text-super-main-color">
                วันที่เก็บเกี่ยว :
              </Label>
              <Calendar
                required
                className="w-full"
                dateFormat="dd/MM/yy"
                value={
                  harvestLog?.harvestDate
                    ? new Date(harvestLog?.harvestDate)
                    : null
                }
                locale="th"
                disabled
              />
            </TextField>
            <PlantCombox harvestLog={harvestLog} />
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                ปริมาณ :
              </Label>
              <div className="flex w-full items-start justify-center gap-2">
                <Input
                  required
                  name="amount"
                  value={harvestLog?.amount}
                  type="number"
                  inputMode="numeric"
                  className="w-full rounded-lg p-3 ring-1 ring-gray-300"
                />
                <TypeAmountCombox factor={harvestLog} />
              </div>
            </TextField>
            <TextField className="flex w-80  flex-col items-center justify-start">
              <Label className="w-full text-left text-xl font-semibold text-super-main-color">
                การตลาด :
              </Label>
              <Input
                required
                name="marketing"
                value={harvestLog?.marketing}
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

export default Kos05Form;
