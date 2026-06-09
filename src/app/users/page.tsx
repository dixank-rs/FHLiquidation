"use client";

import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { Button, FormActions, ModalActions } from "@/components/common/Button";
import { IconClose, IconDelete, IconEdit, IconPinVisibility } from "@/components/common/icons";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { FormEvent, useCallback, useId, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
};

const INITIAL_USERS: UserRow[] = [
  { id: "1", name: "Bailey Roth", email: "baileyroth@gmail.com" },
  { id: "2", name: "Maverick Stokes", email: "maverickstokes@gmail.com" },
  { id: "3", name: "Lyanna Phillips", email: "lyannaphillips@gmail.com" },
  { id: "4", name: "Kian Acevedo", email: "kianacevedo@gmail.com" },
  { id: "5", name: "Brantley Lewis", email: "brantleylewis@gmail.com" },
  { id: "6", name: "Rory Gilbert", email: "rorygilbert@gmail.com" },
  { id: "7", name: "Arturo Paul", email: "arturopaul@gmail.com" },
  { id: "8", name: "Rylee Quintero", email: "ryleequintero@gmail.com" },
  { id: "9", name: "Rohan O'brien", email: "rohanbrien@gmail.com" },
  { id: "10", name: "Kade Sherman", email: "kadesherman@gmail.com" },
  { id: "11", name: "Bailey Roth", email: "baileyroth@gmail.com" },
];

function generateNumericPin(length = 6) {
  const digits = Array.from({ length }, () => String(Math.floor(Math.random() * 10)));
  return digits.join("");
}

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

export default function UsersPage() {
  const modalTitleId = useId();
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [pinVisible, setPinVisible] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [firstBlurred, setFirstBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [pinBlurred, setPinBlurred] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const firstError =
    submitAttempted || firstBlurred ? (!firstName.trim() ? "The first name field is required." : undefined) : undefined;
  const emailError =
    submitAttempted || emailBlurred ? (!email.trim() ? "The email field is required." : undefined) : undefined;
  const pinError = submitAttempted || pinBlurred ? (!pin.trim() ? "The pin field is required." : undefined) : undefined;

  const columns: ColumnConfig<UserRow>[] = [
      { key: "name", label: "Name", sortable: true },
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (row) => (
          <a href={`mailto:${row.email}`} className="text-[#0d6efd] no-underline hover:underline">
            {row.email}
          </a>
        ),
      },
      {
        key: "edit",
        label: "Edit",
        sortable: false,
        className: "text-center w-[100px]",
        headerClassName: "text-center w-[100px]",
        render: () => (
          <a href="#" className="inline-flex justify-center" onClick={(e) => e.preventDefault()} aria-label="Edit user">
            <IconEdit />
          </a>
        ),
      },
      {
        key: "delete",
        label: "Delete",
        sortable: false,
        className: "text-center w-[100px]",
        headerClassName: "text-center w-[100px]",
        render: () => (
          <button
            type="button"
            className="relative z-[3] inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border-0 bg-transparent p-2"
            aria-label="Delete user"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true);
            }}
          >
            <IconDelete />
          </button>
        ),
      },
  ];

  const resetForm = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPin("");
    setPinVisible(false);
    setSubmitAttempted(false);
    setFirstBlurred(false);
    setEmailBlurred(false);
    setPinBlurred(false);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!firstName.trim() || !email.trim() || !pin.trim()) return;

    const name = `${firstName.trim()}${lastName.trim() ? ` ${lastName.trim()}` : ""}`;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

    setUsers((prev) => [...prev, { id, name, email: email.trim() }]);
    resetForm();
  }

  function handleGeneratePin() {
    setPin(generateNumericPin());
  }

  return (
    <PageLayout activeKey="users">
      <AppContainer>
        <PageHeader title="Users" />

        <div className={contentPanelClass}>
            <div className="mx-auto flex max-w-none justify-center">
              <div className="w-full md:max-w-[50%] lg:max-w-[50%]">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-6 flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <label
                        className="mb-2 block text-base text-[#181512]"
                        style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                        htmlFor="user-first-name"
                      >
                        First Name<span className="text-[#dc3545]">*</span>
                      </label>
                      <input
                        id="user-first-name"
                        name="name"
                        type="text"
                        autoComplete="given-name"
                        aria-invalid={firstError ? "true" : "false"}
                        aria-describedby={firstError ? "user-first-name-error" : undefined}
                        className={`${inputBaseClass} ${firstError ? "border-[#dc3545]" : "border-[#ced4da]"}`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => setFirstBlurred(true)}
                        autoFocus
                      />
                      {firstError ? (
                        <div id="user-first-name-error" className="mt-1 text-sm text-[#dc3545]" role="alert">
                          {firstError}
                        </div>
                      ) : null}
                    </div>
                    <div className="w-full md:w-1/2">
                      <label
                        className="mb-2 block text-base text-[#181512]"
                        style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                        htmlFor="user-last-name"
                      >
                        Last Name
                      </label>
                      <input
                        id="user-last-name"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        className={`${inputBaseClass} border-[#ced4da]`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <label
                        className="mb-2 block text-base text-[#181512]"
                        style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                        htmlFor="user-email"
                      >
                        Email<span className="text-[#dc3545]">*</span>
                      </label>
                      <input
                        id="user-email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        aria-invalid={emailError ? "true" : "false"}
                        aria-describedby={emailError ? "user-email-error" : undefined}
                        className={`${inputBaseClass} ${emailError ? "border-[#dc3545]" : "border-[#ced4da]"}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailBlurred(true)}
                      />
                      {emailError ? (
                        <div id="user-email-error" className="mt-1 text-sm text-[#dc3545]" role="alert">
                          {emailError}
                        </div>
                      ) : null}
                    </div>

                    <div className="w-full md:w-1/2">
                      <div className="mb-2 overflow-hidden">
                        <button
                          type="button"
                          className="float-end border-0 bg-transparent p-0 text-base leading-[1.4] text-[#0d6efd] no-underline hover:underline"
                          onClick={handleGeneratePin}
                        >
                          Generate Pin
                        </button>
                        <label
                          className="mb-2 block text-base text-[#181512]"
                          style={{ fontFamily: "Muli-Bold, Arial, sans-serif" }}
                          htmlFor="user-pin"
                        >
                          Pin<span className="text-[#dc3545]">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          id="user-pin"
                          name="pin"
                          type={pinVisible ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={pinError ? "true" : "false"}
                          aria-describedby={pinError ? "user-pin-error" : undefined}
                          className={`${inputBaseClass} pr-10 ${pinError ? "border-[#dc3545]" : "border-[#ced4da]"}`}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          onBlur={() => setPinBlurred(true)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                          aria-label={pinVisible ? "Hide pin" : "Show pin"}
                          onClick={() => setPinVisible((v) => !v)}
                        >
                          <IconPinVisibility visible={pinVisible} />
                        </button>
                      </div>
                      {pinError ? (
                        <div id="user-pin-error" className="mt-1 text-sm text-[#dc3545]" role="alert">
                          {pinError}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <FormActions className="grid-cols-2">
                    <Button type="submit" variant="primary" layout="form">
                      Save
                    </Button>
                    <Button type="button" variant="secondary" layout="form" onClick={resetForm}>
                      Reset
                    </Button>
                  </FormActions>
                </form>
              </div>
            </div>

            <hr className="mt-4 mb-8 border-[#e0e0db]" />

            <div className="min-w-0 w-full">
              <DataTable<UserRow>
                data={users}
                columns={columns}
                getRowKey={(row) => row.id}
                enableSearch={false}
                enablePagination
                enableSorting={false}
                defaultEntriesPerPage={10}
                horizontalScroll
              />
            </div>
        </div>
      </AppContainer>
      {deleteModalOpen ? (
        <div
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-t-[6px] bg-white shadow-lg sm:rounded-[6px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
          >
            <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-3">
              <h2 id={modalTitleId} className="m-0 text-lg font-semibold text-[#0d6efd]">
                Confirm
              </h2>
              <button
                type="button"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#181512] hover:bg-[#f1f1f1]"
                aria-label="Close"
                onClick={() => setDeleteModalOpen(false)}
              >
                <IconClose />
              </button>
            </div>
            <div className="px-4 py-4 text-[#181512]">
              <p className="m-0 text-base">
                Are you sure you want to <strong>DELETE</strong> the selected user(s) ?
              </p>
            </div>
            <ModalActions>
              <Button type="button" variant="secondary" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Confirm
              </Button>
            </ModalActions>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
}
