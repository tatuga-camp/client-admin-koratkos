import React, { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links aligned to the right on wide screens. */
  actions?: ReactNode;
  /** Small element above the title, e.g. a back link. */
  eyebrow?: ReactNode;
};

function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-bold leading-tight text-super-main-color sm:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-super-main-color/80 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export default PageHeader;
