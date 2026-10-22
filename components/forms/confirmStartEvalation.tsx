import React from "react";
import { FormEvaluation } from "../../model";
import CreateFormEvaluation from "./createFormEvaluation";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetFormEvaluationsService } from "../../services/evaluation";
import StatusBadge from "../ui/StatusBadge";

type ConfirmStartEvalationProps = {
  selectFormEvaluation: FormEvaluation;
  formEvaluations: UseQueryResult<ResponseGetFormEvaluationsService, Error>;
};
function ConfirmStartEvalation({
  selectFormEvaluation,
  formEvaluations,
}: ConfirmStartEvalationProps) {
  return (
    <section aria-labelledby="start-evaluation-title" className="card">
      <div className="card-header">
        <h3 id="start-evaluation-title" className="card-title">
          เริ่มการประเมิน
        </h3>
        <StatusBadge status={null} label="ยังไม่เริ่มประเมิน" />
      </div>

      {!selectFormEvaluation.id && (
        <CreateFormEvaluation
          formEvaluations={formEvaluations}
          selectFormEvaluation={selectFormEvaluation}
        />
      )}
    </section>
  );
}

export default ConfirmStartEvalation;
