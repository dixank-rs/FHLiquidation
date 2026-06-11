"use client";

import { IconPinVisibility } from "@/components/common/icons";
import { Button } from "@/components/common/Button";
import { formConfig } from "@/config/auth.config";
import { authFontRegular, authLabelFont, authTitleFont } from "@/config/fonts";
import { assetPath } from "@/config/site";
import { Lock, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@fhl.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
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
        style={authFontRegular}
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
              <h1
                className="mb-1 mt-3 text-[1.375rem] leading-tight text-[#181512] sm:mt-3.5 sm:text-2xl"
                style={authTitleFont}
              >
                {formConfig.welcome.title}
              </h1>
              <p className="text-sm leading-relaxed text-[#6b6762]">
                Enter your credentials to access the portal
              </p>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:py-4">

              <div className="mb-3">
                <label htmlFor="Email" className="mb-2 block text-[#181512]" style={authLabelFont}>
                  Email<span className="text-[#dc3545]"> *</span>
                </label>
                <div className="flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
                  <span className="flex items-center px-3 text-[#a8a49e]">
                    <Mail size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-3 text-[0.9375rem] outline-none sm:py-3"
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
                <label htmlFor="Password" className="mb-2 block text-[#181512]" style={authLabelFont}>
                  Password<span className="text-[#dc3545]"> *</span>
                </label>
                <div className="relative flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
                  <span className="flex items-center px-3 text-[#a8a49e]">
                    <Lock size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    name="Password"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-11 text-[0.9375rem] outline-none sm:py-3"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer bg-transparent p-0"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    <IconPinVisibility visible={showPassword} />
                  </button>
                </div>
                <div className="mt-1 w-full text-sm text-[#dc3545]" id="passwordError" role="alert">
                  {errors.password}
                </div>
              </div>

              <div className="mb-4 text-[0.9375rem]">
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

              <Button type="submit" id="btnSubmit" variant="primary" layout="block" disabled={loading}>
                Login &rarr;
              </Button>

              <div className="mt-3 border-t border-[#e0ded9] pt-3 text-center text-sm leading-relaxed text-[#6b6762] sm:pt-3.5">
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
        </form>
      </div>
    </>
  );
}
