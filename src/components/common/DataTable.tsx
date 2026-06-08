"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export type ColumnConfig<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  renderHeader?: () => ReactNode;
  className?: string;
  headerClassName?: string;
  /** Pin column to the left during horizontal scroll (use with horizontalScroll). */
  sticky?: boolean;
  /** Min width for column layout, e.g. "120px". Recommended when sticky is true. */
  minWidth?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnConfig<T>[];
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  defaultEntriesPerPage?: number;
  searchPlaceholder?: string;
  searchInputId?: string;
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T) => string | number;
  /** Rendered in the center of the top toolbar (e.g. bulk actions). */
  toolbarCenter?: ReactNode;
  /** Rendered after the search box on the right (e.g. Show Inactive). */
  toolbarEnd?: ReactNode;
  /** Called when the current page of rows changes (pagination/search/sort). */
  onPageRowsChange?: (rows: T[]) => void;
  /** Wide tables scroll horizontally inside the viewport. */
  horizontalScroll?: boolean;
  /** Keep header visible while scrolling vertically (use with maxTableHeight). */
  stickyHeader?: boolean;
  /** Max height of scroll area, e.g. "min(70vh, 560px)". Enables vertical scroll. */
  maxTableHeight?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  enableSearch = false,
  enablePagination = false,
  enableSorting = false,
  defaultEntriesPerPage = 10,
  searchPlaceholder = "Search...",
  searchInputId = "datatable-search",
  onRowClick,
  getRowKey,
  toolbarCenter,
  toolbarEnd,
  onPageRowsChange,
  horizontalScroll = false,
  stickyHeader = false,
  maxTableHeight,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(defaultEntriesPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Filter data based on search
  const filteredData = enableSearch
    ? data.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return columns.some((col) => {
          const value = row[col.key];
          return value != null && String(value).toLowerCase().includes(searchLower);
        });
      })
    : data;

  // Sort data
  const sortedData = enableSorting
    ? [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const aText = aValue == null ? "" : String(aValue);
        const bText = bValue == null ? "" : String(bValue);

        if (aText < bText) return sortConfig.direction === "asc" ? -1 : 1;
        if (aText > bText) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalPages = enablePagination ? Math.ceil(sortedData.length / entriesPerPage) : 1;
  const startIndex = enablePagination ? (currentPage - 1) * entriesPerPage : 0;
  const endIndex = enablePagination ? startIndex + entriesPerPage : sortedData.length;
  const currentData = enablePagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  const lastNotifiedPageRowsRef = useRef<T[] | null>(null);

  useEffect(() => {
    const previous = lastNotifiedPageRowsRef.current;
    if (
      previous !== null &&
      previous.length === currentData.length &&
      previous.every((row, index) => row === currentData[index])
    ) {
      return;
    }

    lastNotifiedPageRowsRef.current = currentData;
    onPageRowsChange?.(currentData);
  }, [currentData, onPageRowsChange]);

  const handleSort = (key: string) => {
    if (!enableSorting) return;

    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push(-1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push(-2);
      pages.push(totalPages);
    }

    return pages;
  };

  const handleRowClick = (row: T, event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea, label")) return;
    onRowClick(row);
  };

  const showToolbar = enableSearch || enablePagination || toolbarCenter || toolbarEnd;
  const useThreeColumnToolbar = Boolean(toolbarCenter || toolbarEnd);

  const entriesControl = enablePagination ? (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-[#181512]">Show</span>
      <select
        className="select-compact rounded-[4px] border border-[#d4d4d4] bg-white px-2 py-1 text-[14px] text-[#181512] focus:border-[#d36838] focus:outline-none"
        value={entriesPerPage}
        onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <span className="text-[14px] text-[#181512]">entries</span>
    </div>
  ) : null;

  const DEFAULT_STICKY_MIN_WIDTH = "100px";

  const stickyLeftOffsets = (() => {
    const offsets: number[] = [];
    let cumulative = 0;
    for (const column of columns) {
      offsets.push(cumulative);
      if (column.sticky) {
        const width = column.minWidth ? parseInt(column.minWidth, 10) : 100;
        cumulative += Number.isNaN(width) ? 100 : width;
      }
    }
    return offsets;
  })();

  const getColumnMinWidthStyle = (column: ColumnConfig<T>): CSSProperties | undefined => {
    if (!column.minWidth) return undefined;
    return { minWidth: column.minWidth };
  };

  const getStickyCellStyle = (columnIndex: number, column: ColumnConfig<T>): CSSProperties | undefined => {
    const widthStyle = getColumnMinWidthStyle(column);
    if (!horizontalScroll || !column.sticky) return widthStyle;
    return {
      ...widthStyle,
      position: "sticky",
      left: stickyLeftOffsets[columnIndex],
      minWidth: column.minWidth ?? DEFAULT_STICKY_MIN_WIDTH,
      zIndex: stickyHeader ? 12 : 2,
    };
  };

  const getStickyHeaderStyle = (columnIndex: number, column: ColumnConfig<T>): CSSProperties | undefined => {
    const widthStyle = getColumnMinWidthStyle(column);
    if (!horizontalScroll || !column.sticky) {
      if (!stickyHeader) return widthStyle;
      return { ...widthStyle, position: "sticky", top: 0, zIndex: 10 };
    }
    return {
      ...widthStyle,
      position: "sticky",
      left: stickyLeftOffsets[columnIndex],
      top: stickyHeader ? 0 : undefined,
      minWidth: column.minWidth ?? DEFAULT_STICKY_MIN_WIDTH,
      zIndex: stickyHeader ? 22 : 12,
    };
  };

  const headerCellClass = horizontalScroll ? "whitespace-nowrap" : "";
  const headerLabelClass = "flex items-center gap-1 whitespace-nowrap";
  const tableIconClass = "[&_svg]:size-[15px]";

  const isLastStickyColumn = (columnIndex: number) => {
    const column = columns[columnIndex];
    if (!column?.sticky) return false;
    const next = columns[columnIndex + 1];
    return !next?.sticky;
  };

  const stickyEdgeClass = (columnIndex: number) =>
    isLastStickyColumn(columnIndex) ? "shadow-[4px_0_6px_-2px_rgba(0,0,0,0.12)]" : "";

  const scrollWrapperStyle: CSSProperties | undefined = maxTableHeight
    ? { maxHeight: maxTableHeight }
    : undefined;

  const searchControl = enableSearch ? (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
      <label htmlFor={searchInputId} className="shrink-0 text-[14px] text-[#181512]">
        Search:
      </label>
      <input
        id={searchInputId}
        type="text"
        className="min-w-0 flex-1 rounded-[4px] border border-[#d4d4d4] bg-white px-3 py-1 text-[14px] text-[#181512] focus:border-[#d36838] focus:outline-none sm:w-[200px] sm:flex-none md:w-[280px]"
        value={searchTerm}
        placeholder={searchPlaceholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  ) : null;

  return (
    <div className="min-w-0 w-full">
      {showToolbar &&
        (useThreeColumnToolbar ? (
          <div className="mb-4 grid grid-cols-1 items-center gap-3 lg:grid-cols-3">
            <div>{entriesControl}</div>
            <div className="flex min-h-[36px] justify-center">{toolbarCenter}</div>
            <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
              {searchControl}
              {toolbarEnd}
            </div>
          </div>
        ) : (
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            {entriesControl}
            {searchControl}
          </div>
        ))}

      <div
        className={`w-full ${horizontalScroll || maxTableHeight ? "overflow-auto" : "overflow-x-auto"}`}
        style={scrollWrapperStyle}
      >
        <table
          className={`border-collapse border border-[#ddd] ${
            horizontalScroll ? "w-max min-w-full table-auto" : "w-full"
          }`}
        >
          <thead className="bg-[#f1f1f1]">
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key}
                  style={getStickyHeaderStyle(columnIndex, column)}
                  className={`border border-[#ddd] bg-[#f1f1f1] px-4 py-3 text-left text-[13px] font-semibold text-[#181512] ${headerCellClass} ${
                    enableSorting && column.sortable !== false
                      ? "cursor-pointer select-none hover:bg-[#e8e8e8]"
                      : ""
                  } ${column.sticky && horizontalScroll ? stickyEdgeClass(columnIndex) : ""} ${tableIconClass} ${
                    column.headerClassName || ""
                  }`}
                  onClick={() => enableSorting && column.sortable !== false && handleSort(column.key)}
                >
                  {column.renderHeader ? (
                    column.renderHeader()
                  ) : (
                    <div className={headerLabelClass}>
                      <span className="whitespace-nowrap">{column.label}</span>
                      {enableSorting && column.sortable !== false && (
                        <span className="inline-flex flex-col text-[10px] leading-[8px] opacity-50">
                          <span
                            className={
                              sortConfig?.key === column.key && sortConfig.direction === "asc" ? "opacity-100" : ""
                            }
                          >
                            ▲
                          </span>
                          <span
                            className={
                              sortConfig?.key === column.key && sortConfig.direction === "desc" ? "opacity-100" : ""
                            }
                          >
                            ▼
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border border-[#ddd] px-4 py-8 text-center text-[13px] text-[#666]"
                >
                  No data available
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr
                  key={getRowKey ? getRowKey(row) : index}
                  className={`group transition-colors hover:bg-[#f9f9f9] ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={(event) => handleRowClick(row, event)}
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      style={getStickyCellStyle(columnIndex, column)}
                      className={`border border-[#ddd] bg-white px-4 py-3 text-[13px] text-[#181512] group-hover:bg-[#f9f9f9] ${
                        column.sticky && horizontalScroll ? `z-[2] ${stickyEdgeClass(columnIndex)}` : ""
                      } ${tableIconClass} ${column.className || ""}`}
                    >
                      {column.render ? column.render(row) : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && totalPages > 1 && (
        <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-[13px] text-[#181512]">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              className="rounded-[3px] border border-[#ddd] bg-white px-3 py-1 text-[13px] text-[#181512] hover:bg-[#f1f1f1] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>

            {renderPagination().map((page, index) => {
              if (page === -1 || page === -2) {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-[13px] text-[#181512]">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  className={`rounded-[3px] border px-3 py-1 text-[13px] ${
                    currentPage === page
                      ? "border-[#d36838] bg-[#d36838] text-white"
                      : "border-[#ddd] bg-white text-[#181512] hover:bg-[#f1f1f1]"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="rounded-[3px] border border-[#ddd] bg-white px-3 py-1 text-[13px] text-[#181512] hover:bg-[#f1f1f1] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
