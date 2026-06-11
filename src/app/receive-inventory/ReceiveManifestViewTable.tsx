"use client";

import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { ManifestViewRow } from "@/data/mockReceiveInventory";
import { useMemo, useState, useSyncExternalStore } from "react";

/** Below 480px: only Vendor Item Number sticky; 480px+ : Vendor Item Number + GTIN sticky */
const VERY_SMALL_MQ = "(max-width: 479px)";

type ReceiveManifestViewTableProps = {
  rows: ManifestViewRow[];
  columns: ColumnConfig<ManifestViewRow>[];
  onRowSelect?: (row: ManifestViewRow) => void;
};

function subscribeVerySmallViewport(onStoreChange: () => void) {
  const mq = window.matchMedia(VERY_SMALL_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getVerySmallViewportSnapshot() {
  return window.matchMedia(VERY_SMALL_MQ).matches;
}

function useManifestStickyColumnKeys() {
  const verySmall = useSyncExternalStore(
    subscribeVerySmallViewport,
    getVerySmallViewportSnapshot,
    () => false,
  );

  return useMemo(() => {
    if (verySmall) return new Set(["vendorItemNumber"]);
    return new Set(["vendorItemNumber", "gtin"]);
  }, [verySmall]);
}

export default function ReceiveManifestViewTable({
  rows,
  columns,
  onRowSelect,
}: ReceiveManifestViewTableProps) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const stickyColumnKeys = useManifestStickyColumnKeys();

  function handleRowClick(row: ManifestViewRow) {
    setSelectedRowId(row.id);
    onRowSelect?.(row);
  }

  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        sticky: stickyColumnKeys.has(col.key),
      })),
    [columns, stickyColumnKeys],
  );

  return (
    <div className="min-w-0 w-full">
      <DataTable<ManifestViewRow>
        key={[...stickyColumnKeys].join("-")}
        data={rows}
        columns={tableColumns}
        getRowKey={(row) => row.id}
        onRowClick={onRowSelect ? handleRowClick : undefined}
        selectableHighlight={Boolean(onRowSelect)}
        isRowSelected={onRowSelect ? (row) => row.id === selectedRowId : undefined}
        enableSearch
        enablePagination
        enableSorting
        defaultEntriesPerPage={10}
        searchPlaceholder="Search manifest items..."
        searchInputId="receive-manifest-search"
        horizontalScroll
        stickyHeader
        maxTableHeight="min(72dvh, 720px)"
      />
    </div>
  );
}
