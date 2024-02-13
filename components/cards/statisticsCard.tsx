import React from "react";
import NumberRunning from "../animations/numberRunning";

function StatisticsCard({
  title,
  number,
}: {
  title: string;
  number: number | "loading";
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-2 rounded-md bg-fourth-color p-5 font-Anuphan">
      <h2 className="text-[100%] font-semibold text-super-main-color">
        {title}
      </h2>
      {number === "loading" ? (
        <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200"></div>
      ) : (
        <h1 className="flex w-40 justify-center truncate text-5xl font-semibold text-super-main-color">
          <NumberRunning n={number} />
        </h1>
      )}

      <button
        className="w-full rounded-lg bg-[#C6A969] py-2 text-xl font-semibold text-white
       transition duration-100 hover:scale-105 hover:drop-shadow-lg active:scale-110"
      >
        ดูข้อมูล
      </button>
    </div>
  );
}

export default StatisticsCard;
