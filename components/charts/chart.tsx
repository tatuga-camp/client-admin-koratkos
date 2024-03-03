import React, { use, useEffect, useState } from "react";
import { GroupsType } from "../../services/overview";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  CoreChartOptions,
  registerables,
} from "chart.js";
import { UseQueryResult } from "@tanstack/react-query";

Chart.register(...registerables);

type ChartProps = {
  groups: UseQueryResult<GroupsType[], Error>;
};
const menus = ["จำนวนชนิดพืช", "พื้นที่หน่วยไร่"];
function ChartComponent({ groups }: ChartProps) {
  const [selectMenu, setSelectMenu] = React.useState(0);
  const [data, setData] = useState<ChartData<"bar">>({
    labels: groups.data?.map((group) => group.plant),
    datasets: [
      {
        label: "จำนวนชนิดพืช",
        data: groups.data?.map((group) => group._count.plant) ?? [],
        borderWidth: 1,
        backgroundColor: "#5C430D",
        borderColor: "#F1E4C3",
      },
    ],
  });

  const handleChangeData = (index: number) => {
    if (index === 0) {
      setData({
        labels: groups.data?.map((group) => group.plant),
        datasets: [
          {
            label: "จำนวนชนิดพืช",
            data: groups.data?.map((group) => group._count.plant) ?? [],
            borderWidth: 1,
            backgroundColor: "#5C430D",
            borderColor: "#F1E4C3",
          },
        ],
      });
    } else {
      setData({
        labels: groups.data?.map((group) => group.plant),
        datasets: [
          {
            label: "พื้นที่หน่วยไร่",
            data: groups.data?.map((group) => group._sum.raiTotal) ?? [],
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
  }, [groups.data]);

  return (
    <div className="flex h-max w-full flex-col items-center justify-center rounded-lg bg-fourth-color p-3  font-Anuphan">
      <h1 className="w-full text-left text-2xl font-extrabold text-[#5C430D]">
        ชนิดพืชที่ขอการรับรอง
      </h1>
      <div className="flex w-full items-center justify-center gap-2">
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

export default ChartComponent;
