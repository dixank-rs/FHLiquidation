import { generateAuctionIdParams } from "@/data/mockAuctions";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return generateAuctionIdParams();
}

type AuctionIdLayoutProps = {
  children: ReactNode;
};

export default function AuctionIdLayout({ children }: AuctionIdLayoutProps) {
  return children;
}
