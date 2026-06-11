export type PasswordRules = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export const PASSWORD_REQUIREMENTS: Array<{ key: keyof PasswordRules; label: string }> = [
  { key: "hasUppercase", label: "At least 1 Uppercase" },
  { key: "hasLowercase", label: "At least 1 Lowercase" },
  { key: "hasNumber", label: "At least 1 Number" },
  { key: "hasSpecialChar", label: "At least 1 Special Character" },
];

export function checkPasswordRules(password: string): PasswordRules {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordStrong(rules: PasswordRules): boolean {
  return PASSWORD_REQUIREMENTS.every((req) => rules[req.key]);
}

export function getStrengthLabel(rules: PasswordRules): { label: string; barClass: string; textClass: string } {
  const metCount = PASSWORD_REQUIREMENTS.filter((req) => rules[req.key]).length;

  if (metCount === 4) {
    return { label: "Strong", barClass: "bg-[#198754]", textClass: "text-[#198754]" };
  }
  if (metCount >= 2) {
    return { label: "Fair", barClass: "bg-[#d36838]", textClass: "text-[#d36838]" };
  }
  return { label: "Weak", barClass: "bg-[#dc3545]", textClass: "text-[#dc3545]" };
}
