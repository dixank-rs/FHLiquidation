"use client";

import { ColumnConfig } from "@/components/common/DataTable";
import { Button, FormActions, ModalActions } from "@/components/common/Button";
import ReceiveManifestViewTable from "@/app/receive-inventory/ReceiveManifestViewTable";
import {
  IconBadgeDollarSign,
  IconClose,
  IconPrinter,
  IconQrCode,
  IconTag,
} from "@/components/common/icons";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import {
  calculateOurPriceFromPercentage,
  DEAL_OPTIONS,
  findInventoryItem,
  formatCurrency,
  formatQty,
  formatReceivedExpected,
  INITIAL_RECEIVE_FORM,
  inventoryItemToForm,
  LastReceiptSnapshot,
  ManifestViewRow,
  manifestRowToForm,
  MOCK_INVENTORY_ITEMS,
  MOCK_MANIFEST_VIEW_ROWS,
  parseCurrency,
  PRICING_PERCENTAGE_OPTIONS,
  ReceiveFormState,
  VENUE_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/data/mockReceiveInventory";
import { boldFont, labelFont } from "@/config/fonts";
import { FormEvent, useCallback, useId, useMemo, useState, type ReactNode } from "react";

const inputBaseClass =
  "w-full rounded-[5px] border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const selectBaseClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const textareaClass =
  "w-full resize-y rounded-[5px] border border-[#ced4da] bg-white px-3 py-[0.7rem] text-[#181512] outline-none focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const readOnlyInputClass =
  "w-full rounded-[5px] border border-[#ced4da] bg-[#e9ecef] px-3 py-[0.7rem] text-[#181512] outline-none";

const inputPrefixClass =
  "inline-flex min-h-[calc(0.7rem*2+1.25rem)] shrink-0 items-center justify-center rounded-l-[5px] border border-r-0 border-[#ced4da] bg-[#fdf6f3] px-3";

const inputWithLeftPrefixClass =
  "w-full rounded-[5px] rounded-l-none border bg-white px-3 py-[0.7rem] text-[#181512] outline-none transition-[box-shadow] focus:border-[#d36838] focus:ring-2 focus:ring-[#d36838]/25";

const itemDetailsRowClass = "grid grid-cols-1 items-start gap-0 md:grid-cols-3 md:gap-6";

/** Resizable up to ~3 rows, then vertical scrollbar for overflow. */
const expandableTextareaClass = `${textareaClass} min-h-[calc(0.7rem*2+1.25rem)] max-h-[calc(0.7rem*2+1.35rem*3)] resize-y overflow-y-auto`;

const optionsPanelClass =
  "mb-4 rounded-[6px] border border-[#e9ecef] bg-[#fafafa] p-4 md:p-5";

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

const formRowClass = "grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 xl:grid-cols-4";

function InputIconPrefix({
  icon,
  children,
  tone = "brand",
}: {
  icon: ReactNode;
  children: ReactNode;
  tone?: "brand" | "muted";
}) {
  return (
    <div className="flex w-full">
      <span
        className={`${inputPrefixClass} ${tone === "muted" ? "bg-[#e9ecef]" : "bg-[#fdf6f3]"}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

type OptionToggleCardProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: ReactNode;
};

function OptionToggleCard({
  id,
  label,
  description,
  checked,
  onChange,
  icon,
}: OptionToggleCardProps) {
  return (
    <label
      htmlFor={id}
      className={`flex min-h-[72px] cursor-pointer items-center gap-3 rounded-[6px] border px-4 py-3 transition-all ${
        checked
          ? "border-[#d36838] bg-[#fdf6f3] shadow-[inset_0_0_0_1px_#d36838]"
          : "border-[#ced4da] bg-white hover:border-[#d36838]/45 hover:bg-[#fffcfa]"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] ${
          checked ? "bg-[#d36838] text-white" : "bg-[#f1f1f1] text-[#6c757d]"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[#181512]" style={labelFont}>
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-[#6c757d]">{description}</span>
      </span>
    </label>
  );
}

export default function ReceiveInventoryPage() {
  const manifestModalTitleId = useId();
  const [form, setForm] = useState<ReceiveFormState>(INITIAL_RECEIVE_FORM);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [manifestRows, setManifestRows] = useState<ManifestViewRow[]>(MOCK_MANIFEST_VIEW_ROWS);
  const [showManifestModal, setShowManifestModal] = useState(false);
  const [manifestModalSession, setManifestModalSession] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<LastReceiptSnapshot | null>(null);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [dealBlurred, setDealBlurred] = useState(false);

  const updateForm = useCallback((patch: Partial<ReceiveFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const dealError =
    submitAttempted || dealBlurred
      ? !form.deal.trim()
        ? "The deal field is required."
        : undefined
      : undefined;

  const quantityToReceiveValue = Number.parseInt(form.quantityToReceive, 10);
  const quantityToReceiveError =
    submitAttempted && (!Number.isFinite(quantityToReceiveValue) || quantityToReceiveValue <= 0)
      ? "Quantity to receive must be greater than zero."
      : undefined;

  const ourPriceValue = parseCurrency(form.ourPrice);
  const ourPriceError =
    submitAttempted && ourPriceValue !== null && ourPriceValue < 0
      ? "Our price cannot be negative."
      : submitAttempted && form.ourPrice.trim() && ourPriceValue === null
        ? "Enter a valid price."
        : undefined;

  const percentageError =
    submitAttempted && form.priceOnly && !form.pricingPercentage.trim()
      ? "Percentage is required when price only is selected."
      : undefined;

  const receivedExpectedDisplay = formatReceivedExpected(
    form.quantityReceived,
    form.quantityExpected,
  );

  const inputClass = (hasError?: boolean) =>
    `${inputBaseClass} ${hasError ? "border-[#dc3545]" : "border-[#ced4da]"}`;

  const manifestColumns: ColumnConfig<ManifestViewRow>[] = useMemo(
    () => [
      { key: "vendor", label: "Vendor", sortable: true, minWidth: "140px" },
      { key: "deal", label: "Deal", sortable: true, minWidth: "90px" },
      { key: "manifestId", label: "Manifest ID", sortable: true, minWidth: "150px" },
      { key: "headerNotes", label: "Header Notes", sortable: true, minWidth: "160px" },
      { key: "vendorItemNumber", label: "Vendor Item Number", sortable: true, minWidth: "130px" },
      { key: "gtin", label: "GTIN", sortable: true, minWidth: "140px" },
      { key: "department", label: "Department", sortable: true, minWidth: "120px" },
      { key: "category", label: "Category", sortable: true, minWidth: "130px" },
      { key: "description", label: "Description", sortable: true, minWidth: "200px" },
      {
        key: "qtyExpected",
        label: "Qty Expected",
        sortable: true,
        minWidth: "110px",
        className: "text-right",
        headerClassName: "text-right",
        render: (row) => formatQty(row.qtyExpected),
      },
      {
        key: "qtyReceived",
        label: "Qty Received",
        sortable: true,
        minWidth: "110px",
        className: "text-right",
        headerClassName: "text-right",
        render: (row) => formatQty(row.qtyReceived),
      },
      {
        key: "retail",
        label: "Retail",
        sortable: true,
        minWidth: "100px",
        className: "text-right",
        headerClassName: "text-right",
        render: (row) => formatCurrency(row.retail),
      },
      {
        key: "unitCost",
        label: "Unit Cost",
        sortable: true,
        minWidth: "100px",
        className: "text-right",
        headerClassName: "text-right",
        render: (row) => formatCurrency(row.unitCost),
      },
      { key: "venue", label: "Venue", sortable: true, minWidth: "110px" },
      {
        key: "fhlPrice",
        label: "FHL Price",
        sortable: true,
        minWidth: "100px",
        className: "text-right",
        headerClassName: "text-right",
        render: (row) => formatCurrency(row.fhlPrice),
      },
      { key: "notes", label: "Notes", sortable: true, minWidth: "140px" },
      {
        key: "link",
        label: "Link",
        sortable: false,
        minWidth: "120px",
        render: (row) =>
          row.link ? (
            <a
              href={row.link}
              className="text-[#d36838] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </a>
          ) : (
            "—"
          ),
      },
    ],
    [],
  );

  function resetForm() {
    setForm(INITIAL_RECEIVE_FORM);
    setSelectedItemId(null);
    setSubmitAttempted(false);
    setDealBlurred(false);
    setSearchMessage(null);
  }

  function openManifestModal() {
    setManifestModalSession((session) => session + 1);
    setShowManifestModal(true);
  }

  function handleManifestRowSelect(row: ManifestViewRow) {
    setSelectedItemId(row.id);
    setForm(manifestRowToForm(row));
    setSubmitAttempted(false);
    setDealBlurred(false);
    setShowManifestModal(false);
    setSearchMessage(`Loaded manifest item ${row.vendorItemNumber} for deal ${row.deal}.`);
  }

  function runItemLookup() {
    if (!form.deal.trim()) return;

    setIsSearching(true);
    setSearchMessage(null);

    window.setTimeout(() => {
      const match = findInventoryItem(MOCK_INVENTORY_ITEMS, form);
      if (match) {
        setSelectedItemId(match.id);
        setForm((prev) => ({
          ...inventoryItemToForm(match),
          priceOnly: prev.priceOnly,
          pricingMethod: prev.priceOnly ? "percentage" : "manual",
          pricingPercentage: prev.pricingPercentage,
          ourPrice: prev.priceOnly
            ? calculateOurPriceFromPercentage(
                String(match.retailPrice),
                prev.pricingPercentage,
              ) || String(match.ourPrice)
            : String(match.ourPrice),
        }));
        setSearchMessage(`Loaded item ${match.itemNumber} for deal ${match.deal}.`);
      }
      setIsSearching(false);
    }, 300);
  }

  function handleLookupBlur() {
    if (form.scanBarcode.trim() || form.itemNumber.trim() || form.upcGtin.trim()) {
      runItemLookup();
    }
  }

  function handleRetailPriceChange(value: string) {
    const patch: Partial<ReceiveFormState> = { retailPrice: value };
    if (form.priceOnly) {
      patch.ourPrice = calculateOurPriceFromPercentage(value, form.pricingPercentage);
      patch.pricingMethod = "percentage";
    }
    updateForm(patch);
  }

  function handlePercentageChange(value: string) {
    const patch: Partial<ReceiveFormState> = { pricingPercentage: value };
    if (form.priceOnly) {
      patch.ourPrice = calculateOurPriceFromPercentage(form.retailPrice, value);
      patch.pricingMethod = "percentage";
    }
    updateForm(patch);
  }

  function handlePriceOnlyChange(checked: boolean) {
    const patch: Partial<ReceiveFormState> = {
      priceOnly: checked,
      pricingMethod: checked ? "percentage" : "manual",
    };
    if (checked) {
      patch.ourPrice = calculateOurPriceFromPercentage(form.retailPrice, form.pricingPercentage);
    }
    updateForm(patch);
  }

  function validateReceive(): boolean {
    setSubmitAttempted(true);
    setDealBlurred(true);

    const qty = Number.parseInt(form.quantityToReceive, 10);
    const price = parseCurrency(form.ourPrice);

    if (!form.deal.trim()) return false;
    if (!Number.isFinite(qty) || qty <= 0) return false;
    if (price !== null && price < 0) return false;
    if (form.priceOnly && !form.pricingPercentage.trim()) return false;

    return true;
  }

  function handleReceive(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateReceive()) return;

    const qty = Number.parseInt(form.quantityToReceive, 10);
    const previousReceived = Number.parseInt(form.quantityReceived, 10) || 0;
    const nextReceived = previousReceived + qty;

    const manifestRow = manifestRows.find(
      (row) =>
        row.deal === form.deal &&
        (row.vendorItemNumber === form.itemNumber || row.gtin === form.upcGtin),
    );

    if (manifestRow) {
      setLastReceipt({
        itemId: selectedItemId ?? manifestRow.id,
        manifestRowId: manifestRow.id,
        quantityReceived: qty,
        previousQtyReceived: manifestRow.qtyReceived,
        formBefore: { ...form, quantityReceived: String(previousReceived) },
      });

      setManifestRows((prev) =>
        prev.map((row) =>
          row.id === manifestRow.id ? { ...row, qtyReceived: row.qtyReceived + qty } : row,
        ),
      );
    }

    updateForm({ quantityReceived: String(nextReceived), quantityToReceive: "1" });
    setSearchMessage(`Received ${formatQty(qty)} unit(s) successfully.`);
  }

  function handleUndoLastReceipt() {
    if (!lastReceipt) {
      setSearchMessage("No receipt available to undo.");
      return;
    }

    setManifestRows((prev) =>
      prev.map((row) =>
        row.id === lastReceipt.manifestRowId
          ? { ...row, qtyReceived: lastReceipt.previousQtyReceived }
          : row,
      ),
    );
    setForm(lastReceipt.formBefore);
    setLastReceipt(null);
    setSearchMessage("Last receipt undone.");
  }

  function handleReprint() {
    if (!form.itemNumber.trim()) {
      setSearchMessage("Search or enter an item before reprinting labels.");
      return;
    }
    setSearchMessage(
      form.printLabels
        ? `Label reprint queued for item ${form.itemNumber} (UI preview).`
        : "Print labels is unchecked — enable it to queue label printing.",
    );
  }

  return (
    <PageLayout activeKey="receive-inventory">
      <AppContainer>
        <PageHeader title="Receive" />

        <div className={contentPanelClass}>
          <form onSubmit={handleReceive} noValidate aria-label="Receive inventory form">
            {/* Row 1: Deal, Scan, Item#, UPC */}
            <div className={formRowClass}>
              <FormField id="rcv-deal" label="Deal" required error={dealError}>
                <select
                  id="rcv-deal"
                  className={`${selectBaseClass} ${dealError ? "border-[#dc3545]" : ""}`}
                  value={form.deal}
                  onChange={(e) => updateForm({ deal: e.target.value })}
                  onBlur={() => setDealBlurred(true)}
                  aria-invalid={dealError ? "true" : "false"}
                >
                  <option value="">Select Deal</option>
                  {DEAL_OPTIONS.map((deal) => (
                    <option key={deal} value={deal}>
                      {deal}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="rcv-barcode" label="Scan Barcode">
                <InputIconPrefix icon={<IconQrCode />}>
                  <input
                    id="rcv-barcode"
                    type="text"
                    className={`${inputWithLeftPrefixClass} ${isSearching ? "border-[#ced4da] opacity-70" : "border-[#ced4da]"}`}
                    value={form.scanBarcode}
                    onChange={(e) => updateForm({ scanBarcode: e.target.value })}
                    onBlur={handleLookupBlur}
                    autoComplete="off"
                    placeholder="Scan or type barcode"
                    disabled={isSearching}
                  />
                </InputIconPrefix>
              </FormField>

              <FormField id="rcv-item-number" label="Item Number">
                <input
                  id="rcv-item-number"
                  type="text"
                  className={inputClass()}
                  value={form.itemNumber}
                  onChange={(e) => updateForm({ itemNumber: e.target.value })}
                  onBlur={handleLookupBlur}
                  disabled={isSearching}
                />
              </FormField>

              <FormField id="rcv-upc" label="UPC / GTIN">
                <input
                  id="rcv-upc"
                  type="text"
                  className={inputClass()}
                  value={form.upcGtin}
                  onChange={(e) => updateForm({ upcGtin: e.target.value })}
                  onBlur={handleLookupBlur}
                  disabled={isSearching}
                />
              </FormField>
            </div>

            {/* Row 2: Venue, Category, Retail, Rcvd/Expctd */}
            <div className={formRowClass}>
              <FormField id="rcv-lookup-venue" label="Venue">
                <select
                  id="rcv-lookup-venue"
                  className={selectBaseClass}
                  value={form.lookupVenue}
                  onChange={(e) => updateForm({ lookupVenue: e.target.value })}
                >
                  <option value="">Select Venue</option>
                  {VENUE_OPTIONS.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="rcv-lookup-category" label="Category">
                <select
                  id="rcv-lookup-category"
                  className={selectBaseClass}
                  value={form.lookupCategory}
                  onChange={(e) => updateForm({ lookupCategory: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="rcv-retail-price" label="Retail Price">
                <input
                  id="rcv-retail-price"
                  type="text"
                  inputMode="decimal"
                  className={inputClass()}
                  value={form.retailPrice}
                  onChange={(e) => handleRetailPriceChange(e.target.value)}
                />
              </FormField>

              <FormField id="rcv-rcvd-expctd" label="Rcvd / Expctd">
                <input
                  id="rcv-rcvd-expctd"
                  type="text"
                  readOnly
                  disabled
                  className={readOnlyInputClass}
                  value={receivedExpectedDisplay}
                  aria-label={`Received ${form.quantityReceived || "0"} of ${form.quantityExpected || "0"} expected`}
                />
              </FormField>
            </div>


            {/* Row 3: Qty to receive, Our price, Percentage, Venue */}
            <div className={formRowClass}>
              <FormField
                id="rcv-qty-to-receive"
                label="Quantity To Receive"
                error={quantityToReceiveError}
              >
                <input
                  id="rcv-qty-to-receive"
                  type="number"
                  min={1}
                  step={1}
                  className={inputClass(!!quantityToReceiveError)}
                  value={form.quantityToReceive}
                  onChange={(e) => updateForm({ quantityToReceive: e.target.value })}
                  aria-invalid={quantityToReceiveError ? "true" : "false"}
                />
              </FormField>

              <FormField id="rcv-our-price" label="Our Price" error={ourPriceError}>
                <input
                  id="rcv-our-price"
                  type="text"
                  inputMode="decimal"
                  className={inputClass(!!ourPriceError)}
                  value={form.ourPrice}
                  onChange={(e) => updateForm({ ourPrice: e.target.value, pricingMethod: "manual" })}
                  disabled={form.priceOnly}
                  aria-invalid={ourPriceError ? "true" : "false"}
                />
              </FormField>

              <FormField id="rcv-percentage" label="Percentage" error={percentageError}>
                <select
                  id="rcv-percentage"
                  className={`${selectBaseClass} ${percentageError ? "border-[#dc3545]" : ""}`}
                  value={form.pricingPercentage}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  aria-invalid={percentageError ? "true" : "false"}
                >
                  <option value="">Select Percentage</option>
                  {PRICING_PERCENTAGE_OPTIONS.map((pct) => (
                    <option key={pct} value={pct}>
                      {pct}%
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="rcv-receiving-venue" label="Venue">
                <select
                  id="rcv-receiving-venue"
                  className={selectBaseClass}
                  value={form.receivingVenue}
                  onChange={(e) => updateForm({ receivingVenue: e.target.value })}
                >
                  <option value="">Select Venue</option>
                  {VENUE_OPTIONS.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Row 4: Link, Notes, Description */}
            <div className={itemDetailsRowClass}>
              <FormField id="rcv-link" label="Link">
                <input
                  id="rcv-link"
                  type="url"
                  className={inputClass()}
                  value={form.link}
                  onChange={(e) => updateForm({ link: e.target.value })}
                  placeholder="https://vendor.example.com/item"
                />
              </FormField>

              <FormField id="rcv-notes" label="Notes">
                <textarea
                  id="rcv-notes"
                  rows={1}
                  className={expandableTextareaClass}
                  value={form.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                  placeholder="Receiving notes…"
                />
              </FormField>

              <FormField id="rcv-description" label="Description">
                <textarea
                  id="rcv-description"
                  rows={1}
                  className={expandableTextareaClass}
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Item description"
                />
              </FormField>
            </div>

            {/* Row 5: LP, Print Label, Price Only */}
            <div className={optionsPanelClass}>
              <p className="mb-4 text-sm text-[#6c757d]" style={boldFont}>
              Processing Options
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <OptionToggleCard
                  id="rcv-lp"
                  label="LP"
                  description="Mark this item as a lot purchase"
                  checked={form.isLp}
                  onChange={(checked) => updateForm({ isLp: checked })}
                  icon={<IconTag className={form.isLp ? "text-white" : "text-[#6c757d]"} />}
                />
                <OptionToggleCard
                  id="rcv-print-labels"
                  label="Print Label"
                  description="Queue SKU labels after receiving"
                  checked={form.printLabels}
                  onChange={(checked) => updateForm({ printLabels: checked })}
                  icon={<IconPrinter className={form.printLabels ? "text-white" : "text-[#6c757d]"} />}
                />
                <OptionToggleCard
                  id="rcv-price-only"
                  label="Price Only"
                  description="Update price without receiving quantity"
                  checked={form.priceOnly}
                  onChange={handlePriceOnlyChange}
                  icon={
                    <IconBadgeDollarSign
                      className={form.priceOnly ? "text-white" : "text-[#6c757d]"}
                    />
                  }
                />
              </div>
            </div>

            {searchMessage ? (
              <p className="mb-4 text-sm text-[#181512]" role="status" aria-live="polite">
                {searchMessage}
              </p>
            ) : null}

            <FormActions>
              <Button type="submit" variant="primary" layout="form">
                Receive
              </Button>
              <Button type="button" variant="primary" layout="form" onClick={handleReprint}>
                Reprint
              </Button>
              <Button
                type="button"
                variant="primary"
                layout="form"
                onClick={handleUndoLastReceipt}
              >
                Undo Last Receipt
              </Button>
             
              <Button
                type="button"
                variant="primary"
                layout="form"
                onClick={openManifestModal}
              >
                View Manifest
              </Button>
              <Button type="button" variant="secondary" layout="form" onClick={resetForm}>
                Reset
              </Button>
            </FormActions>
          </form>
        </div>
      </AppContainer>

      {showManifestModal ? (
        <div
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowManifestModal(false);
          }}
        >
          <div
            className="flex max-h-[96vh] w-full max-w-[min(98vw,1400px)] flex-col rounded-t-[6px] bg-white shadow-lg sm:max-h-[94vh] sm:rounded-[6px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={manifestModalTitleId}
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[#dee2e6] px-3 py-3 sm:items-center sm:px-4">
              <h2
                id={manifestModalTitleId}
                className="m-0 pr-2 text-base font-semibold leading-snug text-[#d36838] sm:text-lg"
                style={boldFont}
              >
                View Manifest
              </h2>
              <button
                type="button"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#181512] hover:bg-[#f1f1f1]"
                aria-label="Close"
                onClick={() => setShowManifestModal(false)}
              >
                <IconClose />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 text-[#181512] sm:px-4">
              <ReceiveManifestViewTable
                key={manifestModalSession}
                rows={manifestRows}
                columns={manifestColumns}
                onRowSelect={handleManifestRowSelect}
              />
            </div>

            <ModalActions>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setShowManifestModal(false)}
              >
                Close
              </Button>
            </ModalActions>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
}
