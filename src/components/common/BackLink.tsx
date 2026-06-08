import { IconChevronLeft } from "@/components/common/icons";
import Link from "next/link";
import type { ReactNode } from "react";

const boldFont = { fontFamily: "Muli-Bold, Arial, sans-serif" } as const;

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-[36px] items-center gap-1 rounded-md border border-[#d4d4d0] bg-white px-3 py-1.5 text-sm text-[#181512] no-underline shadow-sm transition-colors",
        "hover:border-[#d36838] hover:bg-[#fdf6f3] hover:text-[#d36838]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d36838]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={boldFont}
    >
      <IconChevronLeft className="shrink-0 text-current" size={18} />
      <span>{children}</span>
    </Link>
  );
}
