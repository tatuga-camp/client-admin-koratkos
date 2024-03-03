import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos02Service } from "../../services/farmer";
import Image from "next/image";
import { MdFileDownload, MdLandslide } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { FaSeedling } from "react-icons/fa";
import moment from "moment";
import { backgroundImageBase64 } from "../../data/base64Images";
type Kos02FormProps = {
  kos02: UseQueryResult<ResponseGetFarmerKos02Service, Error>;
};
function Kos02Form({ kos02 }: Kos02FormProps) {
  return (
    <section className="flex h-max w-full flex-col items-center justify-start gap-5">
      <section className=" grid h-max w-11/12 grid-cols-2 gap-2 rounded-lg bg-fourth-color p-5 xl:grid-cols-3">
        <section className="flex h-max w-full flex-col items-center justify-center gap-2 rounded-lg p-5 ring-1 ring-black">
          <h1 className="rounded-lg bg-fifth-color px-20 py-1 text-xl font-semibold text-white">
            แผนผังแปลง
          </h1>
          {kos02.data?.files && kos02.data.files.length > 0 && (
            <div className="relative grid h-max w-full grid-cols-2 ">
              {kos02.data?.files.map((file, index) => {
                return (
                  <div
                    key={index}
                    className="relative h-40 w-40 overflow-hidden  "
                  >
                    <Image
                      onClick={() => window.open(file.url as string, "_blank")}
                      fill
                      src={file.url as string}
                      blurDataURL={backgroundImageBase64}
                      placeholder="blur"
                      className="cursor-pointer object-cover transition duration-100 hover:scale-110"
                      alt="image map"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
        {kos02.data?.orgCropProdCalForKos2s?.map((orgCropProd, index) => {
          const rangeDate = orgCropProd.rangeDate.map((time) => {
            return ` ${moment(time).format("MMMM")} ,`;
          });
          const yearPlan = moment(orgCropProd.yearPlan).format("YYYY");
          return (
            <li
              key={orgCropProd.id}
              className="flex h-full w-full flex-col items-center justify-start gap-1 rounded-lg bg-[#F1E4C3] p-4"
            >
              <section className="flex w-full justify-between ">
                <h2
                  className="flex items-center justify-center rounded-lg bg-[#502D16]
              px-3 py-1 text-xl font-semibold text-white"
                >
                  แปลงที่ {orgCropProd.plotNumber}
                </h2>
              </section>
              <section className="mt-2 flex w-full flex-col items-start">
                <h1 className="text-4xl font-semibold text-super-main-color">
                  {orgCropProd.plantType}
                </h1>
                <span className="text-blue-600">
                  แหล่งที่มา: {orgCropProd.source}
                </span>
              </section>
              <section className="mt-5 flex w-full justify-center gap-2">
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="rounded-full bg-super-main-color p-2 text-lg text-white">
                    <MdLandslide />
                  </div>
                  <span className="font-semibold">
                    พื้นที่ {orgCropProd.landArea} ไร่
                  </span>
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="rounded-full bg-super-main-color p-2 text-lg text-white">
                    <GiWeight />
                  </div>
                  <div className="text-xs font-semibold">
                    <span className="text-sm">
                      ผลผลิต {orgCropProd.yieldPerRai.toLocaleString()}{" "}
                    </span>
                    <div className="text-xs">กก./ไร่</div>
                  </div>
                </div>
              </section>
              <section className="mt-5 flex flex-col items-center justify-center gap-2 border-b-2 border-[#502D16]">
                <div className="rounded-full bg-super-main-color p-3 text-3xl text-white">
                  <FaSeedling />
                </div>
                <h1 className="text-2xl font-semibold text-[#502D16]">
                  {orgCropProd.seed}
                </h1>
              </section>
              <section className="mt-5 flex w-full flex-col items-center justify-center gap-3">
                <span className="font-bold text-[#502D16]">
                  เดือน:{" "}
                  <span className="text-super-main-color ">{rangeDate}</span>
                </span>
                <span className="font-bold text-[#502D16]">
                  แผนการผลิตพืชอินทรีย์ ประจำปีการผลิต
                </span>
                <span className="text-xl font-bold text-super-main-color">
                  {yearPlan}
                </span>
              </section>
            </li>
          );
        })}
      </section>
    </section>
  );
}

export default Kos02Form;
