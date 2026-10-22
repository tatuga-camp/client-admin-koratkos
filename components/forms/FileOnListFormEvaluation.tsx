import React from "react";
import { LuFileText, LuX } from "react-icons/lu";
import StatusBadge from "../ui/StatusBadge";

type FileOnListFormEvaluationProps = {
  name: string;
  /** Opens the file in a new tab. */
  href?: string;
  /** Used instead of `href` for files that only exist in the browser. */
  onOpen?: () => void;
  onRemove: () => void;
  /** Picked but not uploaded yet; it is uploaded when the form is saved. */
  isUnsaved?: boolean;
};

const nameClass =
  "min-w-0 flex-1 truncate rounded text-left text-sm font-medium text-super-main-color underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color";

/** One attached file: icon, truncated name, optional "not saved" tag, remove button. */
function FileOnListFormEvaluation({
  name,
  href,
  onOpen,
  onRemove,
  isUnsaved = false,
}: FileOnListFormEvaluationProps) {
  const displayName = name || "ไฟล์แนบ";
  return (
    <li className="flex min-w-0 items-center gap-2 rounded-lg border border-third-color bg-fourth-color/60 py-0.5 pl-3 pr-0.5">
      <LuFileText
        aria-hidden="true"
        className="size-4 shrink-0 text-fifth-color"
      />
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={displayName}
          className={nameClass}
        >
          {displayName}
        </a>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          title={displayName}
          className={nameClass}
        >
          {displayName}
        </button>
      )}
      {isUnsaved && (
        <StatusBadge
          status="pending"
          label="ยังไม่บันทึก"
          className="shrink-0"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`ลบไฟล์ ${displayName}`}
        className="btn btn-ghost btn-icon"
      >
        <LuX aria-hidden="true" className="size-4" />
      </button>
    </li>
  );
}

export default FileOnListFormEvaluation;
