import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos03Service } from "../../services/farmer";
import moment from "moment";
import Image from "next/image";
import { backgroundImageBase64 } from "../../data/base64Images";

type Kos03FormProps = {
  kos03: UseQueryResult<ResponseGetFarmerKos03Service, Error>;
};
function Kos03Form({ kos03 }: Kos03FormProps) {
  return (
    <main className="grid w-11/12 grid-cols-2 gap-10 rounded-lg bg-fourth-color p-5 xl:grid-cols-3">
      {kos03.data?.activities.map((activity) => {
        const activityDate = moment(activity.activityDate)
          .locale("th")
          .format("DD/MMMM/YYYY");
        const image = activity.files.length > 0 ? activity.files[0].url : "";
        return (
          <section
            className="flex  h-max w-full flex-col gap-4 bg-[#F1E4C3] p-4 py-5 font-Anuphan lg:rounded-lg lg:drop-shadow-md"
            key={activity.id}
          >
            <div className="flex w-full flex-row-reverse justify-between">
              <div
                className={` w-max flex-col ${image ? "hidden" : "flex px-6 py-2"}  items-start justify-between
             rounded-lg bg-[#597E52] `}
              >
                <h1 className="text-2xl font-semibold text-white">
                  แปลงที่ {activity.plotNumber}
                </h1>
                <h2 className="text-base font-medium text-white">
                  {activityDate}
                </h2>
              </div>
            </div>
            {image && (
              <div className="relative h-60 w-full overflow-hidden rounded-lg bg-slate-300">
                <Image
                  src={image}
                  placeholder="blur"
                  blurDataURL={backgroundImageBase64}
                  alt="image of activity"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div
                  className={` w-max flex-col ${image ? "flex px-4 py-2" : "hidden"} absolute bottom-2 right-2 z-40 m-auto  items-start justify-between
             rounded-lg bg-[#597E52] `}
                >
                  <h1 className="text-xl font-semibold text-white">
                    แปลงที่ {activity.plotNumber}
                  </h1>
                  <h2 className="text-sm font-medium text-white">
                    {activityDate}
                  </h2>
                </div>
              </div>
            )}
            <h3 className="text-lg font-semibold text-super-main-color underline">
              รายละเอียด
            </h3>
            {kos03.isFetching ? (
              <div className="bg flex h-max w-full flex-col gap-2">
                {[...new Array(4)].map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="h-3 w-full animate-pulse bg-slate-300"
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className=" text-pretty indent-5 text-sm font-medium text-super-main-color">
                {activity.note}
              </div>
            )}
            <div className="grid w-full grid-cols-3 gap-5">
              {activity.files.map((file) => {
                return (
                  <a
                    href={file.url}
                    target="_blank"
                    className="relative h-20  w-20 overflow-hidden rounded-lg bg-slate-500"
                    key={file.id}
                  >
                    <Image
                      src={file.url}
                      alt="image of activity"
                      fill
                      placeholder="blur"
                      blurDataURL={backgroundImageBase64}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-100 hover:scale-110"
                    />
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default Kos03Form;
