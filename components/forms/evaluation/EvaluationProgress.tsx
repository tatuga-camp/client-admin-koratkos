import React from "react";
import { StatusEvaluation } from "../../../model";
import StatusBadge from "../../ui/StatusBadge";

type EvaluationProgressProps = {
  number: number;
  evaluatedDate?: string;
  status?: StatusEvaluation;
  total: number;
  approved: number;
  rejected: number;
};

/** Round header with how many criteria have been answered so far. */
function EvaluationProgress({
  number,
  evaluatedDate,
  status,
  total,
  approved,
  rejected,
}: EvaluationProgressProps) {
  const answered = approved + rejected;
  const percent = (count: number) => (total > 0 ? (count / total) * 100 : 0);

  return (
    <section aria-labelledby="evaluation-progress-title" className="card">
      <div className="card-header">
        <div className="min-w-0">
          <h3 id="evaluation-progress-title" className="card-title">
            แบบประเมินครั้งที่ {number}
          </h3>
          {evaluatedDate && (
            <p className="text-sm text-super-main-color/80">
              วันที่ประเมิน {evaluatedDate}
            </p>
          )}
        </div>
        <StatusBadge status={status ?? "pending"} />
      </div>
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-semibold">
            ประเมินแล้ว <span className="tabular-nums">{answered}</span> จาก{" "}
            <span className="tabular-nums">{total}</span> ข้อ
          </p>
          <p className="text-sm tabular-nums text-super-main-color/80">
            {Math.round(percent(answered))}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="ความคืบหน้าการประเมิน"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
          aria-valuetext={`ประเมินแล้ว ${answered} จาก ${total} ข้อ`}
          className="flex h-2 overflow-hidden rounded-full bg-third-color"
        >
          <div
            className="bg-main-color transition-all"
            style={{ width: `${percent(approved)}%` }}
          />
          <div
            className="bg-red-600 transition-all"
            style={{ width: `${percent(rejected)}%` }}
          />
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-super-main-color/80">
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-main-color"
            />
            ใช่{" "}
            <span className="font-semibold tabular-nums text-super-main-color">
              {approved}
            </span>
          </li>
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-red-600"
            />
            ไม่ใช่{" "}
            <span className="font-semibold tabular-nums text-super-main-color">
              {rejected}
            </span>
          </li>
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-third-color ring-1 ring-fifth-color"
            />
            ยังไม่ประเมิน{" "}
            <span className="font-semibold tabular-nums text-super-main-color">
              {total - answered}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default EvaluationProgress;
