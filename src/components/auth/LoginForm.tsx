"use client";

import { IconPinVisibility } from "@/components/common/icons";
import { formConfig } from "@/config/auth.config";
import { assetPath } from "@/config/site";
import { Lock, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FormErrors = {
  email?: string;
  pin?: string;
};

const boldFont = { fontFamily: "Muli-Bold, Arial, sans-serif" };
const semiBoldFont = { fontFamily: "Muli-SemiBold, Arial, sans-serif" };

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@fhl.com");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!pin.trim()) {
      nextErrors.pin = "PIN is required.";
    } else if (!/^\d{4}$/.test(pin.trim())) {
      nextErrors.pin = "PIN must be exactly 4 digits.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.push("/auction");
    }, 600);
  };

  return (
    <>
      <div
        id="loader"
        className={`fixed inset-0 z-[9999] items-center justify-center bg-black/50 ${loading ? "flex" : "hidden"}`}
      >
        <div className="h-[50px] w-[50px] animate-spin rounded-full border-[7px] border-[#f3f3f3] border-t-[#d36838]" />
      </div>

      <div
        className="flex h-dvh items-center justify-center overflow-hidden bg-[#e0e0db] px-3 text-[#181512]"
        style={{ fontFamily: "Muli, Arial, sans-serif" }}
      >
        <form id="frmLogin" onSubmit={handleSubmit} noValidate className="w-full max-w-[460px]">
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
              <h1 className="mb-0.5 mt-2 text-xl leading-tight text-[#181512] sm:mt-2.5 sm:text-[1.35rem]" style={boldFont}>
                {formConfig.welcome.title}
              </h1>
              <p className="text-[13px] text-[#8a8680]">Enter your credentials to access the portal</p>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:py-4">

              <div className="mb-3">
                <label htmlFor="Email" className="mb-1.5 block text-[11px] tracking-wide text-[#181512]" style={semiBoldFont}>
                  EMAIL<span className="text-[#dc3545]"> *</span>
                </label>
                <div className="flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
                  <span className="flex items-center px-3 text-[#a8a49e]">
                    <Mail size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-3 text-sm outline-none sm:py-3"
                    autoComplete="email"
                    autoFocus
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                  />
                </div>
                <div className="mt-1 w-full text-sm text-[#dc3545]" id="emailError" role="alert">
                  {errors.email}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="PIN" className="mb-1.5 block text-[11px] tracking-wide text-[#181512]" style={semiBoldFont}>
                  PIN<span className="text-[#dc3545]"> *</span>
                </label>
                <div className="relative flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
                  <span className="flex items-center px-3 text-[#a8a49e]">
                    <Lock size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <input
                    type={showPin ? "text" : "password"}
                    id="PIN"
                    name="PIN"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-11 text-sm outline-none sm:py-3"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="\d{4}"
                    required
                    value={pin}
                    onChange={(event) => {
                      const nextPin = event.target.value.replace(/\D/g, "").slice(0, 4);
                      setPin(nextPin);
                      if (errors.pin) setErrors((prev) => ({ ...prev, pin: undefined }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer bg-transparent p-0"
                    onClick={() => setShowPin((prev) => !prev)}
                    aria-label="Toggle PIN visibility"
                  >
                    <IconPinVisibility visible={showPin} />
                  </button>
                </div>
                <div className="mt-1 w-full text-sm text-[#dc3545]" id="pinError" role="alert">
                  {errors.pin}
                </div>
              </div>

              <div className="mb-4 text-sm">
                <label className="inline-flex cursor-pointer items-center gap-2 text-[#181512]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer accent-[#d36838]"
                    checked={keepSignedIn}
                    onChange={(event) => setKeepSignedIn(event.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                id="btnSubmit"
                className="w-full rounded-lg border border-[#d36838] bg-[#d36838] px-5 py-2.5 text-white transition-colors hover:border-[#bb5c2f] hover:bg-[#bb5c2f] focus:border-[#bb5c2f] focus:bg-[#bb5c2f] disabled:cursor-not-allowed disabled:border-[#e0e0db] disabled:bg-[#e0e0db] disabled:text-[#6c757d] sm:py-3"
                style={boldFont}
                disabled={loading}
              >
                Login &rarr;
              </button>

              <div className="mt-3 border-t border-[#ececea] pt-2.5 text-center text-xs leading-relaxed text-[#8a8680] sm:pt-3" style={semiBoldFont}>
                {formConfig.branding.copyright}
                <br />
                Powered by{" "}
                <a className="text-[#d36838] no-underline" href="https://www.devdigital.com/" target="_blank" rel="noopener">
                  Navam Tech
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
