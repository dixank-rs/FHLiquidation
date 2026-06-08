export type ViewportSize = {
  name: string;
  width: number;
  height: number;
};

/** Industry-standard viewport matrix for responsive QA. */
export const VIEWPORTS: ViewportSize[] = [
  { name: "mobile-s", width: 320, height: 568 },
  { name: "mobile-m", width: 375, height: 812 },
  { name: "mobile-l", width: 414, height: 896 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1920, height: 1080 },
];

/** Tailwind breakpoint edges used heavily in FHIL layouts. */
export const BREAKPOINT_EDGE_VIEWPORTS: ViewportSize[] = [
  { name: "below-sm", width: 639, height: 800 },
  { name: "at-sm", width: 640, height: 800 },
  { name: "below-lg-nav", width: 1023, height: 800 },
  { name: "at-lg-nav", width: 1024, height: 800 },
  { name: "below-xl", width: 1279, height: 800 },
  { name: "at-xl", width: 1280, height: 800 },
];

export const MOBILE_NAV_MAX_WIDTH = 1023;
export const DESKTOP_NAV_MIN_WIDTH = 1024;
