"use client";

import ImportManifestItemsTable from "@/app/import-manifest/ImportManifestItemsTable";
import { ColumnConfig } from "@/components/common/DataTable";
import { Button, FormActions, ModalActions } from "@/components/common/Button";
import { IconClose, IconHelp } from "@/components/common/icons";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { formatDisplayDate } from "@/data/mockPurchaseCodes";
import {
  computeManifestTotals,
  createSampleFileMeta,
  DEAL_CODES_BY_VENDOR,
  formatCurrency,
  formatPercent,
  formatQty,
  INITIAL_IMPORT_MANIFEST_FORM,
  ImportManifestFormState,
  MANIFEST_EXCEL_COLUMNS,
  MANIFEST_IMPORT_NOTES,
  ManifestFileMeta,
  ManifestItemRow,
  MOCK_MANIFEST_ITEMS,
  SAMPLE_IMPORT_MANIFEST_FORM,
  VENDOR_OPTIONS,
} from "@/data/mockImportManifest";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const selectBaseClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const textareaClass =
  "w-full resize-y rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const boldFont = { fontFamily: "Muli-Bold, Arial, sans-serif" } as const;

const rightAlign = "text-right";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

function FormField({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-base text-[#181512]" style={boldFont} htmlFor={id}>
        {label}
        {required ? <span className="text-[#dc3545]">*</span> : null}
      </label>
      {children}
      {error ? (
        <div className="mt-1 text-sm text-[#dc3545]" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default function ImportManifestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const instructionsModalTitleId = useId();

  const [form, setForm] = useState<ImportManifestFormState>(SAMPLE_IMPORT_MANIFEST_FORM);
  const [items, setItems] = useState<ManifestItemRow[]>(MOCK_MANIFEST_ITEMS);
  const [fileMeta, setFileMeta] = useState<ManifestFileMeta | null>(() => createSampleFileMeta());
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const dealCodeOptions = useMemo(() => {
    if (!form.vendor) return [];
    return DEAL_CODES_BY_VENDOR[form.vendor] ?? [];
  }, [form.vendor]);

  const vendorError =
    submitAttempted && !form.vendor.trim() ? "The vendor field is required." : undefined;
  const dealCodeError =
    submitAttempted && !form.dealCode.trim() ? "The deal code field is required." : undefined;
  const manifestIdError =
    submitAttempted && !form.manifestId.trim() ? "The manifest ID field is required." : undefined;

  const inputClass = (hasError?: boolean) =>
    `${inputBaseClass} ${hasError ? "border-[#dc3545]" : "border-[#ced4da]"}`;

  const totals = useMemo(() => computeManifestTotals(items), [items]);

  const columns: ColumnConfig<ManifestItemRow>[] = useMemo(
    () => [
      {
        key: "itemNo",
        label: "Item No",
        sortable: true,
        minWidth: "96px",
      },
      {
        key: "gtin",
        label: "GTIN",
        sortable: true,
        minWidth: "160px",
      },
      {
        key: "departmentName",
        label: "Department Name",
        sortable: true,
        minWidth: "158px",
      },
      { key: "category", label: "Category", sortable: true, minWidth: "96px" },
      {
        key: "description",
        label: "Description",
        sortable: true,
        minWidth: "108px",
      },
      {
        key: "qty",
        label: "Qty",
        sortable: true,
        minWidth: "72px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatQty(row.qty),
      },
      {
        key: "lastKnownPrice",
        label: "Last Known Price",
        sortable: true,
        minWidth: "148px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatCurrency(row.lastKnownPrice),
      },
      {
        key: "extLastKnownPrice",
        label: "Ext Last Known Price",
        sortable: true,
        minWidth: "168px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatCurrency(row.extLastKnownPrice),
      },
      {
        key: "purchasePct",
        label: "Purchase %",
        sortable: true,
        minWidth: "108px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatPercent(row.purchasePct),
      },
      {
        key: "unitCost",
        label: "Unit Cost",
        sortable: true,
        minWidth: "96px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatCurrency(row.unitCost),
      },
      { key: "venue", label: "Venue", sortable: true, minWidth: "72px" },
      {
        key: "fhlPrice",
        label: "FHL Price",
        sortable: true,
        minWidth: "96px",
        className: rightAlign,
        headerClassName: rightAlign,
        render: (row) => formatCurrency(row.fhlPrice),
      },
    ],
    [],
  );

  function updateForm(patch: Partial<ImportManifestFormState>) {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.vendor !== undefined && patch.vendor !== prev.vendor) {
        next.dealCode = "";
      }
      return next;
    });
  }

  function resetAll() {
    setForm(INITIAL_IMPORT_MANIFEST_FORM);
    setItems([]);
    setFileMeta(null);
    setSubmitAttempted(false);
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validateRequiredFields() {
    setSubmitAttempted(true);
    return Boolean(form.vendor.trim() && form.dealCode.trim() && form.manifestId.trim());
  }

  function handleChooseManifestClick() {
    if (!validateRequiredFields()) return;
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileMeta(null);
    setItems([]);

    window.setTimeout(() => {
      setFileMeta({
        fileName: file.name,
        uploadDate: formatDisplayDate(),
        totalRecords: MOCK_MANIFEST_ITEMS.length,
      });
      setItems(MOCK_MANIFEST_ITEMS);
      setIsLoading(false);
    }, 600);
  }

  function handleFinalizeManifest() {
    if (!validateRequiredFields()) return;
    if (!fileMeta) return;
    // UI-only: no backend action
  }

  function handleDownloadExcel() {
    if (!items.length) return;
    // UI-only: no file generation
  }

  const canFinalize = Boolean(fileMeta && items.length);
  const canDownload = items.length > 0;

  return (
    <PageLayout activeKey="import-manifest">
      <AppContainer>
        <PageHeader
          title="Import Manifest"
          actions={
            <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1" onClick={() => setShowInstructions(true)}>
              <IconHelp className="shrink-0 text-current" size={18} />
              Instructions
            </Button>
          }
        />

        <div className={contentPanelClass}>
            <form
              onSubmit={(e) => e.preventDefault()}
              noValidate
              aria-label="Import manifest form"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormField id="im-vendor" label="Vendor" required error={vendorError}>
                    <select
                      id="im-vendor"
                      className={`${selectBaseClass} ${vendorError ? "border-[#dc3545]" : ""}`}
                      value={form.vendor}
                      onChange={(e) => updateForm({ vendor: e.target.value })}
                      aria-invalid={vendorError ? "true" : "false"}
                    >
                      <option value="">Select Vendor</option>
                      {VENDOR_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField id="im-deal-code" label="Deal Code" required error={dealCodeError}>
                    <select
                      id="im-deal-code"
                      className={`${selectBaseClass} ${dealCodeError ? "border-[#dc3545]" : ""}`}
                      value={form.dealCode}
                      onChange={(e) => updateForm({ dealCode: e.target.value })}
                      disabled={!form.vendor}
                      aria-invalid={dealCodeError ? "true" : "false"}
                    >
                      <option value="">
                        {form.vendor ? "Select Deal Code" : "Select vendor first"}
                      </option>
                      {dealCodeOptions.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <div>
                  <FormField id="im-manifest-id" label="Manifest ID" required error={manifestIdError}>
                    <input
                      id="im-manifest-id"
                      type="text"
                      className={inputClass(!!manifestIdError)}
                      value={form.manifestId}
                      onChange={(e) => updateForm({ manifestId: e.target.value })}
                      aria-invalid={manifestIdError ? "true" : "false"}
                    />
                  </FormField>
                  <FormField id="im-notes" label="Notes">
                    <textarea
                      id="im-notes"
                      rows={4}
                      className={textareaClass}
                      value={form.notes}
                      onChange={(e) => updateForm({ notes: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                aria-hidden
                tabIndex={-1}
              />

              <FormActions className="mb-6">
                <Button type="button" variant="primary" layout="actionBar" onClick={handleChooseManifestClick}>
                  Choose Manifest
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  layout="actionBar"
                  onClick={handleFinalizeManifest}
                  disabled={!canFinalize}
                >
                  Finalize Manifest
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  layout="actionBar"
                  onClick={handleDownloadExcel}
                  disabled={!canDownload}
                >
                  Download Excel
                </Button>
                <Button type="button" variant="secondary" layout="actionBar" onClick={resetAll}>
                  Reset
                </Button>
              </FormActions>
            </form>

            <hr className="my-8 border-[#dee2e6]" />

            <div className="relative min-w-0">
              {isLoading ? (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-[4px] bg-white/80"
                  role="status"
                  aria-live="polite"
                  aria-label="Loading manifest items"
                >
                  <span className="text-[14px] text-[#181512]" style={boldFont}>
                    Loading manifest items…
                  </span>
                </div>
              ) : null}

              <ImportManifestItemsTable
                items={items}
                columns={columns}
                fileMeta={fileMeta}
                isLoading={isLoading}
              />
            </div>

            {items.length > 0 ? (
              <div className="mt-6 flex w-full min-w-0 flex-col items-start gap-1 text-left text-[#181512] sm:items-end sm:text-right">
                <p className="m-0 max-w-full break-words text-sm sm:text-base" style={boldFont}>
                  Total Qty: {formatQty(totals.totalQty)}
                </p>
                <p className="m-0 max-w-full break-words text-sm sm:text-base" style={boldFont}>
                  Total Extended Last Known Price: {formatCurrency(totals.totalExtLastKnownPrice)}
                </p>
              </div>
            ) : null}
        </div>
      </AppContainer>
      {showInstructions ? (
        <div
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInstructions(false);
          }}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-t-[6px] bg-white shadow-lg sm:max-h-[90vh] sm:rounded-[6px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={instructionsModalTitleId}
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[#dee2e6] px-3 py-3 sm:items-center sm:px-4">
              <h2
                id={instructionsModalTitleId}
                className="m-0 pr-2 text-base font-semibold leading-snug text-[#d36838] sm:text-lg"
                style={boldFont}
              >
                Import Manifest Instructions
              </h2>
              <button
                type="button"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#181512] hover:bg-[#f1f1f1]"
                aria-label="Close instructions"
                onClick={() => setShowInstructions(false)}
              >
                <IconClose />
              </button>
            </div>

            <div className="overflow-y-auto px-3 py-4 text-[#181512] sm:px-4">
              <h3 className="mt-0 mb-3 text-sm leading-snug text-[#181512] sm:text-base" style={boldFont}>
                The Costco Manifest must be in following format to import
              </h3>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
                <div className="overflow-x-auto rounded-[4px] border border-[#ddd]">
                  <table className="w-full min-w-[240px] border-collapse text-[11px] leading-snug">
                    <thead className="bg-[#f1f1f1]">
                      <tr>
                        <th
                          className="w-[72px] border border-[#ddd] px-2 py-1.5 text-left font-semibold"
                          style={boldFont}
                        >
                          Column
                        </th>
                        <th
                          className="border border-[#ddd] px-2 py-1.5 text-left font-semibold"
                          style={boldFont}
                        >
                          Contents
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {MANIFEST_EXCEL_COLUMNS.map((row) => (
                        <tr key={row.column} className="hover:bg-[#f9f9f9]">
                          <td
                            className="border border-[#ddd] px-2 py-1.5 font-semibold"
                            style={boldFont}
                          >
                            {row.column}
                          </td>
                          <td className="border border-[#ddd] px-2 py-1.5">{row.contents}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col justify-center gap-4 text-[12px] leading-relaxed">
                  {MANIFEST_IMPORT_NOTES.map((note) => (
                    <p key={note.slice(0, 40)} className="m-0">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <ModalActions>
              <Button type="button" variant="primary" size="sm" onClick={() => setShowInstructions(false)}>
                Close
              </Button>
            </ModalActions>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
}
