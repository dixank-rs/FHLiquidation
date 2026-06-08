"use client";

import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function validateStartingLot(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "The starting lot no field is required.";
  if (!/^\d+$/.test(trimmed)) return "Enter a valid whole number for starting lot.";
  return undefined;
}

export default function NewAuctionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startingLotNo, setStartingLotNo] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);
  const [lotBlurred, setLotBlurred] = useState(false);

  const nameError =
    submitAttempted || nameBlurred ? (!name.trim() ? "The name field is required." : undefined) : undefined;
  const lotError =
    submitAttempted || lotBlurred ? validateStartingLot(startingLotNo) : undefined;

  function resetForm() {
    setName("");
    setStartingLotNo("");
    setSubmitAttempted(false);
    setNameBlurred(false);
    setLotBlurred(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    const nErr = !name.trim() ? "The name field is required." : undefined;
    const lErr = validateStartingLot(startingLotNo);
    if (nErr || lErr) return;
    router.push("/auction");
  }

  return (
    <PageLayout activeKey="new-auction">
      <AppContainer>
        <PageHeader title="New Auction" />

        <div className={contentPanelClass}>
            <div className="flex justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/3 xl:max-w-none">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-6">
                    <label
                      className="mb-2 block text-base text-[#181512]"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                      htmlFor="auction-name"
                    >
                      Name<span className="text-[#dc3545]">*</span>
                    </label>
                    <input
                      id="auction-name"
                      name="name"
                      type="text"
                      autoComplete="organization"
                      aria-invalid={nameError ? "true" : "false"}
                      aria-describedby={nameError ? "auction-name-error" : undefined}
                      className={`w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25 ${
                        nameError ? "border-[#dc3545]" : "border-[#ced4da]"
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setNameBlurred(true)}
                    />
                    {nameError ? (
                      <div
                        id="auction-name-error"
                        className="mt-1 w-full text-sm text-[#dc3545]"
                        role="alert"
                      >
                        {nameError}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2 block text-base text-[#181512]"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                      htmlFor="starting-lot-no"
                    >
                      Starting Lot No<span className="text-[#dc3545]">*</span>
                    </label>
                    <input
                      id="starting-lot-no"
                      name="startingLotNo"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      aria-invalid={lotError ? "true" : "false"}
                      aria-describedby={lotError ? "starting-lot-no-error" : undefined}
                      className={`w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25 ${
                        lotError ? "border-[#dc3545]" : "border-[#ced4da]"
                      }`}
                      value={startingLotNo}
                      onChange={(e) => setStartingLotNo(e.target.value)}
                      onBlur={() => setLotBlurred(true)}
                    />
                    {lotError ? (
                      <div
                        id="starting-lot-no-error"
                        className="mt-1 w-full text-sm text-[#dc3545]"
                        role="alert"
                      >
                        {lotError}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:justify-center xl:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-transparent bg-[#d36838] px-5 py-[7px] text-base leading-normal text-white no-underline transition-colors hover:bg-[#bb5c2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d36838] md:px-5 md:py-[7px] xl:w-auto"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-transparent bg-[#181512] px-5 py-[7px] text-base leading-normal text-white transition-colors hover:bg-[#2a2825] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181512] xl:w-auto"
                      style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                      onClick={resetForm}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
        </div>
      </AppContainer>
    </PageLayout>
  );
}
