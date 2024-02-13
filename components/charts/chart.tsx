import React from "react";
import { GroupsType } from "../../services/overview";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  CoreChartOptions,
  registerables,
} from "chart.js";

Chart.register(...registerables);

type ChartProps = {
  groups: GroupsType[];
};
function ChartComponent({ groups }: ChartProps) {
  const data: ChartData<"bar"> = {
    labels: groups?.map((group) => group.plant),
    datasets: [
      {
        label: "ชนิดพืชที่ขอการรับรอง",
        data: groups?.map((group) => group._count.plant),
        borderWidth: 1,
        backgroundColor: "#5C430D",
        borderColor: "#F1E4C3",
      },
    ],
  };
  const colorCode = "#5C430D";

  return (
    <div className="flex h-max w-full flex-col items-center justify-center rounded-lg bg-fourth-color p-3  font-Anuphan">
      <h1 className="w-full text-left text-2xl font-extrabold text-[#5C430D]">
        ชนิดพืชที่ขอการรับรอง
      </h1>
      <Bar data={data} />
    </div>
  );
}

export default ChartComponent;
