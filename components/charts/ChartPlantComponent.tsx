import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Chart, ChartData, registerables } from "chart.js";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Amphure, Tambon, User } from "../../model";
import {
  GetAllPlantTypeByGroupService,
  GroupsType,
} from "../../services/overview";
import {
  GetAllAmphuresByProvinceService,
  GetAllTambonByAmphureService,
} from "../../services/thai-data";

Chart.register(...registerables);

type ChartProps = {
  user: User;
};
const menus = ["จำนวนชนิดพืช", "พื้นที่หน่วยไร่"];

function ChartPlantComponent({ user }: ChartProps) {
  const [selectAumpure, setselectAumpure] = useState<Amphure | null>(null);
  const [selectTambon, setSelectTambon] = useState<Tambon | null>(null);
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
  const [selectMenu, setSelectMenu] = React.useState(0);
  const [data, setData] = useState<ChartData<"bar">>({
    labels: plantType.data?.map((group) => group.plant),
    datasets: [
      {
        label: "จำนวนชนิดพืช",
        data: plantType.data?.map((group) => group._count.plant) ?? [],
        borderWidth: 1,
        backgroundColor: "#5C430D",
        borderColor: "#F1E4C3",
      },
    ],
  });

  const handleChangeData = (index: number) => {
    if (index === 0) {
      setData({
        labels: plantType.data?.map((group) => group.plant),
        datasets: [
          {
            label: "จำนวนชนิดพืช",
            data: plantType.data?.map((group) => group._count.plant) ?? [],
            borderWidth: 1,
            backgroundColor: "#5C430D",
            borderColor: "#F1E4C3",
          },
        ],
      });
    } else {
      setData({
        labels: plantType.data?.map((group) => group.plant),
        datasets: [
          {
            label: "พื้นที่หน่วยไร่",
            data: plantType.data?.map((group) => group._sum.raiTotal) ?? [],
            borderWidth: 1,
            backgroundColor: "#5C430D",
            borderColor: "#F1E4C3",
          },
        ],
      });
    }
  };

  useEffect(() => {
    handleChangeData(selectMenu);
  }, [plantType.data]);

  return (
    <div className="flex h-max w-full flex-col items-center justify-center rounded-lg bg-fourth-color p-3  font-Anuphan">
      <h1 className="w-full text-left text-2xl font-extrabold text-[#5C430D]">
        ชนิดพืชที่ขอการรับรอง
      </h1>
      <div className="flex w-full items-center justify-center gap-2">
        {user.role === "admin" && (
          <Dropdown
            placeholder="เลือกอำเภอ"
            value={selectAumpure}
            onChange={(e: DropdownChangeEvent) => {
              setselectAumpure(e.value);
              setSelectTambon(null);
            }}
            options={amphures.data}
            optionLabel="name_th"
            className="w-60"
            loading={amphures.isLoading}
            showClear
          />
        )}
        {tambons.data && (
          <Dropdown
            placeholder="เลือกตำบล"
            value={selectTambon}
            loading={tambons.isLoading}
            onChange={(e: DropdownChangeEvent) => setSelectTambon(e.value)}
            options={tambons.data}
            optionLabel="name_th"
            className="w-60"
            showClear
          />
        )}
        {menus.map((menu, index) => {
          return (
            <button
              onClick={() => {
                setSelectMenu(index);
                handleChangeData(index);
              }}
              key={index}
              className={`${selectMenu === index ? "bg-super-main-color text-white" : "text-super-main-color"} button-focus rounded-lg px-2 py-1  ring-2 ring-super-main-color `}
            >
              {menu}
            </button>
          );
        })}
      </div>
      <Bar data={data} />
    </div>
  );
}

export default ChartPlantComponent;
