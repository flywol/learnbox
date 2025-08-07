import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    onRowClick?: (row: T) => void;
}

export function Table<T>({ 
    data, 
    columns, 
    isLoading = false, 
    onRowClick 
}: TableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, index) => (
                              <tr key={`loading-${index}`}>
                                  {Array.from({ length: columns.length }).map(
                                      (_, cellIndex) => (
                                          <td
                                              key={`loading-cell-${cellIndex}`}
                                              className="px-6 py-4"
                                          >
                                              <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                                          </td>
                                      )
                                  )}
                              </tr>
                          ))
                        : table.getRowModel().rows.map((row) => (
                              <tr 
                                  key={row.id}
                                  onClick={() => onRowClick?.(row.original)}
                                  className={onRowClick ? "hover:bg-gray-50 cursor-pointer transition-colors duration-150" : ""}
                              >
                                  {row.getVisibleCells().map((cell) => (
                                      <td
                                          key={cell.id}
                                          className="px-6 py-4 whitespace-nowrap text-sm"
                                      >
                                          {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                          )}
                                      </td>
                                  ))}
                              </tr>
                          ))}
                </tbody>
            </table>
        </div>
    );
}