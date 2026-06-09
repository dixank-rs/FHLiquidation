import type { ReactNode } from "react";

import { titleFont } from "@/config/fonts";

type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({ title, actions, className = "" }: PageHeaderProps) {
  return (
    <div
      className={[
        "mb-[var(--fhi-page-gap)] flex w-full min-w-0 flex-row items-center justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h1
        className="m-0 min-w-0 flex-1 break-words text-left text-[1.375rem] text-[#d36838] sm:text-[1.625rem] lg:text-[1.75rem]"
        style={titleFont}
      >
        {title}
      </h1>
      {actions ? (
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
