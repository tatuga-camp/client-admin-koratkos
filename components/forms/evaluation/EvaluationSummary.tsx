import React from "react";
import {
  Button,
  FieldError,
  FileTrigger,
  Label,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
} from "react-aria-components";
import { IconType } from "react-icons";
import {
  LuCalendarDays,
  LuCheckCircle2,
  LuMail,
  LuPhone,
  LuUpload,
  LuXCircle,
} from "react-icons/lu";
import { StatusEvaluation, User } from "../../../model";
import { evaluationStatusLabels } from "../../ui/StatusBadge";
import FileOnListFormEvaluation from "../FileOnListFormEvaluation";
import EvaluatorFields from "./EvaluatorFields";
import {
  EvaluationAttachment,
  EvaluationSummaryData,
  fileNameFromUrl,
  radioValue,
} from "./types";

type EvaluationSummaryProps = {
  data?: EvaluationSummaryData;
  onChange: (patch: Partial<EvaluationSummaryData>) => void;
  files: EvaluationAttachment[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (file: EvaluationAttachment) => void;
  approvedCount: number;
  rejectedCount: number;
  evaluatedBy?: User;
  evaluatedDate?: string;
};

const resultOptions: {
  value: Exclude<StatusEvaluation, "pending">;
  icon: IconType;
  iconTone: string;
  indicator: string;
  selected: string;
}[] = [
  {
    value: "approved",
    icon: LuCheckCircle2,
    iconTone: "bg-main-color/10 text-main-color",
    indicator: "text-main-color",
    selected:
      "data-[selected]:border-main-color data-[selected]:bg-main-color/5",
  },
  {
    value: "rejected",
    icon: LuXCircle,
    iconTone: "bg-red-50 text-red-600",
    indicator: "text-red-600",
    selected: "data-[selected]:border-red-600 data-[selected]:bg-red-50",
  },
];

/** Overall result, reason, attachments and evaluator sign-off for the round. */
function EvaluationSummary({
  data,
  onChange,
  files,
  onAddFiles,
  onRemoveFile,
  approvedCount,
  rejectedCount,
  evaluatedBy,
  evaluatedDate,
}: EvaluationSummaryProps) {
  return (
    <section aria-labelledby="evaluation-summary-title" className="card">
      <div className="card-header">
        <div className="min-w-0">
          <h3 id="evaluation-summary-title" className="card-title">
            สรุปผลการประเมิน
          </h3>
          <p className="text-sm text-super-main-color/80">
            ตอบ ใช่ <span className="tabular-nums">{approvedCount}</span> ข้อ ·
            ไม่ใช่ <span className="tabular-nums">{rejectedCount}</span> ข้อ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 py-5 sm:px-5">
        {evaluatedBy && (
          <div className="rounded-lg border border-third-color bg-fourth-color/60 p-4">
            <p className="text-xs font-medium text-super-main-color/80">
              ประเมินโดย
            </p>
            <p className="break-words font-semibold">
              {evaluatedBy.firstName} {evaluatedBy.lastName}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
              <li className="flex min-w-0 items-center gap-2">
                <LuMail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-fifth-color"
                />
                <span className="sr-only">อีเมล</span>
                <span className="min-w-0 break-all">{evaluatedBy.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <LuPhone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-fifth-color"
                />
                <span className="sr-only">โทรศัพท์</span>
                <span className="tabular-nums">{evaluatedBy.phone}</span>
              </li>
              {evaluatedDate && (
                <li className="flex items-center gap-2">
                  <LuCalendarDays
                    aria-hidden="true"
                    className="size-4 shrink-0 text-fifth-color"
                  />
                  ประเมินเมื่อวันที่ {evaluatedDate}
                </li>
              )}
            </ul>
          </div>
        )}

        <RadioGroup
          isRequired
          value={radioValue(data?.status)}
          onChange={(status) =>
            onChange({ status: status as StatusEvaluation })
          }
          className="group flex flex-col gap-2"
        >
          <Label className="label">ผลการประเมิน</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {resultOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className={`flex min-h-[4.5rem] cursor-pointer items-center gap-3 rounded-xl border-2 border-third-color bg-white p-4 transition
                  data-[focus-visible]:ring-2 data-[focus-visible]:ring-main-color
                  data-[focus-visible]:ring-offset-2 group-data-[invalid]:border-red-300 [&:not([data-selected]):hover]:border-fifth-color ${option.selected}`}
              >
                {({ isSelected }) => (
                  <>
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${option.iconTone}`}
                    >
                      <option.icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1 font-semibold">
                      {evaluationStatusLabels[option.value]}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-current" : "border-third-color"
                      } ${option.indicator}`}
                    >
                      {isSelected && (
                        <span className="size-2.5 rounded-full bg-current" />
                      )}
                    </span>
                  </>
                )}
              </Radio>
            ))}
          </div>
          <FieldError className="field-error">เลือกผลการประเมิน</FieldError>
        </RadioGroup>

        <TextField
          value={data?.reason ?? ""}
          onChange={(reason) => onChange({ reason })}
          className="flex flex-col gap-1.5"
        >
          <Label className="label">เนื่องจาก</Label>
          <TextArea
            rows={4}
            placeholder="ข้อเสนอแนะ"
            className="input h-auto min-h-28 resize-y py-2 leading-relaxed"
          />
        </TextField>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 id="evaluation-attachments-title" className="label">
              ไฟล์แนบ
            </h4>
            <FileTrigger allowsMultiple onSelect={onAddFiles}>
              <Button className="btn btn-secondary">
                <LuUpload aria-hidden="true" className="size-4" />
                อัปโหลดไฟล์แนบ
              </Button>
            </FileTrigger>
          </div>
          {files.length > 0 ? (
            <ul
              aria-labelledby="evaluation-attachments-title"
              className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
            >
              {files.map((file, index) => (
                <FileOnListFormEvaluation
                  key={file.id ?? `${index}-${file.url}`}
                  name={
                    (file.id ? fileNameFromUrl(file.url) : file.file?.name) ??
                    ""
                  }
                  href={file.url}
                  onRemove={() => onRemoveFile(file)}
                  isUnsaved={!file.id}
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-third-color px-4 py-3 text-sm text-super-main-color/70">
              ยังไม่มีไฟล์แนบ
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="label">ผู้ประเมิน</h4>
          <EvaluatorFields data={data} onChange={onChange} />
        </div>
      </div>
    </section>
  );
}

export default EvaluationSummary;
