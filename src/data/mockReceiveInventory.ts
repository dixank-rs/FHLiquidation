import { ALL_DEAL_CODES, formatCurrency, formatQty, VENDOR_OPTIONS } from "@/data/mockImportManifest";

export type PricingMethod = "manual" | "percentage";

export type ReceiveFormState = {
  deal: string;
  scanBarcode: string;
  itemNumber: string;
  upcGtin: string;
  lookupVenue: string;
  lookupCategory: string;
  description: string;
  notes: string;
  link: string;
  quantityExpected: string;
  quantityReceived: string;
  quantityToReceive: string;
  receivingVenue: string;
  retailPrice: string;
  ourPrice: string;
  pricingMethod: PricingMethod;
  pricingPercentage: string;
  isLp: boolean;
  printLabels: boolean;
  priceOnly: boolean;
};

export type InventoryLookupItem = {
  id: string;
  deal: string;
  scanBarcode: string;
  itemNumber: string;
  upcGtin: string;
  lookupVenue: string;
  lookupCategory: string;
  description: string;
  notes: string;
  link: string;
  quantityExpected: number;
  quantityReceived: number;
  receivingVenue: string;
  retailPrice: number;
  ourPrice: number;
  isLp: boolean;
};

export type ManifestViewRow = {
  id: string;
  vendor: string;
  deal: string;
  manifestId: string;
  headerNotes: string;
  vendorItemNumber: string;
  gtin: string;
  department: string;
  category: string;
  description: string;
  qtyExpected: number;
  qtyReceived: number;
  retail: number;
  unitCost: number;
  venue: string;
  fhlPrice: number;
  notes: string;
  link: string;
};

export type LastReceiptSnapshot = {
  itemId: string;
  manifestRowId: string;
  quantityReceived: number;
  previousQtyReceived: number;
  formBefore: ReceiveFormState;
};

export const DEAL_OPTIONS = ALL_DEAL_CODES;

export const VENUE_OPTIONS = ["McLemore", "Standard", "Warehouse A", "Warehouse B"];

export const CATEGORY_OPTIONS = [
  "TV & Home Theater",
  "Audio",
  "Kitchen",
  "Bedding",
  "Outerwear",
  "Tools",
  "Furniture",
];

/** Configurable pricing percentage lookup values. */
export const PRICING_PERCENTAGE_OPTIONS = ["50", "60", "70", "80"];

export const INITIAL_RECEIVE_FORM: ReceiveFormState = {
  deal: "",
  scanBarcode: "",
  itemNumber: "",
  upcGtin: "",
  lookupVenue: "",
  lookupCategory: "",
  description: "",
  notes: "",
  link: "",
  quantityExpected: "",
  quantityReceived: "",
  quantityToReceive: "1",
  receivingVenue: "",
  retailPrice: "",
  ourPrice: "",
  pricingMethod: "manual",
  pricingPercentage: "60",
  isLp: false,
  printLabels: true,
  priceOnly: false,
};

export const MOCK_INVENTORY_ITEMS: InventoryLookupItem[] = [
  {
    id: "inv-1",
    deal: "ATL172",
    scanBarcode: "1001",
    itemNumber: "1001",
    upcGtin: "00885954012345",
    lookupVenue: "McLemore",
    lookupCategory: "TV & Home Theater",
    description: '55" 4K Smart LED Television with HDR and built-in streaming apps.',
    notes: "Handle with care — screen fragile.",
    link: "https://vendor.example.com/items/1001",
    quantityExpected: 12,
    quantityReceived: 4,
    receivingVenue: "McLemore",
    retailPrice: 449.99,
    ourPrice: 299.99,
    isLp: false,
  },
  {
    id: "inv-2",
    deal: "ATL172",
    scanBarcode: "1002",
    itemNumber: "1002",
    upcGtin: "00885954023456",
    lookupVenue: "McLemore",
    lookupCategory: "Audio",
    description: "Wireless Soundbar with Subwoofer and Bluetooth connectivity.",
    notes: "",
    link: "",
    quantityExpected: 24,
    quantityReceived: 10,
    receivingVenue: "McLemore",
    retailPrice: 129.99,
    ourPrice: 79.99,
    isLp: true,
  },
  {
    id: "inv-3",
    deal: "CHI088",
    scanBarcode: "2003",
    itemNumber: "2003",
    upcGtin: "00787420111223",
    lookupVenue: "Standard",
    lookupCategory: "Kitchen",
    description: "Stainless Steel Countertop Microwave, 1.1 cu ft.",
    notes: "Verify door seal on receipt.",
    link: "https://vendor.example.com/items/2003",
    quantityExpected: 18,
    quantityReceived: 6,
    receivingVenue: "Standard",
    retailPrice: 89.99,
    ourPrice: 59.99,
    isLp: false,
  },
  {
    id: "inv-4",
    deal: "DAL044",
    scanBarcode: "3004",
    itemNumber: "3004",
    upcGtin: "00649965033445",
    lookupVenue: "Warehouse A",
    lookupCategory: "Outerwear",
    description: "Men's Insulated Winter Jacket, assorted sizes.",
    notes: "Mixed sizes in carton.",
    link: "",
    quantityExpected: 48,
    quantityReceived: 20,
    receivingVenue: "Warehouse A",
    retailPrice: 79.99,
    ourPrice: 49.99,
    isLp: false,
  },
];

export const MOCK_MANIFEST_VIEW_ROWS: ManifestViewRow[] = [
  {
    id: "m-1",
    vendor: VENDOR_OPTIONS[0],
    deal: "ATL172",
    manifestId: "MAN-2024-ATL172",
    headerNotes: "Sample manifest for UI preview.",
    vendorItemNumber: "1001",
    gtin: "00885954012345",
    department: "Electronics",
    category: "TV & Home Theater",
    description: '55" 4K Smart LED Television',
    qtyExpected: 12,
    qtyReceived: 4,
    retail: 449.99,
    unitCost: 190.49,
    venue: "McLemore",
    fhlPrice: 299.99,
    notes: "Handle with care",
    link: "https://vendor.example.com/items/1001",
  },
  {
    id: "m-2",
    vendor: VENDOR_OPTIONS[0],
    deal: "ATL172",
    manifestId: "MAN-2024-ATL172",
    headerNotes: "Sample manifest for UI preview.",
    vendorItemNumber: "1002",
    gtin: "00885954023456",
    department: "Electronics",
    category: "Audio",
    description: "Wireless Soundbar with Subwoofer",
    qtyExpected: 24,
    qtyReceived: 10,
    retail: 129.99,
    unitCost: 49.4,
    venue: "McLemore",
    fhlPrice: 79.99,
    notes: "",
    link: "",
  },
  {
    id: "m-3",
    vendor: VENDOR_OPTIONS[1],
    deal: "CHI088",
    manifestId: "MAN-2024-CHI088",
    headerNotes: "Midwest inbound load.",
    vendorItemNumber: "2003",
    gtin: "00787420111223",
    department: "Home",
    category: "Kitchen",
    description: "Stainless Steel Countertop Microwave",
    qtyExpected: 18,
    qtyReceived: 6,
    retail: 89.99,
    unitCost: 40.5,
    venue: "Standard",
    fhlPrice: 59.99,
    notes: "Verify door seal",
    link: "https://vendor.example.com/items/2003",
  },
  {
    id: "m-4",
    vendor: VENDOR_OPTIONS[1],
    deal: "CHI088",
    manifestId: "MAN-2024-CHI088",
    headerNotes: "Midwest inbound load.",
    vendorItemNumber: "2004",
    gtin: "00787420122334",
    department: "Home",
    category: "Bedding",
    description: "Queen Memory Foam Mattress Topper",
    qtyExpected: 30,
    qtyReceived: 12,
    retail: 59.99,
    unitCost: 30.0,
    venue: "Standard",
    fhlPrice: 44.99,
    notes: "",
    link: "",
  },
  {
    id: "m-5",
    vendor: VENDOR_OPTIONS[2],
    deal: "DAL044",
    manifestId: "MAN-2024-DAL044",
    headerNotes: "Lone Star seasonal apparel.",
    vendorItemNumber: "3004",
    gtin: "00649965033445",
    department: "Apparel",
    category: "Outerwear",
    description: "Men's Insulated Winter Jacket",
    qtyExpected: 48,
    qtyReceived: 20,
    retail: 79.99,
    unitCost: 28.0,
    venue: "Warehouse A",
    fhlPrice: 49.99,
    notes: "Mixed sizes",
    link: "",
  },
  {
    id: "m-6",
    vendor: VENDOR_OPTIONS[2],
    deal: "DAL044",
    manifestId: "MAN-2024-DAL044",
    headerNotes: "Lone Star seasonal apparel.",
    vendorItemNumber: "3005",
    gtin: "00649965044556",
    department: "Apparel",
    category: "Outerwear",
    description: "Women's Fleece Pullover",
    qtyExpected: 36,
    qtyReceived: 8,
    retail: 49.99,
    unitCost: 18.5,
    venue: "Warehouse A",
    fhlPrice: 34.99,
    notes: "",
    link: "",
  },
  {
    id: "m-7",
    vendor: VENDOR_OPTIONS[3],
    deal: "NYC220",
    manifestId: "MAN-2024-NYC220",
    headerNotes: "East coast tools pallet.",
    vendorItemNumber: "4101",
    gtin: "00477421155667",
    department: "Hardware",
    category: "Tools",
    description: "Cordless Drill/Driver Kit 20V",
    qtyExpected: 15,
    qtyReceived: 3,
    retail: 119.99,
    unitCost: 52.0,
    venue: "Warehouse B",
    fhlPrice: 89.99,
    notes: "Battery included",
    link: "https://vendor.example.com/items/4101",
  },
  {
    id: "m-8",
    vendor: VENDOR_OPTIONS[4],
    deal: "HOU055",
    manifestId: "MAN-2024-HOU055",
    headerNotes: "",
    vendorItemNumber: "5102",
    gtin: "00378640166778",
    department: "Furniture",
    category: "Furniture",
    description: "Ergonomic Office Chair with Lumbar Support",
    qtyExpected: 10,
    qtyReceived: 2,
    retail: 199.99,
    unitCost: 85.0,
    venue: "McLemore",
    fhlPrice: 149.99,
    notes: "Boxed flat",
    link: "",
  },
  {
    id: "m-9",
    vendor: VENDOR_OPTIONS[5],
    deal: "PHX012",
    manifestId: "MAN-2024-PHX012",
    headerNotes: "Desert outlet overflow.",
    vendorItemNumber: "6103",
    gtin: "00222233344455",
    department: "Electronics",
    category: "Audio",
    description: "Bluetooth Over-Ear Headphones",
    qtyExpected: 40,
    qtyReceived: 15,
    retail: 69.99,
    unitCost: 24.5,
    venue: "Standard",
    fhlPrice: 44.99,
    notes: "",
    link: "",
  },
  {
    id: "m-10",
    vendor: VENDOR_OPTIONS[6],
    deal: "SEA033",
    manifestId: "MAN-2024-SEA033",
    headerNotes: "Pacific surplus mixed lot.",
    vendorItemNumber: "7104",
    gtin: "00111122233344",
    department: "Home",
    category: "Kitchen",
    description: "12-Piece Nonstick Cookware Set",
    qtyExpected: 8,
    qtyReceived: 0,
    retail: 149.99,
    unitCost: 62.0,
    venue: "Warehouse B",
    fhlPrice: 99.99,
    notes: "New in box",
    link: "https://vendor.example.com/items/7104",
  },
  {
    id: "m-11",
    vendor: VENDOR_OPTIONS[7],
    deal: "MIA019",
    manifestId: "MAN-2024-MIA019",
    headerNotes: "Sunshine resale batch.",
    vendorItemNumber: "8105",
    gtin: "00998877665544",
    department: "Electronics",
    category: "TV & Home Theater",
    description: "32\" HD LED Television",
    qtyExpected: 20,
    qtyReceived: 5,
    retail: 179.99,
    unitCost: 72.0,
    venue: "McLemore",
    fhlPrice: 129.99,
    notes: "",
    link: "",
  },
  {
    id: "m-12",
    vendor: VENDOR_OPTIONS[7],
    deal: "MIA024",
    manifestId: "MAN-2024-MIA024",
    headerNotes: "Sunshine resale batch.",
    vendorItemNumber: "8106",
    gtin: "00887766554433",
    department: "Apparel",
    category: "Outerwear",
    description: "Youth Rain Jacket",
    qtyExpected: 60,
    qtyReceived: 18,
    retail: 34.99,
    unitCost: 12.25,
    venue: "Standard",
    fhlPrice: 24.99,
    notes: "Assorted colors",
    link: "",
  },
];

export function manifestRowToForm(row: ManifestViewRow): ReceiveFormState {
  return {
    deal: row.deal,
    scanBarcode: row.vendorItemNumber,
    itemNumber: row.vendorItemNumber,
    upcGtin: row.gtin,
    lookupVenue: row.venue,
    lookupCategory: row.category,
    description: row.description,
    notes: row.notes,
    link: row.link,
    quantityExpected: String(row.qtyExpected),
    quantityReceived: String(row.qtyReceived),
    quantityToReceive: "1",
    receivingVenue: row.venue,
    retailPrice: row.retail.toFixed(2),
    ourPrice: row.fhlPrice.toFixed(2),
    pricingMethod: "manual",
    pricingPercentage: "60",
    isLp: false,
    printLabels: true,
    priceOnly: false,
  };
}

export function inventoryItemToForm(item: InventoryLookupItem): ReceiveFormState {
  return {
    deal: item.deal,
    scanBarcode: item.scanBarcode,
    itemNumber: item.itemNumber,
    upcGtin: item.upcGtin,
    lookupVenue: item.lookupVenue,
    lookupCategory: item.lookupCategory,
    description: item.description,
    notes: item.notes,
    link: item.link,
    quantityExpected: String(item.quantityExpected),
    quantityReceived: String(item.quantityReceived),
    quantityToReceive: "1",
    receivingVenue: item.receivingVenue,
    retailPrice: item.retailPrice.toFixed(2),
    ourPrice: item.ourPrice.toFixed(2),
    pricingMethod: "manual",
    pricingPercentage: "60",
    isLp: item.isLp,
    printLabels: true,
    priceOnly: false,
  };
}

export function formatReceivedExpected(received: string, expected: string): string {
  const rcvd = received.trim() || "0";
  const exp = expected.trim() || "0";
  return `${rcvd} / ${exp}`;
}

export function findInventoryItem(
  items: InventoryLookupItem[],
  criteria: Pick<ReceiveFormState, "deal" | "scanBarcode" | "itemNumber" | "upcGtin" | "lookupVenue" | "lookupCategory">,
): InventoryLookupItem | undefined {
  const deal = criteria.deal.trim();
  if (!deal) return undefined;

  const needle = [
    criteria.scanBarcode.trim(),
    criteria.itemNumber.trim(),
    criteria.upcGtin.trim(),
  ].find((value) => value.length > 0);

  const pool = items.filter((item) => item.deal === deal);

  if (!needle) {
    if (criteria.lookupVenue) {
      const byVenue = pool.find((item) => item.lookupVenue === criteria.lookupVenue);
      if (byVenue) return byVenue;
    }
    if (criteria.lookupCategory) {
      return pool.find((item) => item.lookupCategory === criteria.lookupCategory);
    }
    return pool[0];
  }

  return pool.find(
    (item) =>
      item.scanBarcode === needle ||
      item.itemNumber === needle ||
      item.upcGtin.includes(needle) ||
      needle.includes(item.upcGtin),
  );
}

export function calculateOurPriceFromPercentage(retailPrice: string, percentage: string): string {
  const retail = Number.parseFloat(retailPrice);
  const pct = Number.parseFloat(percentage);
  if (!Number.isFinite(retail) || !Number.isFinite(pct)) return "";
  return (retail * (pct / 100)).toFixed(2);
}

export function parseCurrency(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export { formatCurrency, formatQty };
