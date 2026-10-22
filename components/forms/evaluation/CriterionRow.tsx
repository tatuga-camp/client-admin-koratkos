import React from "react";
import {
  Button,
  FieldError,
  FileTrigger,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
} from "react-aria-components";
import { LuCheck, LuPaperclip, LuX } from "react-icons/lu";
import { StatusEvaluation } from "../../../model";
import FileOnListFormEvaluation from "../FileOnListFormEvaluation";
import { fileNameFromUrl, ListFormEvaluationState, radioValue } from "./types";

type CriterionRowProps = {
  id: string;
  order: string;
  title: string;
  listFormEvaluation?: ListFormEvaluationState;
  onStatusChange: (status: StatusEvaluation) => void;
  onSuggestionChange: (suggestion: string) => void;
  onAddFiles: (files: File[]) => void;
  /** Index into `listFormEvaluation.files` (not uploaded yet). */
  onRemoveFile: (index: number) => void;
  /** Deletes an uploaded file. */
  onRemoveUploadedFile: (fileOnListFormEvaluationId: string) => void;
};

const answerClass =
  "flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-super-main-color/80 transition " +
  "[&:not([data-selected]):hover]:bg-white/70 [&:not([data-selected]):hover]:text-super-main-color " +
  "data-[focus-visible]:ring-2 data-[focus-visible]:ring-main-color data-[focus-visible]:ring-offset-1 " +
  "data-[selected]:font-semibold data-[selected]:text-white data-[selected]:shadow-sm";

const rowAccent: Record<StatusEvaluation, string> = {
  pending: "border-l-transparent",
  approved: "border-l-main-color",
  rejected: "border-l-red-600",
};

/** One checklist criterion: text, yes/no answer, suggestion and evidence files. */
function CriterionRow({
  id,
  order,
  title,
  listFormEvaluation,
  onStatusChange,
  onSuggestionChange,
  onAddFiles,
  onRemoveFile,
  onRemoveUploadedFile,
}: CriterionRowProps) {
  const titleId = `criterion-${id}-title`;
  const status = listFormEvaluation?.status ?? "pending";
  const pendingFiles = listFormEvaluation?.files ?? [];
  const uploadedFiles = listFormEvaluation?.fileOnListFormEvaluations ?? [];

  return (
    <li
      className={`border-l-4 border-t border-t-third-color px-4 py-4 first:border-t-0 sm:px-5 ${rowAccent[status]}`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        <p
          id={titleId}
          className="min-w-0 flex-1 break-words text-sm leading-relaxed sm:text-base"
        >
          <span className="font-semibold tabular-nums">{order}</span> {title}
        </p>
        <RadioGroup
          aria-labelledby={titleId}
          name={id}
          isRequired
          orientation="horizontal"
          value={radioValue(listFormEvaluation?.status)}
          onChange={(value) => onStatusChange(value as StatusEvaluation)}
          className="group flex flex-col gap-1 md:w-52 md:shrink-0"
        >
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-third-color/60 p-1 group-data-[invalid]:ring-2 group-data-[invalid]:ring-red-600">
            <Radio
              value="approved"
              className={`${answerClass} data-[selected]:bg-main-color`}
            >
              <LuCheck aria-hidden="true" className="size-4" />
              ใช่
            </Radio>
            <Radio
              value="rejected"
              className={`${answerClass} data-[selected]:bg-red-600`}
            >
              <LuX aria-hidden="true" className="size-4" />
              ไม่ใช่
            </Radio>
          </div>
          <FieldError className="field-error">เลือก ใช่ หรือ ไม่ใช่</FieldError>
        </RadioGroup>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start">
        <TextField
          aria-label={`ข้อเสนอแนะ ข้อ ${order}`}
          value={listFormEvaluation?.suggestion ?? ""}
          onChange={onSuggestionChange}
          className="min-w-0 flex-1"
        >
          <TextArea
            rows={2}
            placeholder="ข้อเสนอแนะ (ถ้ามี)"
            className="input h-auto min-h-16 resize-y py-2 leading-relaxed"
          />
        </TextField>
        <FileTrigger
          allowsMultiple
          onSelect={(files) => {
            if (files) onAddFiles(Array.from(files));
          }}
        >
          <Button
            aria-label={`แนบไฟล์หลักฐาน ข้อ ${order}`}
            className="btn btn-secondary w-full sm:w-auto"
          >
            <LuPaperclip aria-hidden="true" className="size-4" />
            แนบไฟล์
          </Button>
        </FileTrigger>
      </div>

      {(pendingFiles.length > 0 || uploadedFiles.length > 0) && (
        <ul
          aria-label={`ไฟล์แนบ ข้อ ${order}`}
          className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
        >
          {pendingFiles.map((file, index) => (
            <FileOnListFormEvaluation
              key={`new-${index}-${file.name}`}
              name={file.name}
              onOpen={() => window.open(URL.createObjectURL(file), "_blank")}
              onRemove={() => onRemoveFile(index)}
              isUnsaved
            />
          ))}
          {uploadedFiles.map((file) => (
            <FileOnListFormEvaluation
              key={file.id}
              name={fileNameFromUrl(file.url)}
              href={file.url}
              onRemove={() => onRemoveUploadedFile(file.id)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CriterionRow;
