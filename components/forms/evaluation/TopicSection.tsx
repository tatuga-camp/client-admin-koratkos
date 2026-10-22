import React from "react";
import { LuCheckCircle2 } from "react-icons/lu";
import { StatusEvaluation } from "../../../model";
import CriterionRow from "./CriterionRow";
import { ListFormEvaluationState } from "./types";

type TopicSectionProps = {
  topic: {
    id: string;
    order: string;
    title: string;
    childs: { id: string; order: string; title: string }[];
  };
  getListFormEvaluation: (
    childId: string,
  ) => ListFormEvaluationState | undefined;
  onStatusChange: (childId: string, status: StatusEvaluation) => void;
  onSuggestionChange: (childId: string, suggestion: string) => void;
  onAddFiles: (childId: string, files: File[]) => void;
  onRemoveFile: (childId: string, index: number) => void;
  onRemoveUploadedFile: (
    childId: string,
    fileOnListFormEvaluationId: string,
  ) => void;
};

/** A KOS-06 topic card listing its criteria. */
function TopicSection({
  topic,
  getListFormEvaluation,
  onStatusChange,
  onSuggestionChange,
  onAddFiles,
  onRemoveFile,
  onRemoveUploadedFile,
}: TopicSectionProps) {
  const titleId = `topic-${topic.id}-title`;
  const answered = topic.childs.filter(
    (child) =>
      (getListFormEvaluation(child.id)?.status ?? "pending") !== "pending",
  ).length;

  return (
    <section aria-labelledby={titleId} className="card overflow-hidden">
      <div className="card-header flex-nowrap items-start">
        <h3 id={titleId} className="card-title min-w-0 flex-1 break-words">
          <span className="tabular-nums">{topic.order}</span> {topic.title}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-sm font-medium tabular-nums text-super-main-color/80">
          {answered === topic.childs.length && (
            <LuCheckCircle2
              aria-hidden="true"
              className="size-4 text-main-color"
            />
          )}
          {answered}/{topic.childs.length}
          <span className="sr-only">ข้อที่ประเมินแล้ว</span>
        </span>
      </div>
      <ol>
        {topic.childs.map((child) => (
          <CriterionRow
            key={child.id}
            id={child.id}
            order={child.order}
            title={child.title}
            listFormEvaluation={getListFormEvaluation(child.id)}
            onStatusChange={(status) => onStatusChange(child.id, status)}
            onSuggestionChange={(suggestion) =>
              onSuggestionChange(child.id, suggestion)
            }
            onAddFiles={(files) => onAddFiles(child.id, files)}
            onRemoveFile={(index) => onRemoveFile(child.id, index)}
            onRemoveUploadedFile={(fileId) =>
              onRemoveUploadedFile(child.id, fileId)
            }
          />
        ))}
      </ol>
    </section>
  );
}

export default TopicSection;
