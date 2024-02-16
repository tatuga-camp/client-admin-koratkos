import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  GetFarmerKos01Service,
  ResponseGetFarmerKos01Service,
} from "../../services/farmer";
import moment from "moment";
import { BsFillPinMapFill } from "react-icons/bs";
import MapDisplay from "../cards/mapDisplay";
import PlantCard from "../cards/plantCard";

type Kos01FormProps = {
  kos01: UseQueryResult<ResponseGetFarmerKos01Service, Error>;
};
function Kos01Form({ kos01 }: Kos01FormProps) {
  const router = useRouter();
  const [triggerMap, setTriggerMap] = useState(false);

  return (
    <main className="flex w-11/12  flex-col items-center justify-start gap-5">
      {triggerMap && <MapDisplay kos01={kos01} setTriggerMap={setTriggerMap} />}
      <section className="  grid h-max w-full grid-cols-2 gap-5 rounded-lg bg-fourth-color p-5 xl:grid-cols-3">
        <div className="flex flex-col  items-start justify-start gap-2">
          <h2 className="bg-fifth-color flex h-8 w-60 items-center justify-center rounded-lg text-center text-sm font-semibold text-white xl:text-lg">
            ข้อมูลพื้นฐาน
          </h2>
          <div className="mt-5 flex w-full items-start justify-start gap-2">
            <span className=" text-title">ที่อยู่เลขที่ :</span>
            <span className="text-subtitle">{kos01.data?.address}</span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">หมู่ที่ :</span>
            <span className="text-subtitle">{kos01.data?.villageNumber}</span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">ตำบล :</span>
            <span className="text-subtitle">{kos01.data?.subdistrict}</span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">อำเภอ :</span>
            <span className="text-subtitle">{kos01.data?.district}</span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">จังหวัด :</span>
            <span className="text-subtitle">{kos01.data?.province}</span>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="bg-fifth-color f flex h-8 w-60 items-center justify-center rounded-lg text-center text-sm font-semibold text-white xl:text-lg">
            ที่ตั้งสถานที่ผลิตพืชอินทรีย์
          </h2>
          <div className="mt-5 flex w-full items-start justify-start gap-2">
            <span className=" text-title">ที่อยู่เลขที่ :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.address}
            </span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">หมู่ที่ :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.villageNumber}
            </span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">ตำบล :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.subdistrict}
            </span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">อำเภอ :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.district}
            </span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">จังหวัด :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.province}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="bg-fifth-color flex h-8 w-60 items-center justify-center rounded-lg text-center text-sm font-semibold text-white xl:text-lg">
            วันที่ยื่นขอการรับรอง
          </h2>
          <div className="mt-5 flex w-full items-start justify-start gap-2">
            <span className=" text-title">วัน/เดือน/ป :</span>
            <span className="text-subtitle">
              {moment(kos01.data?.farmKos1.certRequestDate).format(
                "DD/MMMM/YYYY",
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2 xl:col-span-2">
          <h2 className="bg-fifth-color flex h-8 w-60 items-center justify-center rounded-lg text-center text-sm font-semibold text-white xl:text-lg">
            กระบวนการผลิต
          </h2>
          <div className="mt-5 flex w-full items-start justify-start gap-2">
            <span className=" text-title">กระบวนการผลิต :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.productionProcess}
            </span>
          </div>
          <div className=" flex w-full items-start justify-start gap-2">
            <span className=" text-title">วิธีการผลิต :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.productionMethod}
            </span>
          </div>
          <div className=" flex w-max flex-col  items-start justify-start gap-2 xl:flex-row">
            <span className=" text-title">พิกัดแปลง (UTM) 47/48 P :</span>
            <button
              onClick={() => setTriggerMap(true)}
              className="flex items-center   justify-center gap-2 text-sm font-semibold text-blue-700 transition 
            duration-100 hover:scale-105 active:scale-110 xl:text-lg"
            >
              <BsFillPinMapFill />
              {kos01.data?.farmKos1.latitude}, {kos01.data?.farmKos1.longitude}
            </button>
          </div>
        </div>
      </section>

      <section className=" grid h-max w-full grid-cols-3 gap-5 rounded-lg bg-fourth-color p-5">
        <div className="col-span-1 flex  flex-col items-start justify-start gap-2">
          <h2 className="bg-fifth-color flex h-8 w-60 items-center justify-center rounded-lg text-center text-sm font-semibold text-white xl:text-lg">
            ชนิดพืชที่ขอการรับรอง
          </h2>
          <div className="mt-5 flex w-full flex-col items-start justify-start gap-2">
            <span className=" text-title text-base">จำนวนแปลงทั้งหมด :</span>
            <span className="text-subtitle text-base">
              {kos01.data?.farmKos1.plotsTotal} แปลง
            </span>
          </div>
          <div className="mt-5 flex w-max items-start justify-start gap-2">
            <span className=" text-title">พื้นที่ :</span>
            <span className="text-subtitle w-max">
              {kos01.data?.farmKos1.raiTotal} ไร่
            </span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.nganTotal} งาน
            </span>
          </div>
          <div className="mt-5 flex w-full flex-col items-start justify-start gap-2">
            <span className=" text-title text-base">
              จำนวนแปลงที่ขอรับรอง KOS :{" "}
            </span>
            <span className="text-subtitle text-base">
              {kos01.data?.farmKos1.certicatedPlotTotal} แปลง
            </span>
          </div>
          <div className="mt-5 flex w-max items-start justify-start gap-2">
            <span className=" text-title">พื้นที่ :</span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.certicatedRaiTotal} ไร่
            </span>
            <span className="text-subtitle">
              {kos01.data?.farmKos1.certicatedNganTotal} งาน
            </span>
          </div>
        </div>
        <ul className="col-span-2 grid w-full grid-cols-2 gap-3">
          {kos01.data?.plantKOS1s.map((plant, index) => {
            return <PlantCard key={plant.id} index={index} plant={plant} />;
          })}
        </ul>
      </section>
    </main>
  );
}

export default Kos01Form;
