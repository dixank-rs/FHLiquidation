"use client";

import { formConfig } from "@/config/auth.config";
import { authFontRegular, authTitleFont } from "@/config/fonts";
import { assetPath } from "@/config/site";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  loading?: boolean;
  children: ReactNode;
};

export default function AuthShell({ title, subtitle, loading = false, children }: AuthShellProps) {
  return (
    <>
      <div
        id="loader"
        className={`fixed inset-0 z-[9999] items-center justify-center bg-black/50 ${loading ? "flex" : "hidden"}`}
        aria-hidden={!loading}
      >
        <div className="h-[50px] w-[50px] animate-spin rounded-full border-[7px] border-[#f3f3f3] border-t-[#d36838]" />
      </div>

      <div
        className="flex min-h-dvh items-center justify-center overflow-hidden bg-[#e0e0db] px-3 py-6 text-[#181512]"
        style={authFontRegular}
      >
        <div className="w-full max-w-[460px]">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(24,21,18,0.08)]">
            <div
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, #5c3a21 0%, #a05a2c 45%, #d36838 100%)",
              }}
              aria-hidden
            />

            <div className="border-b border-[#ececea] px-4 pb-3 pt-3 text-center sm:px-6 sm:pb-4 sm:pt-3.5">
              <Image
                src={assetPath("/logo_transperent.png")}
                alt="FH Liquidation Auction Tool"
                width={240}
                height={72}
                priority
                className="mx-auto h-auto max-w-[200px] sm:max-w-[230px]"
              />
              <h1
                className="mb-1 mt-3 text-[1.375rem] leading-tight text-[#181512] sm:mt-3.5 sm:text-2xl"
                style={authTitleFont}
              >
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-[#6b6762]">{subtitle}</p>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:py-4">{children}</div>
          </div>

          <div className="mt-3 text-center text-sm leading-relaxed text-[#6b6762]">
            <p className="m-0">{formConfig.branding.copyright}</p>
            <p className="m-0 mt-1">
              Powered by{" "}
              <a
                className="font-medium text-[#d36838] no-underline hover:underline"
                href="https://www.devdigital.com/"
                target="_blank"
                rel="noopener"
              >
                Navam Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
