import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Chart, ChartData, registerables } from "chart.js";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Amphure, Tambon } from "../../model";
import {
  GetAllFarmereByGroupService,
  GetAllPlantTypeByGroupService,
  GroupsType,
} from "../../services/overview";
import {
  GetAllAmphuresByProvinceService,
  GetAllTambonByAmphureService,
} from "../../services/thai-data";

Chart.register(...registerables);

type ChartProps = {};

function ChartFarmerComponent({}: ChartProps) {
  const [selectAumpure, setselectAumpure] = useState<Amphure | null>(null);
  const amphures = useQuery({
    queryKey: ["amphures"],
    queryFn: () => GetAllAmphuresByProvinceService(),
  });
  const plantType = useQuery({
    queryKey: ["farmer-groups", { amphure: selectAumpure?.name_th }],
    queryFn: () =>
      GetAllFarmereByGroupService({ amphure: selectAumpure?.name_th }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });
  const [data, setData] = useState<ChartData<"bar">>({
    labels: plantType.data?.map((group) => group.district),
    datasets: [
      {
        label: "จำนวนเกษตรกร",
        data: plantType.data?.map((group) => group._count.district) ?? [],
        borderWidth: 1,
        backgroundColor: "#5C430D",
        borderColor: "#F1E4C3",
      },
    ],
  });

  useEffect(() => {
    if (plantType.data) {
      setData(() => {
        return {
          labels: plantType.data?.map((group) =>
            selectAumpure ? group.subdistrict : group.district,
          ),
          datasets: [
            {
              label: "จำนวนเกษตรกร",
              data:
                plantType.data?.map((group) =>
                  selectAumpure
                    ? group._count.subdistrict
                    : group._count.district,
                ) ?? [],
              borderWidth: 1,
              backgroundColor: "#5C430D",
              borderColor: "#F1E4C3",
            },
          ],
        };
      });
    }
  }, [plantType.data]);

  return (
    <div className="flex h-max w-full flex-col items-center justify-center rounded-lg bg-fourth-color p-3  font-Anuphan">
      <h1 className="w-full text-left text-2xl font-extrabold text-[#5C430D]">
        รายชื่อจำนวนเกษตรกรที่ลงทะเบียน
      </h1>
      <Dropdown
        placeholder="เลือกอำเภอ"
        value={selectAumpure}
        onChange={(e: DropdownChangeEvent) => {
          setselectAumpure(e.value);
        }}
        options={amphures.data}
        optionLabel="name_th"
        className="w-60"
        loading={amphures.isLoading}
        showClear
      />
      <Bar data={data} />
    </div>
  );
}

export default ChartFarmerComponent;
