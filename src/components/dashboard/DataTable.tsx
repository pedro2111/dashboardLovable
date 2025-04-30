
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Card className="border backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-white/20 dark:border-gray-700/30 shadow-lg overflow-hidden">
      {title && (
        <div className="p-4 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-white/5 to-gray-50/5 dark:from-gray-800/10 dark:to-gray-900/10">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/20 dark:border-gray-700/30">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: <ChevronUp className="ml-1 h-3 w-3" />,
                        desc: <ChevronDown className="ml-1 h-3 w-3" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className={`border-white/20 dark:border-gray-700/30 transition-all hover:backdrop-blur-md hover:bg-primary/5 ${
                    index % 2 === 0 ? 'bg-white/30 dark:bg-gray-800/30' : 'bg-white/10 dark:bg-gray-900/10'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="backdrop-blur-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center backdrop-blur-sm">
                  Sem dados disponíveis
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
