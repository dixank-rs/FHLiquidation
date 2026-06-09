import type { Metadata } from "next";
import ScrollToTopOnNavigate from "@/components/layout/ScrollToTopOnNavigate";
import StripExtensionHydrationScript from "@/components/StripExtensionHydrationScript";
import { assetPath } from "@/config/site";
import "./globals.css";
import "../styles/index.scss";

export const metadata: Metadata = {
  metadataBase: new URL("https://dixank-rs.github.io"),
  title: "FH Liquidation Auction Tool",
  description: "FH Liquidation Auction Tool - Login to manage your auction activities",
  icons: {
    icon: [
      { url: assetPath("/favicon.ico"), sizes: "any" },
      { url: assetPath("/favicon.ico"), sizes: "32x32", type: "image/x-icon" },
    ],
    apple: assetPath("/touch-icon.png"),
    shortcut: assetPath("/favicon.ico"),
  },
  openGraph: {
    images: [assetPath("/img_social_og.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={assetPath("/favicon.ico")} sizes="any" />
        <link rel="apple-touch-icon" href={assetPath("/touch-icon.png")} />
      </head>
      <body suppressHydrationWarning>
        <StripExtensionHydrationScript />
        <ScrollToTopOnNavigate />
        {children}
      </body>
    </html>
  );
}
