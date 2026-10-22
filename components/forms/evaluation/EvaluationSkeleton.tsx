import React from "react";

/** Placeholder for the checklist while the evaluation round loads. */
function EvaluationSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">กำลังโหลดแบบประเมิน</span>
      <div className="card flex flex-col gap-4 p-5">
        <div className="h-5 w-48 max-w-full animate-pulse rounded bg-third-color" />
        <div className="h-2 w-full animate-pulse rounded-full bg-third-color" />
      </div>
      {[...Array(2)].map((_, card) => (
        <div key={card} className="card overflow-hidden">
          <div className="card-header">
            <div className="h-5 w-56 max-w-full animate-pulse rounded bg-third-color" />
          </div>
          <div className="divide-y divide-third-color">
            {[...Array(3)].map((_, row) => (
              <div
                key={row}
                className="flex flex-col gap-3 px-4 py-4 sm:px-5 md:flex-row md:justify-between"
              >
                <div className="h-4 w-full max-w-md animate-pulse rounded bg-third-color/70" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-third-color md:w-52" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EvaluationSkeleton;
