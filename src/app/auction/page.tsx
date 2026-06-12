"use client";

import Link from "next/link";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/common/Button";
import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { useMemo, useState } from "react";

type Auction = {
  id: string;
  name: string;
  type: string;
  status: string;
  totalItems: number;
  dateCreated: string;
  dateFinalized: string;
  startingLot: number;
};

const initialAuctions: Auction[] = [
  {
    id: "ABAB012",
    name: "ABAB012",
    type: "McLemore",
    status: "Complete",
    totalItems: 205,
    dateCreated: "Wed Aug 14 2024",
    dateFinalized: "Mon Jan 20 2025",
    startingLot: 1,
  },
  {
    id: "ABAH017",
    name: "ABAH017",
    type: "McLemore",
    status: "Complete",
    totalItems: 150,
    dateCreated: "Mon Sep 09 2024",
    dateFinalized: "Mon Sep 09 2024",
    startingLot: 1,
  },
  {
    id: "ABAH05",
    name: "ABAH05",
    type: "McLemore",
    status: "Complete",
    totalItems: 193,
    dateCreated: "Fri Jun 21 2024",
    dateFinalized: "Fri Jun 21 2024",
    startingLot: 1,
  },
  {
    id: "ABABY01",
    name: "ABABY01",
    type: "McLemore",
    status: "Complete",
    totalItems: 120,
    dateCreated: "Fri Nov 10 2023",
    dateFinalized: "Fri Nov 10 2023",
    startingLot: 1,
  },
  {
    id: "ABABY010",
    name: "ABABY010",
    type: "McLemore",
    status: "Complete",
    totalItems: 150,
    dateCreated: "Wed Jul 31 2024",
    dateFinalized: "Wed Jul 31 2024",
    startingLot: 1,
  },
  {
    id: "ABABY011",
    name: "ABABY011",
    type: "McLemore",
    status: "Complete",
    totalItems: 101,
    dateCreated: "Fri Aug 09 2024",
    dateFinalized: "Fri Aug 09 2024",
    startingLot: 1,
  },
  {
    id: "ABABY011-2",
    name: "ABABY011",
    type: "McLemore",
    status: "Complete",
    totalItems: 0,
    dateCreated: "Fri Aug 09 2024",
    dateFinalized: "Fri Aug 09 2024",
    startingLot: 1,
  },
  {
    id: "ABABY013",
    name: "ABABY013",
    type: "McLemore",
    status: "Complete",
    totalItems: 149,
    dateCreated: "Wed Aug 21 2024",
    dateFinalized: "Wed Aug 21 2024",
    startingLot: 1,
  },
  {
    id: "ABABY014",
    name: "ABABY014",
    type: "McLemore",
    status: "Complete",
    totalItems: 151,
    dateCreated: "Thu Aug 29 2024",
    dateFinalized: "Thu Aug 29 2024",
    startingLot: 1,
  },
  {
    id: "ABABY015",
    name: "ABABY015",
    type: "McLemore",
    status: "Complete",
    totalItems: 63,
    dateCreated: "Tue Sep 03 2024",
    dateFinalized: "Tue Sep 03 2024",
    startingLot: 1,
  },
  {
    id: "c21f44f2-58c5-4b6e-9d22-08de656f0ad1",
    name: "Blattner Test",
    type: "Standard",
    status: "Processing",
    totalItems: 2,
    dateCreated: "Tue Mar 26 2024",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "a82f44f2-58c5-4b6e-9d22-08de656f0bb2",
    name: "CFURN288",
    type: "Standard",
    status: "Processing",
    totalItems: 78,
    dateCreated: "Wed May 08 2024",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "BTEST0602A1",
    name: "BTEST0602A1",
    type: "McLemore",
    status: "Processing",
    totalItems: 45,
    dateCreated: "Mon Jun 02 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "FHMAY2025",
    name: "FHMAY2025",
    type: "Standard",
    status: "Processing",
    totalItems: 112,
    dateCreated: "Thu May 15 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "AUCTION2401",
    name: "AUCTION2401",
    type: "McLemore",
    status: "Processing",
    totalItems: 34,
    dateCreated: "Wed Jan 10 2024",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "INVTEST03",
    name: "INVTEST03",
    type: "Standard",
    status: "Processing",
    totalItems: 19,
    dateCreated: "Fri Feb 14 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "LOTSHIP01",
    name: "LOTSHIP01",
    type: "McLemore",
    status: "Processing",
    totalItems: 56,
    dateCreated: "Mon Mar 03 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "WAREHOUSE22",
    name: "WAREHOUSE22",
    type: "Standard",
    status: "Processing",
    totalItems: 88,
    dateCreated: "Tue Apr 22 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "FHJUN2025",
    name: "FHJUN2025",
    type: "McLemore",
    status: "Processing",
    totalItems: 142,
    dateCreated: "Wed Jun 11 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "PALLET100",
    name: "PALLET100",
    type: "Standard",
    status: "Processing",
    totalItems: 27,
    dateCreated: "Thu Jul 17 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "MCLEM2406",
    name: "MCLEM2406",
    type: "McLemore",
    status: "Processing",
    totalItems: 63,
    dateCreated: "Fri Aug 01 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "STDFURN45",
    name: "STDFURN45",
    type: "Standard",
    status: "Processing",
    totalItems: 91,
    dateCreated: "Sat Sep 06 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "BATCH077",
    name: "BATCH077",
    type: "McLemore",
    status: "Processing",
    totalItems: 15,
    dateCreated: "Sun Oct 12 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "CLEARANCE9",
    name: "CLEARANCE9",
    type: "Standard",
    status: "Processing",
    totalItems: 204,
    dateCreated: "Mon Nov 03 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
  {
    id: "PREPLOT33",
    name: "PREPLOT33",
    type: "McLemore",
    status: "Processing",
    totalItems: 48,
    dateCreated: "Tue Dec 09 2025",
    dateFinalized: "-",
    startingLot: 1,
  },
];

export default function AuctionPage() {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedAuctionIds, setSelectedAuctionIds] = useState<string[]>([]);

  const filteredAuctions = auctions.filter((auction) => {
    return showCompleted || auction.status !== "Complete";
  });

  const selectedAuctions = auctions.filter((auction) => selectedAuctionIds.includes(auction.id));
  const hasSelectedComplete = selectedAuctions.some((auction) => auction.status === "Complete");
  const hasSelectedProcessing = selectedAuctions.some((auction) => auction.status === "Processing");

  const formatFinalizedDate = () =>
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const toggleAuctionSelection = (auctionId: string, checked: boolean) => {
    setSelectedAuctionIds((prev) => {
      if (checked) {
        return prev.includes(auctionId) ? prev : [...prev, auctionId];
      }
      return prev.filter((id) => id !== auctionId);
    });
  };

  const handleShowCompletedChange = (checked: boolean) => {
    setShowCompleted(checked);
    setSelectedAuctionIds([]);
  };

  const handleMarkOpen = () => {
    const selectedIds = selectedAuctions
      .filter((auction) => auction.status === "Complete")
      .map((auction) => auction.id);

    if (selectedIds.length === 0) return;

    setAuctions((prev) => {
      const next = prev.map((auction) =>
        selectedIds.includes(auction.id)
          ? { ...auction, status: "Processing", dateFinalized: "-" }
          : auction,
      );

      if (!next.some((auction) => auction.status === "Complete")) {
        setShowCompleted(false);
      }

      return next;
    });
    setSelectedAuctionIds([]);
  };

  const handleMarkComplete = () => {
    const selectedIds = selectedAuctions
      .filter((auction) => auction.status === "Processing")
      .map((auction) => auction.id);

    if (selectedIds.length === 0) return;

    const finalizedDate = formatFinalizedDate();

    setAuctions((prev) =>
      prev.map((auction) =>
        selectedIds.includes(auction.id)
          ? { ...auction, status: "Complete", dateFinalized: finalizedDate }
          : auction,
      ),
    );
    setSelectedAuctionIds([]);
  };

  const columns: ColumnConfig<Auction>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        sortable: true,
        sticky: true,
        minWidth: "140px",
        render: (row) => (
          <Link
            href={`/auction/${row.id}`}
            className="text-[13px] font-normal text-[#d36838] underline hover:text-[#bb5c2f]"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
        ),
      },
      { key: "type", label: "Type", sortable: true },
      { key: "status", label: "Status", sortable: true },
      { key: "totalItems", label: "Total Items", sortable: true },
      { key: "dateCreated", label: "Date Created", sortable: true },
      { key: "dateFinalized", label: "Date Finalized", sortable: true },
      { key: "startingLot", label: "Starting Lot", sortable: true, className: "text-center" },
      {
        key: "changeStatus",
        label: "Change Status",
        sortable: false,
        className: "text-center",
        render: (row) => (
          <input
            className="h-[16px] w-[16px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]"
            type="checkbox"
            aria-label={`Change status for ${row.name}`}
            checked={selectedAuctionIds.includes(row.id)}
            onChange={(event) => toggleAuctionSelection(row.id, event.target.checked)}
            onClick={(event) => event.stopPropagation()}
          />
        ),
      },
    ],
    [selectedAuctionIds],
  );

  return (
    <PageLayout activeKey="dashboard">
      <AppContainer>
        <PageHeader
          title="Select Auction"
          actions={
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              {!showCompleted && hasSelectedProcessing ? (
                <Button type="button" variant="primary" size="sm" onClick={handleMarkComplete}>
                  Mark Complete
                </Button>
              ) : null}
              {showCompleted && hasSelectedComplete ? (
                <Button type="button" variant="primary" size="sm" onClick={handleMarkOpen}>
                  Mark Open
                </Button>
              ) : null}
              <div className="flex items-center gap-2">
                <input
                  className="h-[18px] w-[18px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]"
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => handleShowCompletedChange(e.target.checked)}
                  id="showCompleted"
                />
                <label className="mb-0 cursor-pointer text-[14px] leading-[1.5] text-[#181512]" htmlFor="showCompleted">
                  Show Completed Auctions
                </label>
              </div>
            </div>
          }
        />

        <div className={contentPanelClass}>
          <DataTable
            data={filteredAuctions}
            columns={columns}
            getRowKey={(row) => row.id}
            enableSearch={true}
            enablePagination={true}
            enableSorting={true}
            defaultEntriesPerPage={10}
            searchPlaceholder="Search auctions..."
            horizontalScroll
          />
        </div>
      </AppContainer>
    </PageLayout>
  );
}
