import { useQuery } from "@tanstack/react-query";
import { Chart, ChartData, registerables } from "chart.js";
import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Amphure } from "../../model";
import { GetAllFarmereByGroupService } from "../../services/overview";
import { GetAllAmphuresByProvinceService } from "../../services/thai-data";
import Select from "../ui/Select";
import { barChartOptions, chartColors, useChartFont } from "./chartTheme";

Chart.register(...registerables);

function ChartFarmerComponent() {
  useChartFont();
  const [selectAumpure, setselectAumpure] = useState<Amphure | null>(null);
  const amphures = useQuery({
    queryKey: ["amphures"],
    queryFn: () => GetAllAmphuresByProvinceService(),
  });
  const farmerGroups = useQuery({
    queryKey: ["farmer-groups", { amphure: selectAumpure?.name_th }],
    queryFn: () =>
      GetAllFarmereByGroupService({ amphure: selectAumpure?.name_th }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  // With an amphure selected the API groups by tambon instead of amphure.
  const data = useMemo<ChartData<"bar">>(
    () => ({
      labels:
        farmerGroups.data?.map((group) =>
          selectAumpure ? group.subdistrict : group.district,
        ) ?? [],
      datasets: [
        {
          label: "จำนวนเกษตรกร",
          data:
            farmerGroups.data?.map((group) =>
              selectAumpure ? group._count.subdistrict : group._count.district,
            ) ?? [],
          backgroundColor: chartColors.brown,
          borderRadius: 6,
          maxBarThickness: 40,
        },
      ],
    }),
    [farmerGroups.data, selectAumpure],
  );

  return (
    <section className="card flex min-w-0 flex-col">
      <div className="card-header">
        <h2 className="card-title">เกษตรกรที่ลงทะเบียน</h2>
        <Select
          label="อำเภอ"
          placeholder="ทุกอำเภอ"
          value={selectAumpure}
          onChange={setselectAumpure}
          options={amphures.data}
          getLabel={(amphure) => amphure.name_th}
          getKey={(amphure) => amphure.id}
          className="w-full sm:w-48"
          loading={amphures.isLoading}
          clearable
        />
      </div>
      <div className="relative h-64 px-2 py-4 sm:h-72 sm:px-4">
        {farmerGroups.isLoading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-fourth-color" />
        ) : (
          <Bar data={data} options={barChartOptions} aria-label="กราฟจำนวนเกษตรกรที่ลงทะเบียน" role="img" />
        )}
      </div>
    </section>
  );
}

export default ChartFarmerComponent;
