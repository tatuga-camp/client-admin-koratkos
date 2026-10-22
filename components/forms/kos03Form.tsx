import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetFarmerKos03Service } from "../../services/farmer";
import moment from "moment";
import Image from "next/image";
import { LuCalendar, LuInbox } from "react-icons/lu";
import { backgroundImageBase64 } from "../../data/base64Images";

type Kos03FormProps = {
  kos03: UseQueryResult<ResponseGetFarmerKos03Service, Error>;
};
function Kos03Form({ kos03 }: Kos03FormProps) {
  const activities = kos03.data?.activities ?? [];

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <LuInbox aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ยังไม่มีบันทึกกิจกรรมในแปลง</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {activities.map((activity) => {
        const activityDate = moment(activity.activityDate)
          .locale("th")
          .format("D MMM YYYY");
        const image = activity.files.length > 0 ? activity.files[0].url : "";
        return (
          <li
            className="flex flex-col overflow-hidden rounded-lg border border-third-color bg-white"
            key={activity.id}
          >
            {image && (
              <a
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[4/3] w-full bg-third-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main-color"
              >
                <Image
                  src={image}
                  placeholder="blur"
                  blurDataURL={backgroundImageBase64}
                  alt={`ภาพกิจกรรมแปลงที่ ${activity.plotNumber} (เปิดในแท็บใหม่)`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </a>
            )}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-semibold">
                  แปลงที่ {activity.plotNumber}
                </h4>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-super-main-color/80">
                  <LuCalendar aria-hidden="true" className="size-3.5" />
                  {activityDate}
                </span>
              </div>
              <div>
                <h5 className="text-xs font-medium text-super-main-color/70">
                  รายละเอียด
                </h5>
                <p className="mt-1 whitespace-pre-line break-words text-sm">
                  {activity.note || "-"}
                </p>
              </div>
              {activity.files.length > 1 && (
                <ul className="mt-auto grid grid-cols-4 gap-2">
                  {activity.files.map((file, index) => {
                    return (
                      <li key={file.id}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block aspect-square overflow-hidden rounded-md border border-third-color bg-third-color transition hover:opacity-90
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color focus-visible:ring-offset-1"
                        >
                          <Image
                            src={file.url}
                            alt={`ภาพที่ ${index + 1} ของแปลงที่ ${activity.plotNumber} (เปิดในแท็บใหม่)`}
                            fill
                            placeholder="blur"
                            blurDataURL={backgroundImageBase64}
                            sizes="96px"
                            className="object-cover"
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default Kos03Form;
