import type { ReactNode } from "react";

/** Shared horizontal bounds for header, page body, and footer. */
export const appContainerClass =
  "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12";

/** Standard white content panel on the page body background. */
export const contentPanelClass =
  "mb-8 min-w-0 overflow-hidden rounded-lg border border-[#e4e4e0] bg-white p-4 shadow-sm sm:p-5 lg:p-6";

type AppContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function AppContainer({ children, className = "" }: AppContainerProps) {
  return <div className={[appContainerClass, className].filter(Boolean).join(" ")}>{children}</div>;
}
