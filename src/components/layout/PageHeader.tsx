import type { ReactNode } from "react";

const titleFont = { fontFamily: '"Muli-Bold", Arial, sans-serif' } as const;

type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({ title, actions, className = "" }: PageHeaderProps) {
  return (
    <div
      className={[
        "mb-[var(--fhi-page-gap)] flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h1
        className="m-0 min-w-0 flex-1 break-words text-2xl font-bold leading-tight text-[#d36838] sm:text-[1.75rem] sm:leading-none"
        style={titleFont}
      >
        {title}
      </h1>
      {actions ? (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end sm:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
