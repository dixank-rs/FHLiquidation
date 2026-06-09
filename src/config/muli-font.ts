import localFont from "next/font/local";

export const muli = localFont({
  src: [
    {
      path: "../../public/fonts/Muli-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Muli.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Muli-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Muli-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-muli",
  display: "swap",
});
