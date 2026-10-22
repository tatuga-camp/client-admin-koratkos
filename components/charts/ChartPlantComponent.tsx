import { useQuery } from "@tanstack/react-query";
import { Chart, ChartData, registerables } from "chart.js";
import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Amphure, Tambon, User } from "../../model";
import { GetAllPlantTypeByGroupService } from "../../services/overview";
import {
  GetAllAmphuresByProvinceService,
  GetAllTambonByAmphureService,
} from "../../services/thai-data";
import Select from "../ui/Select";
import { barChartOptions, chartColors, useChartFont } from "./chartTheme";

Chart.register(...registerables);

type ChartProps = {
  user: User;
};
const menus = ["จำนวนชนิดพืช", "พื้นที่หน่วยไร่"];

function ChartPlantComponent({ user }: ChartProps) {
  useChartFont();
  const [selectAumpure, setselectAumpure] = useState<Amphure | null>(null);
  const [selectTambon, setSelectTambon] = useState<Tambon | null>(null);
  const [selectMenu, setSelectMenu] = useState(0);
  const plantType = useQuery({
    queryKey: [
      "plant-types",
      { amphure: selectAumpure?.name_th, tambon: selectTambon?.name_th },
    ],
    queryFn: () =>
      GetAllPlantTypeByGroupService({
        amphure: selectAumpure?.name_th,
        tambon: selectTambon?.name_th,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });
  const amphures = useQuery({
    queryKey: ["amphures"],
    queryFn: () => GetAllAmphuresByProvinceService(),
  });
  const tambons = useQuery({
    queryKey: ["tambons", { amphuresId: selectAumpure?.originalId }],
    queryFn: () => {
      if (selectAumpure) {
        return GetAllTambonByAmphureService({
          amphureId: selectAumpure.originalId,
        });
      }
    },

    enabled: !!selectAumpure,
  });

  const data = useMemo<ChartData<"bar">>(
    () => ({
      labels: plantType.data?.map((group) => group.plant) ?? [],
      datasets: [
        {
          label: menus[selectMenu],
          data:
            plantType.data?.map((group) =>
              selectMenu === 0 ? group._count.plant : group._sum.raiTotal,
            ) ?? [],
          backgroundColor: chartColors.main,
          borderRadius: 6,
          maxBarThickness: 40,
        },
      ],
    }),
    [plantType.data, selectMenu],
  );

  return (
    <section className="card flex min-w-0 flex-col">
      <div className="card-header">
        <h2 className="card-title">ชนิดพืชที่ขอการรับรอง</h2>
        <div className="segmented" role="group" aria-label="เลือกข้อมูลที่แสดง">
          {menus.map((menu, index) => (
            <button
              type="button"
              key={menu}
              onClick={() => setSelectMenu(index)}
              aria-pressed={selectMenu === index}
              className="segmented-item"
            >
              {menu}
            </button>
          ))}
        </div>
      </div>
      {(user.role === "admin" || tambons.data) && (
        <div className="flex flex-col gap-2 px-4 pt-4 sm:flex-row sm:px-5">
          {user.role === "admin" && (
            <Select
              label="อำเภอ"
              placeholder="ทุกอำเภอ"
              value={selectAumpure}
              onChange={(amphure) => {
                setselectAumpure(amphure);
                setSelectTambon(null);
              }}
              options={amphures.data}
              getLabel={(amphure) => amphure.name_th}
              getKey={(amphure) => amphure.id}
              className="w-full sm:w-48"
              loading={amphures.isLoading}
              clearable
            />
          )}
          {tambons.data && (
            <Select
              label="ตำบล"
              placeholder="ทุกตำบล"
              value={selectTambon}
              loading={tambons.isLoading}
              onChange={setSelectTambon}
              options={tambons.data}
              getLabel={(tambon) => tambon.name_th}
              getKey={(tambon) => tambon.id ?? tambon.name_th}
              className="w-full sm:w-48"
              clearable
            />
          )}
        </div>
      )}
      <div className="relative h-64 px-2 py-4 sm:h-72 sm:px-4">
        {plantType.isLoading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-fourth-color" />
        ) : (
          <Bar data={data} options={barChartOptions} aria-label="กราฟชนิดพืชที่ขอการรับรอง" role="img" />
        )}
      </div>
    </section>
  );
}

export default ChartPlantComponent;
