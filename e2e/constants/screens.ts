export type ScreenLayout = "auth" | "app";

export type ScreenDefinition = {
  id: string;
  path: string;
  heading: RegExp;
  layout: ScreenLayout;
};

export const SAMPLE_AUCTION_ID = "ABAB012";

/** All designed UI routes (login has two entry URLs). */
export const UI_SCREENS: ScreenDefinition[] = [
  { id: "login-home", path: "/", heading: /Welcome back!/i, layout: "auth" },
  { id: "login", path: "/login", heading: /Welcome back!/i, layout: "auth" },
  { id: "select-auction", path: "/auction", heading: /Select Auction/i, layout: "app" },
  { id: "new-auction", path: "/auction/new", heading: /New Auction/i, layout: "app" },
  { id: "users", path: "/users", heading: /^Users$/i, layout: "app" },
  { id: "conditions", path: "/conditions", heading: /^Conditions$/i, layout: "app" },
  {
    id: "auction-detail",
    path: `/auction/${SAMPLE_AUCTION_ID}`,
    heading: /Auction Item Details/i,
    layout: "app",
  },
  {
    id: "auction-images",
    path: `/auction/${SAMPLE_AUCTION_ID}/images`,
    heading: /View Images/i,
    layout: "app",
  },
];
