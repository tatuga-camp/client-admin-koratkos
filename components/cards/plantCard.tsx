import React, { ReactNode } from "react";
import { LuSprout } from "react-icons/lu";
import { PlantKos1 } from "../../model";
import moment from "moment";

type PlantCardProps = {
  plant: PlantKos1;
  index: number;
};

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

function PlantCard({ plant, index }: PlantCardProps) {
  const seasonProd = plant.seasonProd.map((time) => {
    const date = new Date(time);
    return date.toLocaleDateString("th-TH", {
      month: "short",
    });
  });
  const expHarvestDate = plant.expHarvestDate
    ? moment(plant.expHarvestDate).locale("th").format("D MMM YYYY")
    : "-";
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-third-color bg-fourth-color/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-super-main-color/70">
            ลำดับที่ {index + 1}
          </p>
          <h4 className="break-words text-base font-semibold">{plant.plant}</h4>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-main-color/10 text-main-color">
          <LuSprout aria-hidden="true" className="size-5" />
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <Item label="พื้นที่">{plant.raiTotal} ไร่</Item>
        <Item label="ผลิต">{plant.annualProdCycles} รอบ/ปี</Item>
        <Item label="ฤดูกาลผลิต">
          {seasonProd.length > 0 ? seasonProd.slice(0, 2).join(" - ") : "-"}
        </Item>
        <Item label="ผลผลิตที่คาดว่าจะได้">
          {plant.expYieldAmt?.toLocaleString() ?? "-"} กก.
        </Item>
        <Item label="เก็บเกี่ยว" className="col-span-2">
          {expHarvestDate}
        </Item>
      </dl>
    </li>
  );
}

export default PlantCard;
