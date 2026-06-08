export type PurchaseCodeRecord = {
  id: string;
  purchaseCode: string;
  purchasedBy: string;
  vendor: string;
  location: string;
  orderNumber: string;
  datePurchased: string;
  substitute: string;
  substituteBy: string;
  dateSubstituted: string;
  allSkusAreLps: boolean;
  dateCreated: string;
  createdBy: string;
  dateUpdated: string;
  updatedBy: string;
  dateClosed: string;
  closedBy: string;
  defaultMarginPct: string;
  isActive: boolean;
};

export const VENDOR_OPTIONS = [
  "Acme Supply Co.",
  "Midwest Wholesale",
  "Lone Star Goods",
  "East Coast Liquidators",
  "Gulf Traders LLC",
  "Desert Outlet",
  "Pacific Surplus",
  "Sunshine Resale",
];

export const LOCATION_OPTIONS = [
  "Atlanta",
  "Chicago",
  "Dallas",
  "New York",
  "Houston",
  "Phoenix",
  "Seattle",
  "Miami",
];

export const USER_OPTIONS = [
  "admin",
  "jsmith",
  "mlee",
  "arivera",
  "tbrooks",
  "cnguyen",
  "Jordan Smith",
  "Morgan Lee",
  "Alex Rivera",
];

export const MOCK_PURCHASE_CODES: PurchaseCodeRecord[] = [
  {
    id: "1",
    purchaseCode: "ATL172",
    purchasedBy: "Jordan Smith",
    vendor: "Acme Supply Co.",
    location: "Atlanta",
    orderNumber: "PO-4401",
    datePurchased: "Mon Jan 15 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: false,
    dateCreated: "Mon Jan 15 2024",
    createdBy: "admin",
    dateUpdated: "Mon Jan 15 2024",
    updatedBy: "admin",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "35",
    isActive: true,
  },
  {
    id: "2",
    purchaseCode: "CHI201",
    purchasedBy: "Morgan Lee",
    vendor: "Midwest Wholesale",
    location: "Chicago",
    orderNumber: "PO-5120",
    datePurchased: "Wed Mar 06 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: true,
    dateCreated: "Wed Mar 06 2024",
    createdBy: "jsmith",
    dateUpdated: "Wed Mar 06 2024",
    updatedBy: "mlee",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "40",
    isActive: true,
  },
  {
    id: "3",
    purchaseCode: "DAL088",
    purchasedBy: "Alex Rivera",
    vendor: "Lone Star Goods",
    location: "Dallas",
    orderNumber: "PO-3308",
    datePurchased: "Fri Jun 21 2024",
    substitute: "DAL090",
    substituteBy: "Alex Rivera",
    dateSubstituted: "Mon Jul 01 2024",
    allSkusAreLps: false,
    dateCreated: "Fri Jun 21 2024",
    createdBy: "admin",
    dateUpdated: "Tue Dec 10 2024",
    updatedBy: "arivera",
    dateClosed: "Tue Dec 10 2024",
    closedBy: "arivera",
    defaultMarginPct: "32",
    isActive: true,
  },
  {
    id: "4",
    purchaseCode: "NYC099",
    purchasedBy: "Taylor Brooks",
    vendor: "East Coast Liquidators",
    location: "New York",
    orderNumber: "PO-7782",
    datePurchased: "Tue Sep 03 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: false,
    dateCreated: "Tue Sep 03 2024",
    createdBy: "tbrooks",
    dateUpdated: "Tue Sep 03 2024",
    updatedBy: "admin",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "28",
    isActive: false,
  },
  {
    id: "5",
    purchaseCode: "HOU044",
    purchasedBy: "Casey Nguyen",
    vendor: "Gulf Traders LLC",
    location: "Houston",
    orderNumber: "PO-2219",
    datePurchased: "Thu Nov 14 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: true,
    dateCreated: "Thu Nov 14 2024",
    createdBy: "cnguyen",
    dateUpdated: "Thu Nov 14 2024",
    updatedBy: "cnguyen",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "30",
    isActive: false,
  },
  {
    id: "6",
    purchaseCode: "PHX115",
    purchasedBy: "Jordan Smith",
    vendor: "Desert Outlet",
    location: "Phoenix",
    orderNumber: "PO-6610",
    datePurchased: "Wed Aug 21 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: false,
    dateCreated: "Wed Aug 21 2024",
    createdBy: "admin",
    dateUpdated: "Wed Aug 21 2024",
    updatedBy: "jsmith",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "38",
    isActive: true,
  },
  {
    id: "7",
    purchaseCode: "SEA077",
    purchasedBy: "Morgan Lee",
    vendor: "Pacific Surplus",
    location: "Seattle",
    orderNumber: "PO-9044",
    datePurchased: "Mon Feb 12 2024",
    substitute: "SEA080",
    substituteBy: "Morgan Lee",
    dateSubstituted: "Wed Mar 20 2024",
    allSkusAreLps: false,
    dateCreated: "Mon Feb 12 2024",
    createdBy: "mlee",
    dateUpdated: "Fri Oct 18 2024",
    updatedBy: "mlee",
    dateClosed: "Fri Oct 18 2024",
    closedBy: "mlee",
    defaultMarginPct: "33",
    isActive: true,
  },
  {
    id: "8",
    purchaseCode: "MIA033",
    purchasedBy: "Alex Rivera",
    vendor: "Sunshine Resale",
    location: "Miami",
    orderNumber: "PO-1183",
    datePurchased: "Fri May 17 2024",
    substitute: "",
    substituteBy: "",
    dateSubstituted: "",
    allSkusAreLps: false,
    dateCreated: "Fri May 17 2024",
    createdBy: "arivera",
    dateUpdated: "Fri May 17 2024",
    updatedBy: "admin",
    dateClosed: "—",
    closedBy: "",
    defaultMarginPct: "25",
    isActive: false,
  },
];

export type PurchaseCodeFormState = {
  purchaseCode: string;
  datePurchased: string;
  vendor: string;
  orderNumber: string;
  location: string;
  substitute: string;
  dateSubstituted: string;
  substituteBy: string;
  allSkusAreLps: boolean;
  dateCreated: string;
  createdBy: string;
  dateUpdated: string;
  updatedBy: string;
  dateClosed: string;
  closedBy: string;
  defaultMarginPct: string;
};

export function formatDisplayDate(date: Date = new Date()) {
  return date.toDateString();
}

/** Converts stored/display dates to `YYYY-MM-DD` for `<input type="date" />`. */
export function toIsoDateInput(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Converts `YYYY-MM-DD` from date inputs to display strings used in the grid. */
export function isoDateToDisplay(iso: string): string {
  if (!iso) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso.trim();
  return new Date(`${iso}T12:00:00`).toDateString();
}

/** Stable initial state for SSR/hydration (no `new Date()`). */
export const INITIAL_PURCHASE_CODE_FORM: PurchaseCodeFormState = {
  purchaseCode: "",
  datePurchased: "",
  vendor: "",
  orderNumber: "",
  location: "",
  substitute: "",
  dateSubstituted: "",
  substituteBy: "",
  allSkusAreLps: false,
  dateCreated: "",
  createdBy: "admin",
  dateUpdated: "",
  updatedBy: "admin",
  dateClosed: "",
  closedBy: "",
  defaultMarginPct: "20",
};

export function emptyPurchaseCodeForm(): PurchaseCodeFormState {
  return { ...INITIAL_PURCHASE_CODE_FORM };
}

/** Call on the client when creating/resetting a new purchase code. */
export function newPurchaseCodeFormWithToday(): PurchaseCodeFormState {
  const today = formatDisplayDate();
  const todayIso = toIsoDateInput(today);
  return {
    ...INITIAL_PURCHASE_CODE_FORM,
    datePurchased: todayIso,
    dateCreated: today,
    dateUpdated: today,
  };
}

export function recordToForm(record: PurchaseCodeRecord): PurchaseCodeFormState {
  return {
    purchaseCode: record.purchaseCode,
    datePurchased: toIsoDateInput(record.datePurchased),
    vendor: record.vendor,
    orderNumber: record.orderNumber,
    location: record.location,
    substitute: record.substitute,
    dateSubstituted: toIsoDateInput(record.dateSubstituted),
    substituteBy: record.substituteBy,
    allSkusAreLps: record.allSkusAreLps,
    dateCreated: record.dateCreated,
    createdBy: record.createdBy,
    dateUpdated: record.dateUpdated,
    updatedBy: record.updatedBy,
    dateClosed: record.dateClosed === "—" ? "" : record.dateClosed,
    closedBy: record.closedBy,
    defaultMarginPct: record.defaultMarginPct,
  };
}

export function formToRecord(
  form: PurchaseCodeFormState,
  id: string,
  isActive: boolean,
  purchasedBy: string,
): PurchaseCodeRecord {
  return {
    id,
    purchaseCode: form.purchaseCode.trim(),
    purchasedBy,
    vendor: form.vendor.trim(),
    location: form.location.trim(),
    orderNumber: form.orderNumber.trim(),
    datePurchased: isoDateToDisplay(form.datePurchased.trim()),
    substitute: form.substitute.trim(),
    substituteBy: form.substituteBy.trim(),
    dateSubstituted: isoDateToDisplay(form.dateSubstituted.trim()),
    allSkusAreLps: form.allSkusAreLps,
    dateCreated: form.dateCreated.trim(),
    createdBy: form.createdBy.trim(),
    dateUpdated: form.dateUpdated.trim(),
    updatedBy: form.updatedBy.trim(),
    dateClosed: form.dateClosed.trim() || "—",
    closedBy: form.closedBy.trim(),
    defaultMarginPct: form.defaultMarginPct.trim() || "20",
    isActive,
  };
}
