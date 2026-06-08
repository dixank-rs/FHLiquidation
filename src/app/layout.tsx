import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTopOnNavigate from "@/components/layout/ScrollToTopOnNavigate";
import StripExtensionHydrationScript from "@/components/StripExtensionHydrationScript";
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
  title: "FH Liquidation Auction Tool",
  description: "FH Liquidation Auction Tool - Login to manage your auction activities",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: '/touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    images: ['/img_social_og.jpg'],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <StripExtensionHydrationScript />
        <ScrollToTopOnNavigate />
        {children}
      </body>
    </html>
  );
}
