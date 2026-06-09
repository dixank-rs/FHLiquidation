import type { CSSProperties } from "react";

const fontFamilyMuli = "var(--font-muli), sans-serif";

/** Body / long-form content */
export const fontFamilyBody = fontFamilyMuli;

/** Header, navigation, page headings */
export const fontFamilyHeading = fontFamilyMuli;

/** Login and auth screens */
export const fontFamilyAuth = fontFamilyMuli;

/** Footer small text */
export const fontFamilyFooter = fontFamilyMuli;

/** @deprecated Use fontFamilyBody — kept for backward compatibility */
export const fontFamily = fontFamilyBody;

export const fontRegular: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 400,
  lineHeight: 1.6,
};

export const fontLight: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 300,
  lineHeight: 1.6,
};

export const fontMedium: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 400,
  lineHeight: 1.5,
};

export const fontSemiBold: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 600,
  lineHeight: 1.45,
};

export const fontBold: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
};

/** Form labels — regular Muli, not bold */
export const labelFont: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: 1.4,
};

/** Page and section headings */
export const titleFont: CSSProperties = {
  fontFamily: fontFamilyHeading,
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.025em",
};

/** Buttons and primary actions */
export const buttonFont: CSSProperties = {
  fontFamily: fontFamilyBody,
  fontWeight: 700,
  letterSpacing: "0.02em",
};

/** Auth screen typography */
export const authTitleFont: CSSProperties = {
  fontFamily: fontFamilyAuth,
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
};

export const authLabelFont: CSSProperties = {
  fontFamily: fontFamilyAuth,
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: 1.4,
};

export const authFontRegular: CSSProperties = {
  fontFamily: fontFamilyAuth,
  fontWeight: 400,
  lineHeight: 1.5,
};

export const footerFont: CSSProperties = {
  fontFamily: fontFamilyFooter,
  fontWeight: 600,
  lineHeight: 1.45,
};

export const boldFont = fontBold;
export const semiBoldFont = fontSemiBold;
