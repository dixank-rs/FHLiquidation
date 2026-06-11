import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#e0e0db] px-3">
      <div className="h-[50px] w-[50px] animate-spin rounded-full border-[7px] border-[#f3f3f3] border-t-[#d36838]" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
