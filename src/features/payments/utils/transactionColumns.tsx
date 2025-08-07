import { type ColumnDef } from "@tanstack/react-table";
import { TransactionData } from "../types/payment.types";

export const createTransactionColumns = (): ColumnDef<TransactionData, any>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "studentName",
        header: "Student name",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <img
                    src={row.original.studentAvatar}
                    alt={row.original.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900">
                    {row.original.studentName}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "parentName",
        header: "Parent name",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <img
                    src={row.original.parentAvatar}
                    alt={row.original.parentName}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm text-gray-900">
                    {row.original.parentName}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "classLevel",
        header: "Class level",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-900">
                {getValue() as string}
            </span>
        ),
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment status",
        cell: ({ getValue }) => {
            const status = getValue() as string;
            return (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        status === 'paid'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                >
                    {status === 'paid' ? 'Paid' : 'Pending'}
                </span>
            );
        },
    },
    {
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-900">
                {(getValue() as string) || '--'}
            </span>
        ),
    },
    {
        accessorKey: "dateReceived",
        header: "Date received",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-900">
                {(getValue() as string) || '--'}
            </span>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: "Total amount (₦)",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-900">
                {(getValue() as number).toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "amountPaid",
        header: "Amount paid (₦)",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-900">
                {(getValue() as number).toLocaleString()}
            </span>
        ),
    },
];