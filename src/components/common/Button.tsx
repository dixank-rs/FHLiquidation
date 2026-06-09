import { buttonFont } from "@/config/fonts";
import Link from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";
export type ButtonLayout = "inline" | "form" | "actionBar" | "block";

const baseClass =
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap border text-center leading-normal no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[#d36838] text-white hover:bg-[#bb5c2f] focus-visible:outline-[#d36838] disabled:border-[#e0e0db] disabled:bg-[#e0e0db] disabled:text-[#6c757d] disabled:opacity-100",
  secondary:
    "border-transparent bg-[#181512] text-white hover:bg-[#2a2825] focus-visible:outline-[#181512]",
  outline:
    "border-[#d36838] bg-white text-[#d36838] hover:bg-[#fdf6f3] focus-visible:outline-[#d36838]",
  ghost:
    "border-transparent bg-transparent text-[#181512] hover:bg-[#f1f1f1] focus-visible:outline-[#181512]",
};

const equalButtonWidth = "w-full xl:w-[12rem] xl:max-w-[12rem] xl:shrink-0";

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-[36px] rounded-[6px] px-4 py-1.5 text-sm",
  md: "min-h-[44px] rounded-[6px] px-5 py-2.5 text-base",
};

const layoutClass: Record<ButtonLayout, string> = {
  inline: "",
  form: equalButtonWidth,
  actionBar: `h-full min-h-[44px] ${equalButtonWidth}`,
  block: "w-full rounded-lg py-2.5 sm:py-3",
};

function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  layout?: ButtonLayout;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    layout = "inline",
    className,
    type = "button",
    style,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      suppressHydrationWarning
      className={cn(baseClass, variantClass[variant], sizeClass[size], layoutClass[layout], className)}
      style={{ ...buttonFont, ...style }}
      {...props}
    />
  );
});

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  layout?: ButtonLayout;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  layout = "inline",
  className,
  style,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      suppressHydrationWarning
      className={cn(baseClass, variantClass[variant], sizeClass[size], layoutClass[layout], className)}
      style={{ ...buttonFont, ...style }}
      {...props}
    >
      {children}
    </Link>
  );
}

type FormActionsProps = {
  children: ReactNode;
  className?: string;
};

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:gap-3 xl:flex xl:flex-row xl:flex-wrap xl:items-stretch xl:justify-center xl:gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ModalActionsProps = {
  children: ReactNode;
  className?: string;
};

export function ModalActions({ children, className }: ModalActionsProps) {
  return (
    <div className={cn("flex flex-col-reverse justify-end gap-2 border-t border-[#dee2e6] px-4 py-3 sm:flex-row", className)}>
      {children}
    </div>
  );
}
