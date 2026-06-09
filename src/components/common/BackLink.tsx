import { ButtonLink } from "@/components/common/Button";
import { IconChevronLeft } from "@/components/common/icons";
import type { ReactNode } from "react";

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <ButtonLink
      href={href}
      variant="outline"
      size="sm"
      className={["shrink-0 gap-1", className].filter(Boolean).join(" ")}
    >
      <IconChevronLeft className="shrink-0 text-current" size={18} />
      <span>{children}</span>
    </ButtonLink>
  );
}
