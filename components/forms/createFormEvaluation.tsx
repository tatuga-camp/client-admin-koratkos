import React from "react";
import { Button, Form, Label, TextField } from "react-aria-components";
import { FormEvaluation } from "../../model";
import { Calendar } from "primereact/calendar";
import Swal from "sweetalert2";
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
  const handleSummitCreateFormEvaluation = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังเริ่มการประเมิน",
        text: "กรุณารอสักครู่",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const create = await CrateFormEvaluationService({
        farmerId: router.query.farmerId as string,
        evaluatedDate: new Date().toISOString(),
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
      className="h-max w-11/12 rounded-lg bg-fourth-color p-5"
    >
      <h1 className="text-2xl font-bold text-super-main-color">
        แบบประเมินครั้งที่ : {selectFormEvaluation.number}
      </h1>
      <h2 className="text-xl font-bold text-super-main-color">
        คุณต้องการเริ่มการประเมินหรือไม่
      </h2>
      <TextField className="flex w-full flex-col items-center justify-center">
        <Label className="font-semibold text-super-main-color">
          วันที่เริ่มการประเมิน
        </Label>
        <Calendar
          disabled
          dateFormat="dd/MM/yy"
          value={new Date()}
          className="p-3"
          locale="th"
        />
      </TextField>
      <div className="flex w-full items-center justify-center gap-5">
        <Button
          type="submit"
          className="button-focus h-10 w-max rounded-lg bg-super-main-color px-5 font-semibold text-white"
        >
          เริ่มการประเมิน
        </Button>
      </div>
    </Form>
  );
}

export default CreateFormEvaluation;
