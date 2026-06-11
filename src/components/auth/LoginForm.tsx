"use client";

import AuthShell from "@/components/auth/AuthShell";
import { IconPinVisibility } from "@/components/common/icons";
import { Button } from "@/components/common/Button";
import { formConfig } from "@/config/auth.config";
import { authLabelFont } from "@/config/fonts";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

type FormErrors = {
  email?: string;
  password?: string;
};

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

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
    <AuthShell
      title={formConfig.welcome.title}
      subtitle="Enter your credentials to access the portal"
      loading={loading}
    >
      {resetSuccess ? (
        <div
          className="mb-4 rounded-lg border border-[#badbcc] bg-[#d1e7dd] px-4 py-3 text-sm leading-relaxed text-[#0f5132]"
          role="status"
        >
          Your password has been reset. Sign in with your new password.
        </div>
      ) : null}

      <form id="frmLogin" onSubmit={handleSubmit} noValidate>
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
          <div className="mb-2 flex items-center justify-between gap-2">
            <label htmlFor="Password" className="block text-[#181512]" style={authLabelFont}>
              Password<span className="text-[#dc3545]"> *</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#d36838] no-underline hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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
      </form>
    </AuthShell>
  );
}

function LoginFormFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#e0e0db] px-3">
      <div className="h-[50px] w-[50px] animate-spin rounded-full border-[7px] border-[#f3f3f3] border-t-[#d36838]" />
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormContent />
    </Suspense>
  );
}
