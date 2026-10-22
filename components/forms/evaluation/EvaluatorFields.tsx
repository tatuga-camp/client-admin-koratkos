import React from "react";
import { FieldError, Input, Label, TextField } from "react-aria-components";
import { EvaluationSummaryData } from "./types";

type EvaluatorFieldsProps = {
  data?: EvaluationSummaryData;
  onChange: (patch: Partial<EvaluationSummaryData>) => void;
};

const evaluators = [
  {
    title: "ผู้ประเมินคนที่ 1",
    name: "first_evaluator_name",
    position: "first_evaluator_position",
  },
  {
    title: "ผู้ประเมินคนที่ 2",
    name: "second_evaluator_name",
    position: "second_evaluator_position",
  },
  {
    title: "ผู้ประเมินคนที่ 3",
    name: "third_evaluator_name",
    position: "third_evaluator_position",
  },
] as const;

/** Names and positions of the three evaluators who sign the round. */
function EvaluatorFields({ data, onChange }: EvaluatorFieldsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {evaluators.map((evaluator) => (
        <fieldset
          key={evaluator.title}
          className="flex min-w-0 flex-col gap-3 rounded-lg border border-third-color bg-fourth-color/50 p-4"
        >
          <legend className="float-left w-full text-sm font-semibold">
            {evaluator.title}
          </legend>
          <TextField
            isRequired
            value={data?.[evaluator.name] ?? ""}
            onChange={(value) => onChange({ [evaluator.name]: value })}
            className="flex flex-col gap-1.5"
          >
            <Label className="label">ชื่อ-นามสกุล</Label>
            <Input
              autoComplete="off"
              className="input data-[invalid]:border-red-600"
            />
            <FieldError className="field-error">
              กรอกชื่อ{evaluator.title}
            </FieldError>
          </TextField>
          <TextField
            isRequired
            value={data?.[evaluator.position] ?? ""}
            onChange={(value) => onChange({ [evaluator.position]: value })}
            className="flex flex-col gap-1.5"
          >
            <Label className="label">ตำแหน่ง</Label>
            <Input
              autoComplete="off"
              className="input data-[invalid]:border-red-600"
            />
            <FieldError className="field-error">
              กรอกตำแหน่ง{evaluator.title}
            </FieldError>
          </TextField>
        </fieldset>
      ))}
    </div>
  );
}

export default EvaluatorFields;
