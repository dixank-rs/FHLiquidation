import { manifestRowToForm, MOCK_MANIFEST_VIEW_ROWS } from "@/data/mockReceiveInventory";

describe("manifestRowToForm", () => {
  it("maps manifest row fields into the receive form", () => {
    const row = MOCK_MANIFEST_VIEW_ROWS[0];

    expect(manifestRowToForm(row)).toEqual({
      deal: "ATL172",
      scanBarcode: "1001",
      itemNumber: "1001",
      upcGtin: "00885954012345",
      lookupVenue: "McLemore",
      lookupCategory: "TV & Home Theater",
      description: '55" 4K Smart LED Television',
      notes: "Handle with care",
      link: "https://vendor.example.com/items/1001",
      quantityExpected: "12",
      quantityReceived: "4",
      quantityToReceive: "1",
      receivingVenue: "McLemore",
      retailPrice: "449.99",
      ourPrice: "299.99",
      pricingMethod: "manual",
      pricingPercentage: "60",
      isLp: false,
      printLabels: true,
      priceOnly: false,
    });
  });
});
