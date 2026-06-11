"use client";

import AuthShell from "@/components/auth/AuthShell";
import {
  checkPasswordRules,
  getStrengthLabel,
  isPasswordStrong,
  PASSWORD_REQUIREMENTS,
} from "@/components/auth/passwordValidation";
import { Button, ButtonLink } from "@/components/common/Button";
import { IconPinVisibility } from "@/components/common/icons";
import { authLabelFont } from "@/config/fonts";
import { ArrowLeft, Check, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type FormErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs sm:text-sm ${met ? "text-[#0f5132]" : "text-[#6b6762]"}`}>
      <span
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          met ? "border-[#198754] bg-[#198754] text-white" : "border-[#ced4da] bg-white text-transparent"
        }`}
        aria-hidden
      >
        <Check size={10} strokeWidth={3} />
      </span>
      <span className={met ? "font-medium" : undefined}>{label}</span>
    </li>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordRules = useMemo(() => checkPasswordRules(newPassword), [newPassword]);
  const strength = useMemo(() => getStrengthLabel(passwordRules), [passwordRules]);
  const metCount = PASSWORD_REQUIREMENTS.filter((req) => passwordRules[req.key]).length;
  const passwordsMatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (!isPasswordStrong(passwordRules)) {
      nextErrors.newPassword = "Password does not meet all requirements.";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      router.push("/login?reset=success");
    }, 600);
  };

  if (!token) {
    return (
      <AuthShell
        title="Invalid reset link"
        subtitle="This password reset link is missing or has expired."
      >
        <div
          className="mb-4 rounded-lg border border-[#f5c2c7] bg-[#f8d7da] px-4 py-3 text-sm leading-relaxed text-[#842029]"
          role="alert"
        >
          Request a new reset link to continue.
        </div>

        <ButtonLink href="/forgot-password" variant="primary" layout="block">
          Request new link &rarr;
        </ButtonLink>

        <div className="mt-4 border-t border-[#e0ded9] pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d36838] no-underline hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Choose a new password for your account."
      loading={loading}
    >
      <form id="frmResetPassword" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="NewPassword" className="mb-2 block text-[#181512]" style={authLabelFont}>
            New password<span className="text-[#dc3545]"> *</span>
          </label>
          <div className="relative flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
            <span className="flex items-center px-3 text-[#a8a49e]">
              <Lock size={16} strokeWidth={2} aria-hidden />
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              id="NewPassword"
              name="NewPassword"
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-11 text-[0.9375rem] outline-none sm:py-3"
              autoComplete="new-password"
              autoFocus
              required
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer bg-transparent p-0"
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label="Toggle new password visibility"
            >
              <IconPinVisibility visible={showNewPassword} />
            </button>
          </div>
          <div className="mt-1 w-full text-sm text-[#dc3545]" role="alert">
            {errors.newPassword}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="ConfirmPassword" className="mb-2 block text-[#181512]" style={authLabelFont}>
            Confirm password<span className="text-[#dc3545]"> *</span>
          </label>
          <div className="relative flex overflow-hidden rounded-lg border border-[#d36838] bg-white focus-within:border-[#bb5c2f]">
            <span className="flex items-center px-3 text-[#a8a49e]">
              <Lock size={16} strokeWidth={2} aria-hidden />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="ConfirmPassword"
              name="ConfirmPassword"
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-11 text-[0.9375rem] outline-none sm:py-3"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer bg-transparent p-0"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label="Toggle confirm password visibility"
            >
              <IconPinVisibility visible={showConfirmPassword} />
            </button>
          </div>
          <div className="mt-1 w-full text-sm text-[#dc3545]" role="alert">
            {errors.confirmPassword}
          </div>
        </div>

        <aside
          className="mb-4 rounded-lg border border-[#e4e4e0] bg-[#fafaf8] p-3 sm:p-4"
          aria-label="Password requirements"
        >
          <div className="mb-3 flex items-center gap-2 border-b border-[#ececea] pb-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff5f0] text-[#d36838]">
              <ShieldCheck size={14} strokeWidth={2} aria-hidden />
            </span>
            <p className="m-0 text-sm text-[#181512]" style={authLabelFont}>
              Password requirements
            </p>
          </div>

          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="m-0 text-xs font-medium text-[#181512]">Password strength</p>
              <span className={`text-xs font-medium ${strength.textClass}`}>{strength.label}</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#e9ecef]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={metCount}
              aria-label="Password strength"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.barClass}`}
                style={{ width: `${(metCount / 4) * 100}%` }}
              />
            </div>
          </div>

          <ul className="m-0 list-none space-y-2 p-0" aria-live="polite">
            {PASSWORD_REQUIREMENTS.map((req) => (
              <RequirementItem key={req.key} met={passwordRules[req.key]} label={req.label} />
            ))}
            <RequirementItem
              met={passwordsMatch}
              label={confirmPassword.trim() ? "Passwords match" : "Passwords must match"}
            />
          </ul>
        </aside>

        <Button type="submit" variant="primary" layout="block" disabled={loading}>
          Reset password &rarr;
        </Button>

        <div className="mt-4 border-t border-[#e0ded9] pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d36838] no-underline hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
            Back to login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
