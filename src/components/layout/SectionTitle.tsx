import type { ReactNode } from "react";

import { boldFont } from "@/config/fonts";

export const sectionTitleClassName =
  "text-center text-[1.0625rem] text-[#181512] sm:text-lg lg:text-[1.375rem]";

export const sectionTitleWrapClassName =
  "mb-4 flex min-h-[2.75rem] items-center justify-center border-b border-[#e9ecef] pb-3 sm:mb-5 sm:min-h-[3rem]";

type SectionTitleProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionTitle({ id, children, className = "" }: SectionTitleProps) {
  return (
    <div className={[sectionTitleWrapClassName, className].filter(Boolean).join(" ")}>
      <h2 id={id} className={["m-0", sectionTitleClassName].join(" ")} style={boldFont}>
        {children}
      </h2>
    </div>
  );
}
