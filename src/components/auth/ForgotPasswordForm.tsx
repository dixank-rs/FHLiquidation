"use client";

import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/common/Button";
import { authLabelFont } from "@/config/fonts";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type FormErrors = {
  email?: string;
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
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
      setSubmittedEmail(email.trim());
    }, 600);
  };

  if (submittedEmail) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="If an account exists for that address, we sent password reset instructions."
        loading={loading}
      >
        <div
          className="mb-4 rounded-lg border border-[#badbcc] bg-[#d1e7dd] px-4 py-3 text-sm leading-relaxed text-[#0f5132]"
          role="status"
        >
          We sent a reset link to <span className="font-medium">{submittedEmail}</span>. The link expires in 1 hour.
          Check your inbox and spam folder.
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[#6b6762]">
          Did not receive the email?{" "}
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#d36838] hover:underline"
            onClick={() => {
              setSubmittedEmail(null);
              setErrors({});
            }}
          >
            Try again
          </button>
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d36838] no-underline hover:underline"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          Back to login
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email to reset your password."
      loading={loading}
    >
      <form id="frmForgotPassword" onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
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
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </div>
          <div className="mt-1 w-full text-sm text-[#dc3545]" role="alert">
            {errors.email}
          </div>
        </div>

        <Button type="submit" variant="primary" layout="block" disabled={loading}>
          Send reset link &rarr;
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
