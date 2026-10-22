import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LuAlertCircle } from "react-icons/lu";
import { GetFormEvaluationsService } from "../../services/evaluation";
import { FormEvaluation, StatusEvaluation } from "../../model";
import StatusBadge from "../ui/StatusBadge";
import ConfirmStartEvalation from "./confirmStartEvalation";
import EvaluationSkeleton from "./evaluation/EvaluationSkeleton";
import UpdateFormEvaluation from "./updateFormEvaluation";

const shortStatus: Record<
  StatusEvaluation | "none",
  { label: string; dot: string }
> = {
  pending: { label: "รอประเมิน", dot: "bg-secondary-color" },
  approved: { label: "ผ่าน", dot: "bg-main-color" },
  rejected: { label: "ไม่ผ่าน", dot: "bg-red-600" },
  none: { label: "ยังไม่เริ่ม", dot: "bg-super-main-color/40" },
};

function Kos06Form() {
  const router = useRouter();
  const [menuEvaluation, setMenuEvaluation] = useState<FormEvaluation[]>();
  const [selectFormEvaluation, setselectFormEvaluation] =
    useState<FormEvaluation>({ number: 1 });
  const formEvaluations = useQuery({
    queryKey: ["formEvaluations", router.query.farmerId],
    queryFn: () =>
      GetFormEvaluationsService({
        farmerId: router.query.farmerId as string,
      }),
  });

  useEffect(() => {
    if (formEvaluations.data?.length === 0) {
      setMenuEvaluation(() => {
        return [...new Array(3)].map((list, index) => {
          return {
            number: index + 1,
          };
        });
      });
    } else if (formEvaluations.data && formEvaluations.data.length > 0) {
      // new Array() throws on a negative length if the server ever returns > 3 rounds.
      const blankMenus = Math.max(0, 3 - formEvaluations.data.length);
      setMenuEvaluation(() => {
        return [
          ...formEvaluations.data,
          ...[...new Array(blankMenus)].map((list, index) => {
            return {
              number: formEvaluations.data.length + index + 1,
            };
          }),
        ];
      });
      // Stay on the round being viewed when the list refreshes (e.g. after
      // saving); otherwise, including right after a new round starts, go to the latest.
      setselectFormEvaluation((current) => {
        const sameRound = current.id
          ? formEvaluations.data.find((round) => round.id === current.id)
          : undefined;
        return sameRound ?? formEvaluations.data[formEvaluations.data.length - 1];
      });
    }
  }, [formEvaluations.data]);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="kos06-rounds-title" className="card">
        <div className="card-header">
          <div className="min-w-0">
            <h2 id="kos06-rounds-title" className="card-title">
              ครั้งที่ประเมิน
            </h2>
            <p className="text-sm text-super-main-color/80">
              เลือกครั้งที่ต้องการประเมินหรือดูผลการประเมิน
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {formEvaluations.isError ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <LuAlertCircle
                aria-hidden="true"
                className="size-8 text-red-600"
              />
              <p className="font-semibold">โหลดรายการการประเมินไม่สำเร็จ</p>
              <button
                type="button"
                onClick={() => formEvaluations.refetch()}
                className="btn btn-secondary"
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : (
            <div
              role="group"
              aria-labelledby="kos06-rounds-title"
              className="grid grid-cols-3 gap-2 sm:gap-3"
            >
              {formEvaluations.isLoading
                ? [...new Array(3)].map((list, index) => (
                    <div
                      key={index}
                      className="h-[4.5rem] animate-pulse rounded-lg bg-third-color sm:h-24"
                    />
                  ))
                : menuEvaluation?.map((item, index) => {
                    const selected = selectFormEvaluation.number === index + 1;
                    const tone = item.id ? item.status ?? "pending" : "none";
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setselectFormEvaluation(() => item)}
                        aria-pressed={selected}
                        className={`flex min-w-0 flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color focus-visible:ring-offset-2 sm:px-4
                          ${selected ? "border-main-color bg-main-color/5 ring-1 ring-main-color" : "border-third-color bg-white hover:border-fifth-color hover:bg-fourth-color"}`}
                      >
                        <span className="text-sm font-semibold sm:text-base">
                          ครั้งที่ {item.number}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-super-main-color/80 sm:hidden">
                          <span
                            aria-hidden="true"
                            className={`size-1.5 shrink-0 rounded-full ${shortStatus[tone].dot}`}
                          />
                          {shortStatus[tone].label}
                        </span>
                        <span className="hidden sm:block">
                          {tone === "none" ? (
                            <StatusBadge
                              status={null}
                              label="ยังไม่เริ่มประเมิน"
                            />
                          ) : (
                            <StatusBadge status={tone} />
                          )}
                        </span>
                        {item.evaluatedDate && (
                          <span className="hidden text-xs tabular-nums text-super-main-color/80 sm:block">
                            {moment(item.evaluatedDate)
                              .locale("th")
                              .format("D MMM YYYY")}
                          </span>
                        )}
                      </button>
                    );
                  })}
            </div>
          )}
        </div>
      </section>

      {formEvaluations.isLoading ? (
        <EvaluationSkeleton />
      ) : (
        !formEvaluations.isError && (
          <>
            {!selectFormEvaluation.id && (
              <ConfirmStartEvalation
                formEvaluations={formEvaluations}
                selectFormEvaluation={selectFormEvaluation}
              />
            )}
            {selectFormEvaluation.id && (
              <UpdateFormEvaluation
                selectFormEvaluation={selectFormEvaluation}
              />
            )}
          </>
        )
      )}
    </div>
  );
}

export default Kos06Form;
