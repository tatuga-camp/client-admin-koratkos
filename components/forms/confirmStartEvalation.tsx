import React from "react";
import { FormEvaluation } from "../../model";
import { Form } from "react-aria-components";
import CreateFormEvaluation from "./createFormEvaluation";
import UpdateFormEvaluation from "./updateFormEvaluation";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetFormEvaluationsService } from "../../services/evaluation";

type ConfirmStartEvalationProps = {
  selectFormEvaluation: FormEvaluation;
  formEvaluations: UseQueryResult<ResponseGetFormEvaluationsService, Error>;
};
function ConfirmStartEvalation({
  selectFormEvaluation,
  formEvaluations,
}: ConfirmStartEvalationProps) {
  return (
    <div className="mt-5 flex w-full flex-col items-center justify-start gap-5 font-Anuphan">
      <header className="w-11/12 rounded-lg bg-fifth-color px-3 py-1 text-left text-xl font-semibold text-white ">
        เริ่มการประเมิน
      </header>

      {!selectFormEvaluation.id && (
        <CreateFormEvaluation
          formEvaluations={formEvaluations}
          selectFormEvaluation={selectFormEvaluation}
        />
      )}
    </div>
  );
}

export default ConfirmStartEvalation;
