import React from "react";
import { IconType } from "react-icons/lib";
import { LuClipboardCheck } from "react-icons/lu";

type MenuCardEvaluationFarmerProps = {
  card: {
    title: string;
    description: string;
    button: string;
    icon?: IconType;
  };
  index: number;
  selectMenu: number;
  setSelectMenu: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * One tab of the KOS-01…KOS-06 document switcher. The parent renders the
 * `role="tablist"` container and the single `#kos-tabpanel`.
 */
function MenuCardEvaluationFarmer({
  card,
  index,
  selectMenu,
  setSelectMenu,
}: MenuCardEvaluationFarmerProps) {
  const selected = selectMenu === index;
  const isEvaluation = card.title === "KOS-06";

  return (
    <button
      type="button"
      role="tab"
      id={`kos-tab-${index}`}
      aria-selected={selected}
      aria-controls="kos-tabpanel"
      tabIndex={selected ? 0 : -1}
      onClick={() => setSelectMenu(() => index)}
      className={`relative flex min-w-36 flex-1 basis-0 snap-start flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color
        ${
          selected
            ? "bg-white text-super-main-color shadow-sm ring-1 ring-third-color after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-main-color"
            : "text-super-main-color/80 hover:bg-white/70 hover:text-super-main-color"
        }`}
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        {card.title}
        {isEvaluation && (
          <LuClipboardCheck aria-hidden="true" className="size-4 text-main-color" />
        )}
      </span>
      <span className="line-clamp-1 w-full text-xs">{card.description}</span>
    </button>
  );
}

export default MenuCardEvaluationFarmer;
