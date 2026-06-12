"use client";

import Link from "next/link";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { useState } from "react";

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

const auctions: Auction[] = [
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
];

export default function AuctionPage() {
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredAuctions = auctions.filter((auction) => {
    return showCompleted || auction.status !== "Complete";
  });

  const columns: ColumnConfig<Auction>[] = [
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
      render: (row) =>
        row.status === "Complete" ? (
          <input
            className="h-[16px] w-[16px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]"
            type="checkbox"
            aria-label="Change status"
          />
        ) : null,
    },
  ];

  return (
    <PageLayout activeKey="dashboard">
      <AppContainer>
        <PageHeader
          title="Select Auction"
          actions={
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <input
                className="h-[18px] w-[18px] cursor-pointer rounded-[3px] border border-[#999] bg-white accent-[#d36838]"
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                id="showCompleted"
              />
              <label className="mb-0 cursor-pointer text-[14px] leading-[1.5] text-[#181512]" htmlFor="showCompleted">
                Show Completed Auctions
              </label>
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
