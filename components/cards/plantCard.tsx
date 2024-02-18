import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { TbToolsKitchen } from "react-icons/tb";
import { PlantKos1 } from "../../model";
import moment from "moment";

type PlantCardProps = {
  plant: PlantKos1;
  index: number;
};
function PlantCard({ plant, index }: PlantCardProps) {
  const seasonProd = plant.seasonProd.map((time) => {
    const date = new Date(time);
    return date.toLocaleDateString("th-TH", {
      month: "short",
    });
  });
  const expHarvestDate = moment(plant.expHarvestDate).format("DD/MMMM/YYYY");
  return (
    <li className="flex h-60 w-full flex-col items-center gap-1 rounded-lg bg-[#F1E4C3] p-2 drop-shadow-md">
      <section className="flex w-full justify-between">
        <h1
          className="flex h-10 items-center justify-center
         rounded-2xl bg-super-main-color px-3 py-1 text-sm  font-bold text-white xl:text-lg"
        >
          ลำดับที่ {index + 1}
        </h1>
      </section>
      <section className="flex w-full flex-col items-center justify-center gap-1">
        <h3 className="w-40 truncate text-center text-base font-semibold text-super-main-color xl:text-3xl">
          {plant.plant}
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-super-main-color xl:text-sm">
          <span>พื้นที่ {plant.raiTotal} ไร่</span>
          <span>ผลิต {plant.annualProdCycles} รอบ/ปี</span>
        </div>
      </section>
      <section className="mt-5 flex w-full justify-center gap-2">
        <div className="flex w-max items-center justify-center gap-2 ">
          <div className="rounded-full bg-super-main-color p-1 text-sm text-white">
            <FaCalendarAlt />
          </div>
          <span className="font-semibold text-super-main-color">
            {seasonProd[0]} - {seasonProd[1]}
          </span>
        </div>
        <div className="flex w-max items-center justify-center gap-2">
          <div className="rounded-full bg-super-main-color p-1 text-sm text-white">
            <GiWeight />
          </div>
          <span className="font-semibold text-super-main-color">
            {plant.expYieldAmt.toLocaleString()} กก.
          </span>
        </div>
      </section>
      <div className="mt-2 flex w-max items-center justify-center gap-2">
        <div className="rounded-full bg-super-main-color p-1 text-sm text-white">
          <TbToolsKitchen />
        </div>
        <span className="text-xs font-semibold text-super-main-color xl:text-base">
          เก็บเกี่ยว : {expHarvestDate}
        </span>
      </div>
    </li>
  );
}

export default PlantCard;
