# DataTable Component

A reusable, feature-rich table component with optional sorting, pagination, and search functionality.

## Features

- **Sorting**: Click column headers to sort data (ascending/descending/none)
- **Pagination**: Navigate through large datasets with configurable page sizes
- **Search**: Filter data across all columns
- **Custom Rendering**: Use custom render functions for any column
- **Responsive**: Works on all screen sizes with horizontal scrolling
- **Type-Safe**: Full TypeScript support with generics

## Usage

### Basic Example

```tsx
import DataTable, { ColumnConfig } from "@/components/common/DataTable";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const data: Product[] = [
  { id: 1, name: "Product 1", price: 29.99, category: "Electronics" },
  { id: 2, name: "Product 2", price: 49.99, category: "Books" },
];

const columns: ColumnConfig<Product>[] = [
  { key: "name", label: "Product Name", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "category", label: "Category", sortable: true },
];

export default function ProductsPage() {
  return (
    <DataTable
      data={data}
      columns={columns}
      enableSearch={true}
      enablePagination={true}
      enableSorting={true}
      defaultEntriesPerPage={10}
    />
  );
}
```

### Custom Column Rendering

```tsx
const columns: ColumnConfig<Product>[] = [
  {
    key: "name",
    label: "Product Name",
    sortable: true,
    render: (row) => (
      <Link href={`/products/${row.id}`} className="text-blue-600 hover:underline">
        {row.name}
      </Link>
    ),
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (row) => `$${row.price.toFixed(2)}`,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (row) => (
      <button onClick={() => handleEdit(row.id)}>Edit</button>
    ),
  },
];
```

### Column Configuration

```tsx
{
  key: "columnKey",           // Required: Key in the data object
  label: "Column Header",     // Required: Display name
  sortable: true,             // Optional: Enable sorting (default: true when enableSorting is true)
  render: (row) => JSX,       // Optional: Custom render function
  className: "text-center",   // Optional: CSS classes for table cells
  headerClassName: "w-32"     // Optional: CSS classes for header cells
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | Required | Array of data objects |
| `columns` | `ColumnConfig<T>[]` | Required | Column configuration array |
| `enableSearch` | `boolean` | `false` | Enable search functionality |
| `enablePagination` | `boolean` | `false` | Enable pagination |
| `enableSorting` | `boolean` | `false` | Enable column sorting |
| `defaultEntriesPerPage` | `number` | `10` | Default rows per page |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `onRowClick` | `(row: T) => void` | `undefined` | Optional row click handler |
| `getRowKey` | `(row: T) => string \| number` | `undefined` | Stable row key for `<tr>` (defaults to index) |
| `searchInputId` | `string` | `"datatable-search"` | HTML id for the search input |
| `toolbarCenter` | `ReactNode` | `undefined` | Center slot in 3-column toolbar |
| `toolbarEnd` | `ReactNode` | `undefined` | Right slot after search (e.g. toggle buttons) |
| `onPageRowsChange` | `(rows: T[]) => void` | `undefined` | Current page rows after filter/sort/paginate |

## Examples

### Simple Table (No Features)

```tsx
<DataTable
  data={items}
  columns={columns}
  enableSearch={false}
  enablePagination={false}
  enableSorting={false}
/>
```

### Full-Featured Table

```tsx
<DataTable
  data={auctions}
  columns={columns}
  enableSearch={true}
  enablePagination={true}
  enableSorting={true}
  defaultEntriesPerPage={25}
  searchPlaceholder="Search auctions..."
  onRowClick={(row) => router.push(`/auction/${row.id}`)}
/>
```

### Table with Custom Rendering

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: "avatar",
    label: "Avatar",
    sortable: false,
    render: (row) => (
      <img src={row.avatarUrl} alt={row.name} className="w-10 h-10 rounded-full" />
    ),
  },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (row) => (
      <span className={`badge ${row.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
        {row.status}
      </span>
    ),
  },
];
```

## Styling

The DataTable component uses Tailwind CSS classes and follows the project's design system:

- Primary color: `#d36838` (orange)
- Border color: `#ddd`
- Background colors: `#f1f1f1` (header), `#f9f9f9` (hover)
- Text colors: `#181512` (dark text)

## Notes

- The search feature searches across all columns by default
- Sorting maintains the current search filter
- Pagination resets to page 1 when search term changes
- Empty state displays "No data available" message
- Column sorting indicators (▲▼) appear only when sorting is enabled
