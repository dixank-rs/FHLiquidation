"use client";

import { Button, FormActions } from "@/components/common/Button";
import { IconPinVisibility } from "@/components/common/icons";
import { labelFont } from "@/config/fonts";
import { Check, ShieldCheck } from "lucide-react";
import { FormEvent, useId, useMemo, useState } from "react";

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

type PasswordRules = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

type FormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const PASSWORD_REQUIREMENTS: Array<{ key: keyof PasswordRules; label: string }> = [
  { key: "hasUppercase", label: "At least 1 Uppercase" },
  { key: "hasLowercase", label: "At least 1 Lowercase" },
  { key: "hasNumber", label: "At least 1 Number" },
  { key: "hasSpecialChar", label: "At least 1 Special Character" },
];

function checkPasswordRules(password: string): PasswordRules {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
}

function isPasswordStrong(rules: PasswordRules): boolean {
  return PASSWORD_REQUIREMENTS.every((req) => rules[req.key]);
}

function getStrengthLabel(rules: PasswordRules): { label: string; barClass: string; textClass: string } {
  const metCount = PASSWORD_REQUIREMENTS.filter((req) => rules[req.key]).length;

  if (metCount === 4) {
    return { label: "Strong", barClass: "bg-[#198754]", textClass: "text-[#198754]" };
  }
  if (metCount >= 2) {
    return { label: "Fair", barClass: "bg-[#d36838]", textClass: "text-[#d36838]" };
  }
  return { label: "Weak", barClass: "bg-[#dc3545]", textClass: "text-[#dc3545]" };
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  error?: string;
  autoComplete: string;
  describedBy?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onToggleVisibility: () => void;
};

function PasswordField({
  id,
  label,
  value,
  visible,
  error,
  autoComplete,
  describedBy,
  onChange,
  onBlur,
  onToggleVisibility,
}: PasswordFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      <label className="mb-2 block text-[#181512]" style={labelFont} htmlFor={id}>
        {label}
        <span className="text-[#dc3545]">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={error ? "true" : "false"}
          aria-describedby={ariaDescribedBy}
          className={`${inputBaseClass} pr-10 ${error ? "border-[#dc3545]" : "border-[#ced4da]"}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={onToggleVisibility}
        >
          <IconPinVisibility visible={visible} />
        </button>
      </div>
      {error ? (
        <div id={errorId} className="mt-1 text-sm text-[#dc3545]" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

type RequirementItemProps = {
  met: boolean;
  label: string;
};

function RequirementItem({ met, label }: RequirementItemProps) {
  return (
    <li className={`flex items-center gap-2.5 text-sm transition-colors ${met ? "text-[#0f5132]" : "text-[#6b6762]"}`}>
      <span
        className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
          met ? "border-[#198754] bg-[#198754] text-white" : "border-[#ced4da] bg-white text-transparent"
        }`}
        aria-hidden
      >
        <Check size={11} strokeWidth={3} />
      </span>
      <span className={met ? "font-medium" : undefined}>{label}</span>
    </li>
  );
}

type PasswordRequirementsPanelProps = {
  id: string;
  passwordRules: PasswordRules;
  strength: ReturnType<typeof getStrengthLabel>;
  metCount: number;
};

function PasswordRequirementsPanel({
  id,
  passwordRules,
  strength,
  metCount,
}: PasswordRequirementsPanelProps) {
  const allMet = isPasswordStrong(passwordRules);

  return (
    <aside
      id={id}
      className="rounded-lg border border-[#e4e4e0] bg-[#fafaf8] p-4 sm:p-5"
      aria-label="Password requirements"
    >
      <div className="mb-4 flex items-center gap-2.5 border-b border-[#ececea] pb-4">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff5f0] text-[#d36838]">
          <ShieldCheck size={16} strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="m-0 text-sm text-[#181512] sm:text-base" style={labelFont}>
            Password Requirements
          </h2>
          <p className="mb-0 mt-0.5 text-xs leading-snug text-[#6b6762] sm:text-sm">
            Meet all criteria to create a strong password.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="m-0 text-xs font-medium text-[#181512] sm:text-sm">Password strength</p>
          <span className={`text-xs font-medium sm:text-sm ${strength.textClass}`}>{strength.label}</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-[#e9ecef] sm:h-2"
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

      <ul className="m-0 list-none space-y-2.5 p-0" aria-live="polite" aria-atomic="true">
        {PASSWORD_REQUIREMENTS.map((req) => (
          <RequirementItem key={req.key} met={passwordRules[req.key]} label={req.label} />
        ))}
      </ul>

      {allMet ? (
        <p className="mb-0 mt-4 rounded-[5px] border border-[#badbcc] bg-[#d1e7dd] px-3 py-2 text-xs font-medium text-[#0f5132] sm:text-sm">
          Your password meets all requirements.
        </p>
      ) : null}
    </aside>
  );
}

export default function ChangePasswordForm() {
  const requirementsPanelId = useId();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [currentBlurred, setCurrentBlurred] = useState(false);
  const [newBlurred, setNewBlurred] = useState(false);
  const [confirmBlurred, setConfirmBlurred] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordRules = useMemo(() => checkPasswordRules(newPassword), [newPassword]);
  const strength = useMemo(() => getStrengthLabel(passwordRules), [passwordRules]);
  const metCount = PASSWORD_REQUIREMENTS.filter((req) => passwordRules[req.key]).length;

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (!isPasswordStrong(passwordRules)) {
      nextErrors.newPassword = "New password does not meet all requirements.";
    } else if (newPassword === currentPassword) {
      nextErrors.newPassword = "New password must be different from your current password.";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const currentError =
    errors.currentPassword ??
    (submitAttempted || currentBlurred
      ? !currentPassword.trim()
        ? "Current password is required."
        : undefined
      : undefined);

  const newError =
    errors.newPassword ??
    (submitAttempted || newBlurred
      ? !newPassword.trim()
        ? "New password is required."
        : !isPasswordStrong(passwordRules)
          ? "New password does not meet all requirements."
          : newPassword === currentPassword
            ? "New password must be different from your current password."
            : undefined
      : undefined);

  const confirmError =
    errors.confirmPassword ??
    (submitAttempted || confirmBlurred
      ? !confirmPassword.trim()
        ? "Confirm password is required."
        : confirmPassword !== newPassword
          ? "Passwords do not match."
          : undefined
      : undefined);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setSubmitAttempted(false);
    setCurrentBlurred(false);
    setNewBlurred(false);
    setConfirmBlurred(false);
    setErrors({});
    setSuccessMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSuccessMessage(null);

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setSubmitAttempted(false);
    setCurrentBlurred(false);
    setNewBlurred(false);
    setConfirmBlurred(false);
    setErrors({});
    setSuccessMessage("Password updated successfully.");
  };

  const requirementsPanel = (
    <PasswordRequirementsPanel
      id={requirementsPanelId}
      passwordRules={passwordRules}
      strength={strength}
      metCount={metCount}
    />
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-8">
        <div className="flex min-w-0 flex-col gap-6">
          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            visible={showCurrent}
            error={currentError}
            autoComplete="current-password"
            onChange={(value) => {
              setCurrentPassword(value);
              if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }}
            onBlur={() => setCurrentBlurred(true)}
            onToggleVisibility={() => setShowCurrent((prev) => !prev)}
          />
          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            visible={showNew}
            error={newError}
            autoComplete="new-password"
            describedBy={requirementsPanelId}
            onChange={(value) => {
              setNewPassword(value);
              if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
            }}
            onBlur={() => setNewBlurred(true)}
            onToggleVisibility={() => setShowNew((prev) => !prev)}
          />

          <div className="lg:hidden">{requirementsPanel}</div>

          <PasswordField
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            visible={showConfirm}
            error={confirmError}
            autoComplete="new-password"
            describedBy={requirementsPanelId}
            onChange={(value) => {
              setConfirmPassword(value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            onBlur={() => setConfirmBlurred(true)}
            onToggleVisibility={() => setShowConfirm((prev) => !prev)}
          />

          {successMessage ? (
            <div
              className="rounded-[5px] border border-[#badbcc] bg-[#d1e7dd] px-3 py-2.5 text-sm text-[#0f5132]"
              role="status"
            >
              {successMessage}
            </div>
          ) : null}

          <FormActions className="grid-cols-2 lg:justify-start">
            <Button type="submit" variant="primary" layout="form">
              Save
            </Button>
            <Button type="button" variant="secondary" layout="form" onClick={resetForm}>
              Reset
            </Button>
          </FormActions>
        </div>

        <div className="hidden min-w-0 lg:flex lg:items-center lg:border-l lg:border-[#ececea] lg:pl-8">
          <div className="w-full">{requirementsPanel}</div>
        </div>
      </div>
    </form>
  );
}
