"use client";

import DataTable, { ColumnConfig } from "@/components/common/DataTable";
import { IconFileSpreadsheet, IconListRows } from "@/components/common/icons";
import { formatQty, ManifestFileMeta, ManifestItemRow } from "@/data/mockImportManifest";
import { useMemo, useState, useSyncExternalStore } from "react";

const boldFont = { fontFamily: "Muli-Bold, Arial, sans-serif" } as const;

/** Below 480px: only Item No sticky; 480px+ : Item No + GTIN sticky */
const VERY_SMALL_MQ = "(max-width: 479px)";

type ImportManifestItemsTableProps = {
  items: ManifestItemRow[];
  columns: ColumnConfig<ManifestItemRow>[];
  fileMeta: ManifestFileMeta | null;
  isLoading: boolean;
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
    if (verySmall) return new Set(["itemNo"]);
    return new Set(["itemNo", "gtin"]);
  }, [verySmall]);
}

/** Import Manifest only — file summary badge (not part of shared DataTable). */
function ManifestFileBadge({ fileName, rowCount }: { fileName: string; rowCount: number }) {
  const rowLabel = rowCount === 1 ? "row" : "rows";

  return (
    <div
      className="flex w-full min-w-0 items-center gap-2 rounded-[6px] border border-[#ecd9cf] bg-[#fdf6f3] px-3 py-2 lg:max-w-[420px]"
      role="status"
      aria-label={`Loaded manifest ${fileName}, ${formatQty(rowCount)} ${rowLabel}`}
    >
      <IconFileSpreadsheet className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-[13px] text-[#181512]" style={boldFont} title={fileName}>
        {fileName}
      </span>
      <span className="h-4 w-px shrink-0 bg-[#d4b8a8]" aria-hidden />
      <span
        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] text-[#d36838]"
        style={boldFont}
      >
        <IconListRows className="shrink-0 text-[#d36838]" />
        {formatQty(rowCount)} {rowLabel}
      </span>
    </div>
  );
}

export default function ImportManifestItemsTable({
  items,
  columns,
  fileMeta,
  isLoading,
}: ImportManifestItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const stickyColumnKeys = useManifestStickyColumnKeys();

  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        sticky: stickyColumnKeys.has(col.key),
      })),
    [columns, stickyColumnKeys],
  );

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) =>
      tableColumns.some((col) => {
        const value = row[col.key as keyof ManifestItemRow];
        return value != null && String(value).toLowerCase().includes(q);
      }),
    );
  }, [items, searchTerm, tableColumns]);

  return (
    <div className="min-w-0 w-full">
      <div className="mb-4 flex flex-col gap-3">
        {fileMeta && !isLoading ? (
          <div className="flex w-full justify-start sm:justify-end">
            <ManifestFileBadge fileName={fileMeta.fileName} rowCount={items.length} />
          </div>
        ) : null}

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] text-[#181512]">Show</span>
            <select
              className="rounded-[4px] border border-[#d4d4d4] bg-white px-2 py-1 text-[14px] text-[#181512] focus:border-[#d36838] focus:outline-none"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              aria-label="Entries per page"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-[14px] text-[#181512]">entries</span>
          </div>

          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <label
              htmlFor="import-manifest-search"
              className="shrink-0 text-[14px] text-[#181512]"
            >
              Search:
            </label>
            <input
              id="import-manifest-search"
              type="text"
              className="min-w-0 flex-1 rounded-[4px] border border-[#d4d4d4] bg-white px-3 py-1 text-[14px] text-[#181512] focus:border-[#d36838] focus:outline-none sm:w-[280px] sm:flex-none"
              value={searchTerm}
              placeholder="Search manifest items..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 [&>div>div:first-child]:hidden">
        <DataTable<ManifestItemRow>
          key={`${entriesPerPage}-${[...stickyColumnKeys].join("-")}`}
          data={filteredItems}
          columns={tableColumns}
          getRowKey={(row) => row.id}
          enableSearch={false}
          enablePagination
          enableSorting
          defaultEntriesPerPage={entriesPerPage}
          horizontalScroll
          stickyHeader
          maxTableHeight="min(70vh, 560px)"
        />
      </div>
    </div>
  );
}
