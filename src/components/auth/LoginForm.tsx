"use client";

import { IconPinVisibility } from "@/components/common/icons";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FormErrors = {
  email?: string;
  pin?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@fhl.com");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
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
        className="flex min-h-screen items-center overflow-auto bg-white text-[#181512]"
        style={{ fontFamily: "Muli, Arial, sans-serif" }}
      >
        <div className="mx-auto w-full max-w-[1140px] px-3">
          <form id="frmLogin" onSubmit={handleSubmit} noValidate>
            <div className="flex justify-center">
              <div className="mb-4 mt-10 w-full max-w-full lg:mt-16">
                <div className="mx-auto w-full max-w-[550px] rounded-3xl border border-[#cbcbcb] bg-[#e0e0db] p-3 sm:p-12">
                  <div className="mb-3 text-center">
                    <Image
                      src="/theme/images/logo.png"
                      alt="FH Liquidation Auction Tool"
                      width={300}
                      height={80}
                      priority
                      className="mx-auto h-auto max-w-full"
                    />
                  </div>

                  <div className="my-10 text-center sm:my-12">
                    <h1
                      className="mb-0 text-[2rem] leading-tight text-[#d36838]"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                    >
                      Welcome back!
                    </h1>
                    <small>Login to continue</small>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="Email"
                      className="mb-2 inline-block"
                      style={{ fontFamily: "Muli-SemiBold, Arial, sans-serif" }}
                    >
                      Email<span className="text-[#dc3545]">*</span>
                    </label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      className="w-full rounded-[5px] border border-[#cbcbcb] bg-white px-2 py-[0.7rem] outline-none focus:border-[#d36838]"
                      autoComplete="email"
                      autoFocus
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                    />
                    <div className="mt-1 w-full text-sm text-[#dc3545]" id="emailError" role="alert">
                      {errors.email}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="PIN"
                      className="mb-2 inline-block"
                      style={{ fontFamily: "Muli-SemiBold, Arial, sans-serif" }}
                    >
                      Pin<span className="text-[#dc3545]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        id="PIN"
                        name="PIN"
                        className="w-full rounded-[5px] border border-[#cbcbcb] bg-white px-2 py-[0.7rem] pr-11 outline-none focus:border-[#d36838]"
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
                        className="absolute right-[15px] top-[15px] inline-flex cursor-pointer bg-transparent p-0"
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

                  <div className="mb-3">
                    <button
                      type="submit"
                      id="btnSubmit"
                      className="w-full rounded-md border border-[#d36838] bg-[#d36838] px-5 py-[7px] text-white transition-colors hover:border-[#bb5c2f] hover:bg-[#bb5c2f] focus:border-[#bb5c2f] focus:bg-[#bb5c2f] disabled:cursor-not-allowed disabled:border-[#e0e0db] disabled:bg-[#e0e0db] disabled:text-[#6c757d]"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                      disabled={loading}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="flex">
            <div
              className="w-full pb-3 text-center text-sm leading-[1.4]"
              style={{ fontFamily: "Muli-SemiBold, Arial, sans-serif" }}
            >
              Copyright &copy; 2024 FH Liquidation Auction Tool All Rights Reserved.
              <br />
              Powered by{" "}
              <a className="text-[#d36838] no-underline" href="https://www.devdigital.com/" target="_blank" rel="noopener">
                Navam Tech
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
