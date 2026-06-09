"use client";

import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { Button, FormActions } from "@/components/common/Button";
import { IconDelete, IconDeleteDisabled, IconEdit, IconHelp } from "@/components/common/icons";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { boldFontStyle } from "@/config/fonts";
import { FormEvent, useMemo, useState } from "react";

type ConditionRow = {
  id: string;
  name: string;
  statusLabel: string;
  /** When true, show disabled delete affordance like the Bootstrap mock */
  deleteDisabled: boolean;
};

const INITIAL_ROWS: ConditionRow[] = [
  { id: "1", name: "New", statusLabel: "Active", deleteDisabled: true },
  { id: "2", name: "New – Open Box", statusLabel: "Active", deleteDisabled: true },
  { id: "3", name: "New – Damaged Box", statusLabel: "Active", deleteDisabled: true },
  { id: "4", name: "See Description", statusLabel: "Active", deleteDisabled: true },
];

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const selectBaseClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

export default function ConditionsPage() {
  const [rows, setRows] = useState<ConditionRow[]>(INITIAL_ROWS);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);

  const nameError =
    submitAttempted || nameBlurred ? (!name.trim() ? "The first name field is required." : undefined) : undefined;

  const columns: ColumnConfig<ConditionRow>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        sortable: false,
        sticky: true,
        minWidth: "160px",
        className: "whitespace-nowrap",
      },
      {
        key: "statusLabel",
        label: "Status",
        sortable: false,
        className: "text-center w-[100px]",
        headerClassName: "text-center w-[100px]",
        render: (row) => {
          const cls =
            row.statusLabel === "Active"
              ? "text-[#0d6efd]"
              : row.statusLabel === "Inactive"
                ? "text-[#181512]"
                : "text-[#6c757d]";
          return <span className={`font-normal ${cls}`}>{row.statusLabel}</span>;
        },
      },
      {
        key: "edit",
        label: "Edit",
        sortable: false,
        className: "text-center w-[100px]",
        headerClassName: "text-center w-[100px]",
        render: () => (
          <a href="#" className="inline-flex justify-center" onClick={(e) => e.preventDefault()} aria-label="Edit condition">
            <IconEdit />
          </a>
        ),
      },
      {
        key: "delete",
        label: "Delete",
        sortable: false,
        renderHeader: () => (
          <span className="flex items-center justify-center gap-1">
            Delete
            <button
              type="button"
              className="inline-flex cursor-help border-0 bg-transparent p-0"
              title="Conditions assigned to any auction cannot be deleted and will be displayed in gray color."
              aria-label="Conditions assigned to any auction cannot be deleted and will be displayed in gray color."
            >
              <IconHelp />
            </button>
          </span>
        ),
        className: "text-center w-[100px]",
        headerClassName: "text-center w-[100px]",
        render: (row) =>
          row.deleteDisabled ? (
            <span className="inline-flex justify-center" aria-label="Cannot delete condition">
              <IconDeleteDisabled />
            </span>
          ) : (
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center border-0 bg-transparent p-0"
              aria-label="Delete condition"
              onClick={() =>
                setRows((prev) => prev.filter((r) => r.id !== row.id))
              }
            >
              <IconDelete />
            </button>
          ),
      },
    ],
    [],
  );

  function resetForm() {
    setName("");
    setStatus("");
    setSubmitAttempted(false);
    setNameBlurred(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!name.trim()) return;

    const statusLabel =
      status === "1" ? "Inactive" : status === "2" ? "Active" : "—";

    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        statusLabel,
        deleteDisabled: false,
      },
    ]);
    resetForm();
  }

  return (
    <PageLayout activeKey="conditions">
      <AppContainer>
        <PageHeader title="Conditions" />

        <div className={contentPanelClass}>
            <div className="flex justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/3 xl:max-w-none">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-6">
                    <label
                      className="mb-2 block text-base text-[#181512]"
                      style={boldFontStyle}
                      htmlFor="condition-name"
                    >
                      Name<span className="text-[#dc3545]">*</span>
                    </label>
                    <input
                      id="condition-name"
                      name="name"
                      type="text"
                      autoComplete="organization"
                      autoFocus
                      aria-invalid={nameError ? "true" : "false"}
                      aria-describedby={nameError ? "condition-name-error" : undefined}
                      className={`${inputBaseClass} ${nameError ? "border-[#dc3545]" : "border-[#ced4da]"}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setNameBlurred(true)}
                    />
                    {nameError ? (
                      <div id="condition-name-error" className="mt-1 w-full text-sm text-[#dc3545]" role="alert">
                        {nameError}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2 block text-base text-[#181512]"
                      style={boldFontStyle}
                      htmlFor="condition-status"
                    >
                      Status
                    </label>
                    <select
                      id="condition-status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      aria-label="Status"
                      className={`${selectBaseClass} border-[#ced4da]`}
                    >
                      <option value="">Select Status</option>
                      <option value="1">Inactive</option>
                      <option value="2">Active</option>
                    </select>
                  </div>

                  <FormActions>
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

            <hr className="mt-4 mb-8 border-[#dee2e6]" />

            <div className="min-w-0 w-full">
              <DataTable<ConditionRow>
                data={rows}
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
    </PageLayout>
  );
}
