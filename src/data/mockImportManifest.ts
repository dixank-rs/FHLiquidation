import { formatDisplayDate, VENDOR_OPTIONS } from "@/data/mockPurchaseCodes";

export type ManifestItemRow = {
  id: string;
  itemNo: number;
  gtin: string;
  departmentName: string;
  category: string;
  description: string;
  qty: number;
  lastKnownPrice: number;
  extLastKnownPrice: number;
  purchasePct: number;
  unitCost: number;
  venue: string;
  fhlPrice: number;
};

export type ImportManifestFormState = {
  vendor: string;
  dealCode: string;
  manifestId: string;
  notes: string;
};

export type ManifestFileMeta = {
  fileName: string;
  uploadDate: string;
  totalRecords: number;
};

export const INITIAL_IMPORT_MANIFEST_FORM: ImportManifestFormState = {
  vendor: "",
  dealCode: "",
  manifestId: "",
  notes: "",
};

/** Deal codes grouped by vendor for dependent dropdown (UI mock). */
export const DEAL_CODES_BY_VENDOR: Record<string, string[]> = {
  "Acme Supply Co.": ["ATL172", "ATL201", "ATL305"],
  "Midwest Wholesale": ["CHI088", "CHI112"],
  "Lone Star Goods": ["DAL044", "DAL091"],
  "East Coast Liquidators": ["NYC220", "NYC318"],
  "Gulf Traders LLC": ["HOU055", "HOU077"],
  "Desert Outlet": ["PHX012"],
  "Pacific Surplus": ["SEA033", "SEA041"],
  "Sunshine Resale": ["MIA019", "MIA024"],
};

export const ALL_DEAL_CODES = Object.values(DEAL_CODES_BY_VENDOR).flat();

export { VENDOR_OPTIONS };

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatQty(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
}

/** Small sample set for UI preview (5 rows). */
export const MOCK_MANIFEST_ITEMS: ManifestItemRow[] = [
  {
    id: "1",
    itemNo: 1001,
    gtin: "00885954012345",
    departmentName: "Electronics",
    category: "TV & Home Theater",
    description: "55\" 4K Smart LED Television",
    qty: 12,
    lastKnownPrice: 449.99,
    extLastKnownPrice: 5399.88,
    purchasePct: 42.5,
    unitCost: 190.49,
    venue: "McLemore",
    fhlPrice: 299.99,
  },
  {
    id: "2",
    itemNo: 1002,
    gtin: "00885954023456",
    departmentName: "Electronics",
    category: "Audio",
    description: "Wireless Soundbar with Subwoofer",
    qty: 24,
    lastKnownPrice: 129.99,
    extLastKnownPrice: 3119.76,
    purchasePct: 38.0,
    unitCost: 49.4,
    venue: "McLemore",
    fhlPrice: 79.99,
  },
  {
    id: "3",
    itemNo: 1003,
    gtin: "00787420111223",
    departmentName: "Home",
    category: "Kitchen",
    description: "Stainless Steel Countertop Microwave",
    qty: 18,
    lastKnownPrice: 89.99,
    extLastKnownPrice: 1619.82,
    purchasePct: 45.0,
    unitCost: 40.5,
    venue: "Standard",
    fhlPrice: 59.99,
  },
  {
    id: "4",
    itemNo: 1004,
    gtin: "00787420122334",
    departmentName: "Home",
    category: "Bedding",
    description: "Queen Memory Foam Mattress Topper",
    qty: 30,
    lastKnownPrice: 59.99,
    extLastKnownPrice: 1799.7,
    purchasePct: 50.0,
    unitCost: 30.0,
    venue: "Standard",
    fhlPrice: 44.99,
  },
  {
    id: "5",
    itemNo: 1005,
    gtin: "00649965033445",
    departmentName: "Apparel",
    category: "Outerwear",
    description: "Men's Insulated Winter Jacket",
    qty: 48,
    lastKnownPrice: 79.99,
    extLastKnownPrice: 3839.52,
    purchasePct: 35.0,
    unitCost: 28.0,
    venue: "McLemore",
    fhlPrice: 49.99,
  },
];

export const SAMPLE_IMPORT_MANIFEST_FORM: ImportManifestFormState = {
  vendor: "Acme Supply Co.",
  dealCode: "ATL172",
  manifestId: "MAN-2024-ATL172",
  notes: "Sample manifest for UI preview.",
};

export type ManifestExcelColumn = {
  column: string;
  contents: string;
};

export const MANIFEST_EXCEL_COLUMNS: ManifestExcelColumn[] = [
  { column: "A", contents: "Item Number (Scan Code)" },
  { column: "B", contents: "UPC" },
  { column: "C", contents: "Department" },
  { column: "D", contents: "Department Name" },
  { column: "E", contents: "Category" },
  { column: "F", contents: "Item Description" },
  { column: "G", contents: "Qty" },
  { column: "H", contents: "Last Known Price" },
  { column: "I", contents: "Ext Last Known Price" },
  { column: "J", contents: "Buy %" },
  { column: "K", contents: "Cost Per Unit" },
  { column: "L", contents: "Venue" },
  { column: "M", contents: "FHL Price" },
  { column: "N", contents: "Notes" },
  { column: "O", contents: "Link" },
];

export const MANIFEST_IMPORT_NOTES = [
  "In order for the UPC codes to be imported properly, select the column with the UPC codes and format it as a number with zero decimal places. This will show all of the digits of the UPC except leading zeros. It is fine if the leading zeros are missing.",
  "The Manifest ID should be something that can uniquely identify the manifest, such as an order number, seal number, or similar identifier. It is best to use a consistent format so the system can determine whether a manifest with that Manifest ID has already been imported.",
] as const;

export function createSampleFileMeta(): ManifestFileMeta {
  return {
    fileName: "sample-manifest-atl172.xlsx",
    uploadDate: formatDisplayDate(),
    totalRecords: MOCK_MANIFEST_ITEMS.length,
  };
}

export function computeManifestTotals(items: ManifestItemRow[]) {
  return items.reduce(
    (acc, row) => ({
      totalQty: acc.totalQty + row.qty,
      totalExtLastKnownPrice: acc.totalExtLastKnownPrice + row.extLastKnownPrice,
    }),
    { totalQty: 0, totalExtLastKnownPrice: 0 },
  );
}
