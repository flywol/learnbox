import { type ColumnDef } from "@tanstack/react-table";
import { UserListItem } from "../types/user.types";
import UserAvatar from "../components/UserAvatar";
import StatusBadge from "../components/StatusBadge";

export const createUserColumns = (currentPage: number, itemsPerPage: number): ColumnDef<UserListItem, any>[] => [
    {
        id: "serialNumber",
        header: "S/N",
        cell: ({ row }) => (
            <span className="text-sm font-medium text-gray-900">
                {(currentPage - 1) * itemsPerPage + row.index + 1}
            </span>
        ),
    },
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ getValue }) => (
            <div className="flex items-center space-x-3">
                <UserAvatar 
                    src={null}
                    name={getValue() as string}
                    size="sm"
                />
                <span className="text-sm font-medium text-gray-900">
                    {getValue() as string}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-600">
                {getValue() as string}
            </span>
        ),
    },
    {
        accessorKey: "dateCreated",
        header: "Date created",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-600">
                {new Date(getValue() as string).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                })}
            </span>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
            const role = getValue() as string;
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => (
            <StatusBadge isActive={getValue() as boolean} />
        ),
    },
    {
        id: "actions",
        header: "Action",
        cell: () => (
            <button className="inline-flex items-center px-3 py-1.5 border border-orange-300 text-orange-600 hover:text-orange-700 hover:border-orange-400 text-sm font-medium rounded-md transition-colors duration-150">
                View
            </button>
        ),
    },
];