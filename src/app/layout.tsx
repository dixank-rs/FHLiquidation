import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTopOnNavigate from "@/components/layout/ScrollToTopOnNavigate";
import StripExtensionHydrationScript from "@/components/StripExtensionHydrationScript";
import { assetPath } from "@/config/site";
import "./globals.css";
import "../styles/index.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
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
