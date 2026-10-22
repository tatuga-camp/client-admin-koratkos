import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
};

/** Page numbers to show, with "gap" markers collapsing long runs. */
const getPageItems = (page: number, pageCount: number) => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < pageCount - 1) items.push("gap");
  items.push(pageCount);
  return items;
};

function Pagination({ page, pageCount, onChange, className = "" }: PaginationProps) {
  if (pageCount <= 1) return null;
  const items = getPageItems(page, pageCount);

  return (
    <nav
      aria-label="เลือกหน้า"
      className={`flex items-center justify-between gap-3 ${className}`}
    >
      <p className="text-sm text-super-main-color/80">
        หน้า {page} จาก {pageCount}
      </p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="หน้าก่อนหน้า"
            className="btn btn-ghost btn-icon btn-sm w-8"
          >
            <LuChevronLeft className="size-4" />
          </button>
        </li>
        {items.map((item, index) =>
          item === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="hidden w-8 text-center text-sm text-super-main-color/60 sm:block"
            >
              …
            </li>
          ) : (
            <li key={item} className={item === page ? "" : "hidden sm:block"}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                className={`btn btn-sm w-8 px-0 ${
                  item === page ? "btn-primary" : "btn-ghost font-medium"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="หน้าถัดไป"
            className="btn btn-ghost btn-icon btn-sm w-8"
          >
            <LuChevronRight className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
