import React, { useState } from "react";
import { Form } from "react-aria-components";
import { IconType } from "react-icons";
import { LuCheckCircle2, LuLoader2, LuXCircle } from "react-icons/lu";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import {
  RequestUpdateCertificateRegisterFormService,
  UpdateCertificateRegisterFormService,
} from "../../services/evaluation";
import { RegisterFormEvaluation, StatusEvaluation } from "../../model";
import Swal from "sweetalert2";
import { ResponseGetAllRegisterFormaEvaluation } from "../../services/register-form";
import Modal from "../ui/Modal";
import StatusBadge, { certificateStatusLabels } from "../ui/StatusBadge";

type Props = {
  onClose: () => void;
  registerForms: UseQueryResult<ResponseGetAllRegisterFormaEvaluation, Error>;
  selectRegisterForm: RegisterFormEvaluation;
};

const formId = "update-certificate-status-form";

const statusOptions: {
  value: Exclude<StatusEvaluation, "pending">;
  icon: IconType;
  iconClass: string;
  accentClass: string;
  selectedClass: string;
}[] = [
  {
    value: "approved",
    icon: LuCheckCircle2,
    iconClass: "text-main-color",
    accentClass: "accent-main-color",
    selectedClass: "border-main-color bg-main-color/5",
  },
  {
    value: "rejected",
    icon: LuXCircle,
    iconClass: "text-red-600",
    accentClass: "accent-red-600",
    selectedClass: "border-red-600 bg-red-50",
  },
];

function UpdateCertificateFormStatus({
  registerForms,
  onClose,
  selectRegisterForm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      setErrorMessage(null);
      setLoading(true);
      await updateCertificate.mutateAsync(input);
      await registerForms.refetch();
      setLoading(false);
      Swal.fire("success", "อัปเดทสถานะพิจารณาสำเร็จ", "success");
      onClose();
    } catch (error: any) {
      setLoading(false);
      // Shown inline: a Swal popup counts as an outside click and would close this dialog.
      setErrorMessage(
        error?.message?.toString() ??
          "บันทึกผลการพิจารณาไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
    }
  };

  const farmer = registerForms.data?.data.find(
    (row) => row.farmer.id === selectRegisterForm.farmerId,
  )?.farmer;
  const currentStatus = selectRegisterForm.certificate_status ?? "pending";

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title="อัปเดตผลการพิจารณาใบรับรอง"
      description={
        farmer ? `${farmer.firstName} ${farmer.lastName}` : undefined
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form={formId}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading && (
              <LuLoader2
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
            )}
            {loading ? "กำลังดำเนินการ" : "บันทึกผลการพิจารณา"}
          </button>
        </>
      }
    >
      <Form
        id={formId}
        onSubmit={(e) =>
          handleUpdateCertificateStatus(e, {
            farmerId: selectRegisterForm.farmerId,
            certificate_status: selectStatus,
          })
        }
        className="flex flex-col gap-4"
      >
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-fourth-color px-3 py-2 text-sm">
          <span className="text-super-main-color/80">สถานะปัจจุบัน</span>
          <StatusBadge
            status={currentStatus}
            label={certificateStatusLabels[currentStatus]}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="label mb-2">ผลการพิจารณา</legend>
          {statusOptions.map((option) => {
            const checked = selectStatus === option.value;
            return (
              <label
                key={option.value}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition
                  has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-main-color has-[:focus-visible]:ring-offset-2
                  ${checked ? option.selectedClass : "border-third-color hover:border-fifth-color"}`}
              >
                <input
                  type="radio"
                  name="certificate_status"
                  value={option.value}
                  checked={checked}
                  onChange={(e) => {
                    setSelectStatus(() => e.target.value as StatusEvaluation);
                  }}
                  className={`size-4 shrink-0 focus:outline-none ${option.accentClass}`}
                />
                <option.icon
                  aria-hidden="true"
                  className={`size-5 shrink-0 ${option.iconClass}`}
                />
                <span className="font-semibold">
                  {certificateStatusLabels[option.value]}
                </span>
              </label>
            );
          })}
        </fieldset>
      </Form>
    </Modal>
  );
}

export default UpdateCertificateFormStatus;
