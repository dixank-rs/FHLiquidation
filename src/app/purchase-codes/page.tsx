"use client";

import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { Button, FormActions, ModalActions } from "@/components/common/Button";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import { IconClose } from "@/components/common/icons";
import PageLayout from "@/components/layout/PageLayout";
import {
  formToRecord,
  formatDisplayDate,
  INITIAL_PURCHASE_CODE_FORM,
  LOCATION_OPTIONS,
  MOCK_PURCHASE_CODES,
  newPurchaseCodeFormWithToday,
  PurchaseCodeFormState,
  PurchaseCodeRecord,
  recordToForm,
  USER_OPTIONS,
  VENDOR_OPTIONS,
} from "@/data/mockPurchaseCodes";
import { boldFont, labelFont } from "@/config/fonts";
import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const selectBaseClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const dateInputClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const readOnlyInputClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-[#e9ecef] px-3 py-[0.7rem] text-[#181512] outline-none";

const checkboxClass =
  "h-[16px] w-[16px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]";

const filterToolbarCheckboxClass =
  "h-[18px] w-[18px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]";

type StatusModalMode = "mark-inactive" | "mark-active" | null;

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
      <label className="mb-2 block text-[#181512]" style={labelFont} htmlFor={id}>
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

export default function PurchaseCodesPage() {
  const modalTitleId = useId();
  const formSectionRef = useRef<HTMLDivElement>(null);

  const [records, setRecords] = useState<PurchaseCodeRecord[]>(MOCK_PURCHASE_CODES);
  const [form, setForm] = useState<PurchaseCodeFormState>(INITIAL_PURCHASE_CODE_FORM);
  const [editId, setEditId] = useState<string | null>(null);

  const [showInactiveView, setShowInactiveView] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageRows, setPageRows] = useState<PurchaseCodeRecord[]>([]);
  const [statusModal, setStatusModal] = useState<StatusModalMode>(null);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [purchaseCodeBlurred, setPurchaseCodeBlurred] = useState(false);
  const [datePurchasedBlurred, setDatePurchasedBlurred] = useState(false);

  const purchaseCodeError =
    submitAttempted || purchaseCodeBlurred
      ? !form.purchaseCode.trim()
        ? "The purchase code field is required."
        : undefined
      : undefined;
  const datePurchasedError =
    submitAttempted || datePurchasedBlurred
      ? !form.datePurchased.trim()
        ? "The date purchase field is required."
        : undefined
      : undefined;

  const tableData = useMemo(
    () => records.filter((r) => (showInactiveView ? !r.isActive : r.isActive)),
    [records, showInactiveView],
  );

  const handlePageRowsChange = useCallback((rows: PurchaseCodeRecord[]) => {
    setPageRows(rows);
  }, []);

  // Client-only default date after hydration; avoids SSR/client mismatch from `new Date()`.
  useEffect(() => {
    if (!editId && !form.dateCreated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration default
      setForm(newPurchaseCodeFormWithToday());
    }
  }, [editId, form.dateCreated]);

  const resetForm = useCallback(() => {
    setForm(newPurchaseCodeFormWithToday());
    setEditId(null);
    setSubmitAttempted(false);
    setPurchaseCodeBlurred(false);
    setDatePurchasedBlurred(false);
  }, []);

  const updateForm = useCallback((patch: Partial<PurchaseCodeFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  function scrollToForm() {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePurchaseCodeClick(row: PurchaseCodeRecord) {
    scrollToForm();
    setEditId(row.id);
    setForm(recordToForm(row));
    setSubmitAttempted(false);
    setPurchaseCodeBlurred(false);
    setDatePurchasedBlurred(false);
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const pageRowIds = pageRows.map((r) => r.id);
  const allPageSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selectedIds.has(id));

  function toggleSelectAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageRowIds.forEach((id) => next.delete(id));
      } else {
        pageRowIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function handleShowInactiveChange(checked: boolean) {
    setShowInactiveView(checked);
    setSelectedIds(new Set());
  }

  function resolvePurchasedBy(id: string | null) {
    if (id) {
      const existing = records.find((r) => r.id === id);
      if (existing) return existing.purchasedBy;
    }
    return form.substituteBy.trim() || form.createdBy.trim() || "admin";
  }

  function persistRecord(id: string, nextForm: PurchaseCodeFormState, isActive: boolean) {
    const purchasedBy = resolvePurchasedBy(id);
    return formToRecord(nextForm, id, isActive, purchasedBy);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!form.purchaseCode.trim() || !form.datePurchased.trim()) return;

    const today = formatDisplayDate();
    const nextForm: PurchaseCodeFormState = {
      ...form,
      dateUpdated: today,
      updatedBy: "admin",
    };

    if (editId) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editId ? persistRecord(editId, nextForm, r.isActive) : r)),
      );
    } else {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const createForm: PurchaseCodeFormState = {
        ...nextForm,
        dateCreated: today,
        createdBy: "admin",
        dateUpdated: today,
        updatedBy: "admin",
      };
      setRecords((prev) => [...prev, persistRecord(id, createForm, true)]);
    }
    resetForm();
  }

  function handleCloseDealCode() {
    if (!editId) return;
    const today = formatDisplayDate();
    const closedForm: PurchaseCodeFormState = {
      ...form,
      dateClosed: today,
      closedBy: "admin",
      dateUpdated: today,
      updatedBy: "admin",
    };
    setForm(closedForm);
    setRecords((prev) =>
      prev.map((r) => (r.id === editId ? persistRecord(editId, closedForm, r.isActive) : r)),
    );
  }

  function confirmBulkStatusChange() {
    const makeActive = statusModal === "mark-active";
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, isActive: makeActive } : r)),
    );
    setSelectedIds(new Set());
    setStatusModal(null);
  }

  const columns: ColumnConfig<PurchaseCodeRecord>[] = [
    {
      key: "select",
      label: "Select",
      sortable: false,
      sticky: true,
      minWidth: "60px",
      className: "text-center w-[60px]",
      headerClassName: "text-center w-[60px]",
      renderHeader: () => (
        <input
          type="checkbox"
          className={checkboxClass}
          checked={allPageSelected}
          onChange={toggleSelectAllOnPage}
          aria-label="Select all on page"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          className={checkboxClass}
          checked={selectedIds.has(row.id)}
          onChange={() => toggleRow(row.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${row.purchaseCode}`}
        />
      ),
    },
    {
      key: "purchaseCode",
      label: "Purchase Code",
      sortable: true,
      render: (row) => (
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-normal text-[#d36838] no-underline hover:underline"
          onClick={() => handlePurchaseCodeClick(row)}
        >
          {row.purchaseCode}
        </button>
      ),
    },
    { key: "purchasedBy", label: "Purchased By", sortable: true },
    { key: "vendor", label: "Vendor", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "orderNumber", label: "Order Number", sortable: true },
    { key: "datePurchased", label: "Date Purchased", sortable: true },
    { key: "dateClosed", label: "Date Closed", sortable: true },
  ];

  const inputClass = (hasError?: boolean) =>
    `${inputBaseClass} ${hasError ? "border-[#dc3545]" : "border-[#ced4da]"}`;

  const dateClass = (hasError?: boolean) =>
    `${dateInputClass} ${hasError ? "border-[#dc3545]" : "border-[#ced4da]"}`;

  return (
    <PageLayout activeKey="purchase-codes">
      <AppContainer>
        <PageHeader title="Purchase Code" />

        <div className={contentPanelClass}>
            <div ref={formSectionRef}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
                  <div>
                    <FormField id="pc-code" label="Purchase Code" required error={purchaseCodeError}>
                      <input
                        id="pc-code"
                        type="text"
                        autoFocus={!editId}
                        className={inputClass(!!purchaseCodeError)}
                        value={form.purchaseCode}
                        onChange={(e) => updateForm({ purchaseCode: e.target.value })}
                        onBlur={() => setPurchaseCodeBlurred(true)}
                        aria-invalid={purchaseCodeError ? "true" : "false"}
                      />
                    </FormField>
                    <FormField id="pc-date-purchased" label="Date Purchase" required error={datePurchasedError}>
                      <input
                        id="pc-date-purchased"
                        type="date"
                        className={dateClass(!!datePurchasedError)}
                        value={form.datePurchased}
                        onChange={(e) => updateForm({ datePurchased: e.target.value })}
                        onBlur={() => setDatePurchasedBlurred(true)}
                        aria-invalid={datePurchasedError ? "true" : "false"}
                      />
                    </FormField>
                    <FormField id="pc-vendor" label="Vendor">
                      <select
                        id="pc-vendor"
                        className={selectBaseClass}
                        value={form.vendor}
                        onChange={(e) => updateForm({ vendor: e.target.value })}
                      >
                        <option value="">Select Vendor</option>
                        {VENDOR_OPTIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField id="pc-order-number" label="Order No">
                      <input
                        id="pc-order-number"
                        type="text"
                        className={inputClass()}
                        value={form.orderNumber}
                        onChange={(e) => updateForm({ orderNumber: e.target.value })}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField id="pc-location" label="Location">
                      <select
                        id="pc-location"
                        className={selectBaseClass}
                        value={form.location}
                        onChange={(e) => updateForm({ location: e.target.value })}
                      >
                        <option value="">Select Location</option>
                        {LOCATION_OPTIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField id="pc-substitute" label="Substitute">
                      <input
                        id="pc-substitute"
                        type="text"
                        className={inputClass()}
                        value={form.substitute}
                        onChange={(e) => updateForm({ substitute: e.target.value })}
                      />
                    </FormField>
                    <FormField id="pc-date-substituted" label="Date Substituted">
                      <input
                        id="pc-date-substituted"
                        type="date"
                        className={dateClass()}
                        value={form.dateSubstituted}
                        onChange={(e) => updateForm({ dateSubstituted: e.target.value })}
                      />
                    </FormField>
                    <FormField id="pc-substitute-by" label="Substitute By">
                      <select
                        id="pc-substitute-by"
                        className={selectBaseClass}
                        value={form.substituteBy}
                        onChange={(e) => updateForm({ substituteBy: e.target.value })}
                      >
                        <option value="">Select User</option>
                        {USER_OPTIONS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField id="pc-date-created" label="Date Created">
                      <input
                        id="pc-date-created"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.dateCreated}
                      />
                    </FormField>
                    <FormField id="pc-created-by" label="Created By">
                      <input
                        id="pc-created-by"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.createdBy}
                      />
                    </FormField>
                    <FormField id="pc-date-updated" label="Date Updated">
                      <input
                        id="pc-date-updated"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.dateUpdated}
                      />
                    </FormField>
                    <FormField id="pc-margin" label="Default Margin">
                      <div className="flex w-full">
                        <input
                          id="pc-margin"
                          type="text"
                          inputMode="decimal"
                          className={`${inputBaseClass} rounded-r-none border-[#ced4da] border-r-0`}
                          value={form.defaultMarginPct}
                          onChange={(e) => updateForm({ defaultMarginPct: e.target.value })}
                          aria-describedby="pc-margin-suffix"
                        />
                        <span
                          id="pc-margin-suffix"
                          className="inline-flex items-center rounded-r-[5px] border border-l-0 border-[#ced4da] bg-[#e9ecef] px-3 text-base text-[#181512]"
                          style={boldFont}
                        >
                          %
                        </span>
                      </div>
                    </FormField>
                  </div>

                  <div>
                    <FormField id="pc-updated-by" label="Updated By">
                      <input
                        id="pc-updated-by"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.updatedBy}
                      />
                    </FormField>
                    <FormField id="pc-date-closed" label="Date Closed">
                      <input
                        id="pc-date-closed"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.dateClosed || "—"}
                      />
                    </FormField>
                    <FormField id="pc-closed-by" label="Closed By">
                      <input
                        id="pc-closed-by"
                        type="text"
                        readOnly
                        disabled
                        className={readOnlyInputClass}
                        value={form.closedBy || "—"}
                      />
                    </FormField>
                    <div className="mb-4">
                      <span
                        className="mb-2 hidden text-base md:block"
                        style={boldFont}
                        aria-hidden="true"
                      >
                        &nbsp;
                      </span>
                      <div className="flex items-center gap-2 py-[0.7rem]">
                        <input
                          id="pc-all-lps"
                          type="checkbox"
                          className={checkboxClass}
                          checked={form.allSkusAreLps}
                          onChange={(e) => updateForm({ allSkusAreLps: e.target.checked })}
                        />
                        <label
                          className="mb-0 cursor-pointer text-[#181512]"
                          style={labelFont}
                          htmlFor="pc-all-lps"
                        >
                          All SKU are LPs
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <FormActions>
                  <Button type="submit" variant="primary" layout="form">
                    {editId ? "Update" : "Save"}
                  </Button>
                  {editId ? (
                    <Button type="button" variant="primary" layout="form" onClick={handleCloseDealCode}>
                      Close Deal Code
                    </Button>
                  ) : null}
                  <Button type="button" variant="secondary" layout="form" onClick={resetForm}>
                    Reset
                  </Button>
                </FormActions>
              </form>
            </div>

            <hr className="mt-4 mb-8 border-[#e0e0db]" />

            <div className="mb-4 flex flex-col items-start justify-end gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-4">
                {selectedIds.size > 0 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setStatusModal(showInactiveView ? "mark-active" : "mark-inactive")}
                  >
                    {showInactiveView ? "Mark Active" : "Mark Inactive"}
                  </Button>
                ) : null}
                <div className="flex items-center gap-2">
                  <input
                    className={filterToolbarCheckboxClass}
                    type="checkbox"
                    id="showInactivePurchaseCodes"
                    checked={showInactiveView}
                    onChange={(e) => handleShowInactiveChange(e.target.checked)}
                  />
                  <label
                    className="mb-0 cursor-pointer text-[14px] leading-[1.5] text-[#181512]"
                    htmlFor="showInactivePurchaseCodes"
                  >
                    {showInactiveView ? "Show Active" : "Show Inactive"}
                  </label>
                </div>
              </div>
            </div>

            <DataTable<PurchaseCodeRecord>
              data={tableData}
              columns={columns}
              getRowKey={(row) => row.id}
              enableSearch
              enablePagination
              enableSorting
              defaultEntriesPerPage={10}
              searchPlaceholder="Search purchase codes..."
              searchInputId="purchase-code-search"
              onPageRowsChange={handlePageRowsChange}
              horizontalScroll
            />
        </div>
      </AppContainer>
      {statusModal ? (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setStatusModal(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-[6px] bg-white shadow-lg"
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
                onClick={() => setStatusModal(null)}
              >
                <IconClose />
              </button>
            </div>
            <div className="px-4 py-4 text-[#181512]">
              <p className="m-0 text-base">
                Are you sure you want to mark the selected purchase code(s) as{" "}
                <strong>{statusModal === "mark-active" ? "ACTIVE" : "INACTIVE"}</strong>?
              </p>
            </div>
            <ModalActions>
              <Button type="button" variant="secondary" size="sm" onClick={() => setStatusModal(null)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={confirmBulkStatusChange}>
                Confirm
              </Button>
            </ModalActions>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
}
