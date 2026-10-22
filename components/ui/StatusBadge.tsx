import React from "react";
import { StatusEvaluation } from "../../model";

type BadgeTone = StatusEvaluation | "none";

export const evaluationStatusLabels: Record<StatusEvaluation, string> = {
  pending: "รอการประเมิน",
  approved: "ผ่านการประเมิน",
  rejected: "ไม่ผ่านการประเมิน",
};

export const certificateStatusLabels: Record<StatusEvaluation, string> = {
  pending: "รอการพิจารณา",
  approved: "ผ่านการพิจารณา",
  rejected: "ไม่ผ่านการพิจารณา",
};

const toneClasses: Record<BadgeTone, { badge: string; dot: string }> = {
  pending: {
    badge: "bg-secondary-color/10 ring-secondary-color/30",
    dot: "bg-secondary-color",
  },
  approved: {
    badge: "bg-main-color/10 ring-main-color/30",
    dot: "bg-main-color",
  },
  rejected: { badge: "bg-red-50 text-red-800 ring-red-200", dot: "bg-red-600" },
  none: {
    badge: "bg-super-main-color/5 ring-super-main-color/15",
    dot: "bg-super-main-color/40",
  },
};

type StatusBadgeProps = {
  status?: StatusEvaluation | null;
  /** Text to show; defaults to the evaluation label for the status. */
  label?: string;
  className?: string;
};

/** Status pill: the colour sits in the dot, the text stays high-contrast. */
function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const tone = toneClasses[status ?? "none"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold text-super-main-color ring-1 ring-inset ${tone.badge} ${className}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${tone.dot}`} />
      {label ?? (status ? evaluationStatusLabels[status] : "ยังไม่ยื่นคำขอ")}
    </span>
  );
}

export default StatusBadge;
