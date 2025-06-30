import { Calendar } from "primereact/calendar";
import React, { useState } from "react";
import { Button, Form, Label, TextField } from "react-aria-components";
import { useDeviceType } from "../../utils";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import {
  RequestUpdateCertificateRegisterFormService,
  UpdateCertificateRegisterFormService,
} from "../../services/evaluation";
import { RegisterFormEvaluation, StatusEvaluation } from "../../model";
import Swal from "sweetalert2";
import { ResponseGetAllRegisterFormaEvaluation } from "../../services/register-form";

type Props = {
  onClose: () => void;
  registerForms: UseQueryResult<ResponseGetAllRegisterFormaEvaluation, Error>;
  selectRegisterForm: RegisterFormEvaluation;
};
function UpdateCertificateFormStatus({
  registerForms,
  onClose,
  selectRegisterForm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] =
    useState<StatusEvaluation>("approved");
  const updateCertificate = useMutation({
    mutationKey: ["update-certificate"],
    mutationFn: (request: RequestUpdateCertificateRegisterFormService) =>
      UpdateCertificateRegisterFormService(request),
  });

  const handleUpdateCertificateStatus = async (
    e: React.FormEvent,
    input: {
      farmerId: string;
      certificate_status: StatusEvaluation;
    },
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      await updateCertificate.mutateAsync(input);
      await registerForms.refetch();
      setLoading(false);
      Swal.fire("success", "อัปเดทสถานะพิจารณาสำเร็จ", "success");
      onClose();
    } catch (error: any) {
      setLoading(false);
      Swal.fire("error", error.message.toString(), "error");
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-screen w-screen items-center justify-center font-Anuphan">
      <Form
        onSubmit={(e) =>
          handleUpdateCertificateStatus(e, {
            farmerId: selectRegisterForm.farmerId,
            certificate_status: selectStatus,
          })
        }
        className="flex h-max w-96 flex-col items-center justify-between gap-3 rounded-lg bg-fourth-color p-5 ring-2 ring-black"
      >
        <Label className="text-xl font-semibold text-super-main-color">
          อัปเดทสถานะการพิจารณา
        </Label>

        <select
          value={selectStatus}
          onChange={(e) => {
            setSelectStatus(() => e.target.value as StatusEvaluation);
          }}
          className="h-10 w-80 rounded-md ring-1 ring-super-main-color"
        >
          {[
            { title: "ผ่านการพิจารณา", value: "approved" },
            { title: "ไม่ผ่านการพิจารณา", value: "rejected" },
          ].map((status) => {
            return (
              <option key={status.title} value={status.value}>
                {status.title}
              </option>
            );
          })}
        </select>
        <button
          disabled={loading}
          type="submit"
          className="button-focus flex w-60 items-center justify-center gap-2 rounded-lg bg-fifth-color px-5 py-1 text-xl font-bold text-white"
        >
          {loading ? "กำลังดำเนินการ" : "ตกลง"}
        </button>
      </Form>
      <footer
        onClick={() => onClose()}
        className="fixed bottom-0 left-0 right-0 top-0 -z-10 m-auto h-screen w-screen bg-white/10 backdrop-blur-md"
      ></footer>
    </div>
  );
}

export default UpdateCertificateFormStatus;
