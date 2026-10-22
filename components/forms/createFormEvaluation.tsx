import React, { useState } from "react";
import { Button, Form } from "react-aria-components";
import { LuClipboardList, LuPlayCircle } from "react-icons/lu";
import { FormEvaluation } from "../../model";
import Swal from "sweetalert2";
import DateInput from "../ui/DateInput";
import {
  CrateFormEvaluationService,
  ResponseGetFormEvaluationsService,
} from "../../services/evaluation";
import { useRouter } from "next/router";
import { UseQueryResult } from "@tanstack/react-query";

type ConfirmStartEvalationProps = {
  selectFormEvaluation: FormEvaluation;
  formEvaluations: UseQueryResult<ResponseGetFormEvaluationsService, Error>;
};
function CreateFormEvaluation({
  selectFormEvaluation,
  formEvaluations,
}: ConfirmStartEvalationProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(new Date());
  const handleSummitCreateFormEvaluation = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!date) {
        throw new Error("เลือกวันที่");
      }
      Swal.fire({
        title: "กำลังเริ่มการประเมิน",
        text: "กรุณารอสักครู่",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const create = await CrateFormEvaluationService({
        farmerId: router.query.farmerId as string,
        evaluatedDate: date.toISOString(),
      });
      await formEvaluations.refetch();
      Swal.fire({
        icon: "success",
        title: "เริ่มการประเมินสำเร็จ",
        text: "กรุณารอสักครู่",
      });
    } catch (error: any) {
      console.error(error.message);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };
  return (
    <Form
      onSubmit={handleSummitCreateFormEvaluation}
      className="flex flex-col gap-5 px-4 py-5 sm:px-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-main-color/10 text-main-color">
          <LuClipboardList aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">
            แบบประเมินครั้งที่ : {selectFormEvaluation.number}
          </p>
          <p className="text-sm text-super-main-color/80">
            คุณต้องการเริ่มการประเมินหรือไม่
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <label htmlFor="evaluation-start-date" className="label">
          วันที่เริ่มการประเมิน
        </label>
        <DateInput
          id="evaluation-start-date"
          value={date}
          onChange={setDate}
          required
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-third-color pt-4 sm:flex-row sm:justify-end">
        <Button type="submit" className="btn btn-primary w-full sm:w-auto">
          <LuPlayCircle aria-hidden="true" className="size-4" />
          เริ่มการประเมิน
        </Button>
      </div>
    </Form>
  );
}

export default CreateFormEvaluation;
