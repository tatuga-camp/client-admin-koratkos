import React from "react";
import { IconType } from "react-icons";
import NumberRunning from "../animations/numberRunning";

export type StatisticsTone = "neutral" | "pending" | "approved" | "rejected";

const toneClasses: Record<StatisticsTone, string> = {
  neutral: "bg-third-color text-super-main-color",
  pending: "bg-secondary-color/10 text-secondary-color",
  approved: "bg-main-color/10 text-main-color",
  rejected: "bg-red-50 text-red-600",
};

type StatisticsCardProps = {
  title: string;
  number: number | "loading";
  icon: IconType;
  tone: StatisticsTone;
  /** When set, the card filters the request list below. */
  onClick?: () => void;
  selected?: boolean;
};

function StatisticsCard({
  title,
  number,
  icon: Icon,
  tone,
  onClick,
  selected = false,
}: StatisticsCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`card flex w-full flex-col gap-3 p-4 text-left transition hover:border-fifth-color
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color sm:p-5
        ${selected ? "border-main-color ring-1 ring-main-color" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-medium text-super-main-color/80">{title}</h2>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      {number === "loading" ? (
        <div className="h-9 w-20 animate-pulse rounded-md bg-third-color" />
      ) : (
        <div className="text-3xl font-bold tabular-nums text-super-main-color sm:text-4xl">
          <NumberRunning n={number} />
        </div>
      )}
    </button>
  );
}

export default StatisticsCard;
