"use client";

import { useParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import { IconEdit, IconFileText } from "@/components/common/icons";
import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { Button, ButtonLink, FormActions } from "@/components/common/Button";
import PageLayout from "@/components/layout/PageLayout";
import { boldFontStyle, lightFontStyle, semiBoldFontStyle } from "@/config/fonts";

type AuctionItem = {
  aStock: string;
  lot: string;
  sku: string;
  title: string;
  condition: string;
  description: string;
  category: string;
  pics: string;
};

const mockAuctionData = {
  auctionName: "BTest0602A1",
  status: "Processing",
  totalItems: "1",
  startingLot: "1",
  dateCreated: "Fri Feb 06 2026",
};

const mockTableData: AuctionItem[] = [
  {
    aStock: "Synced",
    lot: "1",
    sku: "NODEAL-45027086",
    title: "#1 Demo - (Appears New)",
    condition: "Appears New",
    description: "Generic Description",
    category: "Electronics",
    pics: "3",
  },
];

type FormFieldKey = "category" | "condition" | "unitCost" | "title" | "link" | "genericDescription";

type FieldErrors = Partial<Record<FormFieldKey, string>>;

function fieldBorderClass(error?: string) {
  return error ? "border-red-600 focus:border-red-600" : "border-[#cbcbcb] focus:border-[#86b7fe]";
}

function validateAuctionItemForm(values: {
  category: string;
  condition: string;
  unitCost: string;
  title: string;
  genericDescription: string;
  link: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const category = values.category.trim();
  const unitCostTrim = values.unitCost.trim();

  if (!category) errors.category = "Category is required.";
  if (!values.condition) errors.condition = "Please select a condition.";
  if (!unitCostTrim) errors.unitCost = "Unit cost is required.";
  else {
    const num = Number.parseFloat(unitCostTrim);
    if (Number.isNaN(num) || num < 0) errors.unitCost = "Enter a valid non-negative unit cost.";
  }
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.genericDescription.trim()) errors.genericDescription = "Generic description is required.";

  if (values.link.trim()) {
    try {
      const u = values.link.includes("://") ? values.link.trim() : `https://${values.link.trim()}`;
      void new URL(u);
    } catch {
      errors.link = "Enter a valid URL (e.g. https://example.com).";
    }
  }

  return errors;
}

export default function AuctionDetailPage() {
  const params = useParams();
  const auctionId = typeof params.id === "string" ? params.id : "";

  const [startingLotNo, setStartingLotNo] = useState("");
  const [upc, setUpc] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [genericDescription, setGenericDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const standardPicturesInputRef = useRef<HTMLInputElement>(null);
  const itemSpecificPicturesInputRef = useRef<HTMLInputElement>(null);

  const clearFieldError = (key: FormFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const resetForm = () => {
    setStartingLotNo("");
    setUpc("");
    setCategory("");
    setCondition("");
    setUnitCost("");
    setTitle("");
    setLink("");
    setGenericDescription("");
    setFieldErrors({});
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateAuctionItemForm({
      category,
      condition,
      unitCost,
      title,
      genericDescription,
      link,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setFieldErrors({});
  }

  const columns: ColumnConfig<AuctionItem>[] = [
    {
      key: "aStock",
      label: "AStock",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-[#28a745]" style={boldFontStyle}>
            {row.aStock}
          </span>
          <button type="button" suppressHydrationWarning className="text-gray-600 hover:text-gray-800" aria-label="View document">
            <IconFileText className="text-current" />
          </button>
        </div>
      ),
    },
    { key: "lot", label: "Lot #", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    {
      key: "title",
      label: "Title/Description",
      sortable: false,
      render: (row) => (
        <div className="whitespace-pre-line">
          {row.title}
          <br />
          <br />
          Condition: {row.condition}
          <br />
          <br />
          {row.description}
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true },
    { key: "pics", label: "Pics", sortable: false },
    {
      key: "viewImages",
      label: "View Images",
      sortable: false,
      className: "text-center",
      render: () => (
        <Link
          href={`/auction/${auctionId}/images`}
          className="inline-flex text-gray-600 hover:text-gray-800"
          aria-label="View images"
          onClick={(e) => e.stopPropagation()}
        >
          <IconFileText className="text-current" />
        </Link>
      ),
    },
    {
      key: "edit",
      label: "Edit",
      sortable: false,
      className: "text-center",
      render: () => (
        <button
          type="button"
          suppressHydrationWarning
          className="cursor-pointer text-[#d36838] hover:text-[#bb5c2f]"
          aria-label="Edit item"
        >
          <IconEdit className="text-current" />
        </button>
      ),
    },
  ];

  return (
    <PageLayout activeKey="dashboard">
      <AppContainer>
        <PageHeader title="Auction Item Details" />

        <div className={contentPanelClass}>
          <div className="mb-4 grid grid-cols-2 gap-4 rounded-[10px] bg-[#181512] px-4 py-3 text-white sm:grid-cols-3 md:flex md:flex-row md:flex-wrap md:justify-between xl:flex-nowrap">
            <div style={lightFontStyle}>
              Auction Name
              <strong className="block text-xl" style={boldFontStyle}>
                {mockAuctionData.auctionName} <span className="text-[#d36838]">AStock</span>
              </strong>
            </div>
            <div style={lightFontStyle}>
              Status
              <strong className="block text-xl" style={boldFontStyle}>
                {mockAuctionData.status}
              </strong>
            </div>
            <div style={lightFontStyle}>
              Total Items
              <strong className="block text-xl" style={boldFontStyle}>
                {mockAuctionData.totalItems}
              </strong>
            </div>
            <div style={lightFontStyle}>
              Starting Lot
              <strong className="block text-xl" style={boldFontStyle}>
                {mockAuctionData.startingLot}
              </strong>
            </div>
            <div style={lightFontStyle}>
              Date Created
              <strong className="block text-xl" style={boldFontStyle}>
                {mockAuctionData.dateCreated}
              </strong>
            </div>
          </div>

          <form key={auctionId} onSubmit={handleSubmit} noValidate>
            {Object.keys(fieldErrors).length > 0 && (
              <div
                className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                Please fix the highlighted fields below.
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="lotNo" style={semiBoldFontStyle}>
                  Lot #
                </label>
                <input
                  id="lotNo"
                  type="text"
                  className="w-full rounded-[5px] border border-[#cbcbcb] bg-[#e9ecef] px-2 py-[0.375rem] outline-none"
                  placeholder="3"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="startingLotNo" style={semiBoldFontStyle}>
                  Starting Lot No
                </label>
                <input
                  id="startingLotNo"
                  type="text"
                  autoComplete="off"
                  value={startingLotNo}
                  onChange={(e) => setStartingLotNo(e.target.value)}
                  className="w-full rounded-[5px] border border-[#cbcbcb] bg-white px-2 py-[0.375rem] outline-none focus:border-[#86b7fe]"
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="upc" style={semiBoldFontStyle}>
                  UPC
                </label>
                <input
                  id="upc"
                  type="text"
                  autoComplete="off"
                  value={upc}
                  onChange={(e) => setUpc(e.target.value)}
                  className="w-full rounded-[5px] border border-[#cbcbcb] bg-white px-2 py-[0.375rem] outline-none focus:border-[#86b7fe]"
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="category" style={semiBoldFontStyle}>
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  autoComplete="off"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearFieldError("category");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.category)}`}
                  aria-invalid={!!fieldErrors.category}
                  aria-describedby={fieldErrors.category ? "category-error" : undefined}
                />
                {fieldErrors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.category}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="condition" style={semiBoldFontStyle}>
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    clearFieldError("condition");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.condition)}`}
                  aria-invalid={!!fieldErrors.condition}
                  aria-describedby={fieldErrors.condition ? "condition-error" : undefined}
                >
                  <option value="">Select Status</option>
                  <option value="1">New</option>
                  <option value="2">New – Open Box</option>
                  <option value="3">New – Damaged Box</option>
                  <option value="4">See Description</option>
                </select>
                {fieldErrors.condition && (
                  <p id="condition-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.condition}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="unitCost" style={semiBoldFontStyle}>
                  Unit Cost
                </label>
                <input
                  id="unitCost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={unitCost}
                  onChange={(e) => {
                    setUnitCost(e.target.value);
                    clearFieldError("unitCost");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.unitCost)}`}
                  aria-invalid={!!fieldErrors.unitCost}
                  aria-describedby={fieldErrors.unitCost ? "unitCost-error" : undefined}
                />
                {fieldErrors.unitCost && (
                  <p id="unitCost-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.unitCost}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-3">
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="title" className="inline-block" style={semiBoldFontStyle}>
                    Title
                  </label>
                  <span className="text-[#d36838]">{title.length}/100</span>
                </div>
                <input
                  id="title"
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearFieldError("title");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.title)}`}
                  aria-invalid={!!fieldErrors.title}
                  aria-describedby={fieldErrors.title ? "title-error" : undefined}
                />
                {fieldErrors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.title}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="link" style={semiBoldFontStyle}>
                  Link
                </label>
                <input
                  id="link"
                  type="text"
                  inputMode="url"
                  placeholder="https://"
                  autoComplete="url"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    clearFieldError("link");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.link)}`}
                  aria-invalid={!!fieldErrors.link}
                  aria-describedby={fieldErrors.link ? "link-error" : undefined}
                />
                {fieldErrors.link && (
                  <p id="link-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.link}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="genericDescription" style={semiBoldFontStyle}>
                  Generic Description
                </label>
                <textarea
                  id="genericDescription"
                  value={genericDescription}
                  onChange={(e) => {
                    setGenericDescription(e.target.value);
                    clearFieldError("genericDescription");
                  }}
                  className={`w-full rounded-[5px] border bg-white px-2 py-[0.375rem] outline-none ${fieldBorderClass(fieldErrors.genericDescription)}`}
                  rows={3}
                  aria-invalid={!!fieldErrors.genericDescription}
                  aria-describedby={fieldErrors.genericDescription ? "genericDescription-error" : undefined}
                />
                {fieldErrors.genericDescription && (
                  <p id="genericDescription-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.genericDescription}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="itemSpecific" style={semiBoldFontStyle}>
                  Item Specific Information (Damages, etc...)
                </label>
                <textarea
                  id="itemSpecific"
                  className="w-full rounded-[5px] border border-[#cbcbcb] bg-[#e9ecef] px-2 py-[0.375rem] outline-none"
                  rows={3}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="standardPicturesInput" style={semiBoldFontStyle}>
                  Standard Pictures
                </label>
                <div
                  className="relative mx-auto flex h-[100px] w-full cursor-pointer flex-wrap items-center justify-center rounded-[5px] border border-[#D4DAEC] bg-[#EBEBEB] text-center text-lg text-[#999] transition-[border-color] duration-300 hover:border-[#333]"
                  role="button"
                  tabIndex={0}
                  onClick={() => standardPicturesInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      standardPicturesInputRef.current?.click();
                    }
                  }}
                >
                  <span className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-lg text-[#999]">
                    Drag and drop your file here!
                  </span>
                  <input
                    ref={standardPicturesInputRef}
                    id="standardPicturesInput"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2 inline-block" htmlFor="itemSpecificPicturesInput" style={semiBoldFontStyle}>
                  Item Specific Pictures
                </label>
                <div
                  className="relative mx-auto flex h-[100px] w-full cursor-pointer flex-wrap items-center justify-center rounded-[5px] border border-[#D4DAEC] bg-[#EBEBEB] text-center text-lg text-[#999] transition-[border-color] duration-300 hover:border-[#333]"
                  role="button"
                  tabIndex={0}
                  onClick={() => itemSpecificPicturesInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      itemSpecificPicturesInputRef.current?.click();
                    }
                  }}
                >
                  <span className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-lg text-[#999]">
                    Drag and drop your file here!
                  </span>
                  <input
                    ref={itemSpecificPicturesInputRef}
                    id="itemSpecificPicturesInput"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full min-w-0">
                <div className="my-3 flex flex-col items-center gap-2.5 xl:flex-row xl:flex-wrap xl:items-center xl:justify-center xl:gap-3">
                  <FormActions className="my-0">
                    <Button type="submit" variant="primary" layout="actionBar">
                      Save
                    </Button>
                    <Button type="button" variant="secondary" layout="actionBar" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button type="button" variant="primary" layout="actionBar">
                      Duplicate Last
                    </Button>
                    <Button type="button" variant="primary" layout="actionBar">
                      Export Auction
                    </Button>
                    <Button type="button" variant="primary" layout="actionBar">
                      Mark Complete
                    </Button>
                    <ButtonLink
                      href={`/auction/${auctionId}/images`}
                      variant="primary"
                      layout="actionBar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Images
                    </ButtonLink>
                  </FormActions>
                  <label
                    htmlFor="saveItem"
                    className="inline-flex cursor-pointer items-center gap-2 text-[15px] text-[#181512]"
                    style={semiBoldFontStyle}
                  >
                    <input
                      id="saveItem"
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-[#d36838]"
                    />
                    Save Item
                  </label>
                </div>
              </div>
            </div>
          </form>

          <hr className="my-4 border-t border-[#dee2e6]" />

          <DataTable
            data={mockTableData}
            columns={columns}
            enableSearch={false}
            enablePagination={false}
            enableSorting={false}
          />
        </div>
      </AppContainer>
    </PageLayout>
  );
}
