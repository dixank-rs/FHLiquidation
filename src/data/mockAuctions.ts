/** Known mock auction IDs for static export and list/detail routes. */
export const MOCK_AUCTION_IDS = [
  "ABAB012",
  "ABAH017",
  "ABAH05",
  "ABABY01",
  "ABABY010",
  "ABABY011",
  "ABABY011-2",
  "ABABY013",
  "ABABY014",
  "ABABY015",
  "c21f44f2-58c5-4b6e-9d22-08de656f0ad1",
  "a82f44f2-58c5-4b6e-9d22-08de656f0bb2",
] as const;

export function generateAuctionIdParams() {
  return MOCK_AUCTION_IDS.map((id) => ({ id }));
}
