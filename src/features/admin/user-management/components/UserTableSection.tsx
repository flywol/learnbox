import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Table } from "@/common/ui/Table";
import { TableSearch } from "@/common/ui/TableSearch";
import { PaginationSection } from "./PaginationSection";
import { createUserColumns } from "../utils/userColumns";
import { userApiClient } from "../api/userApiClient";
import type { UserListItem } from "../types/user.types";

const ITEMS_PER_PAGE = 10;

const ROLE_OPTIONS = [
    { id: "student", label: "Students" },
    { id: "teacher", label: "Teachers" },
    { id: "parent", label: "Parents" },
];

export function UserTableSection() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch all users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => userApiClient.getAllUsers(),
        staleTime: 30000,
    });

    // Apply client-side filtering
    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.fullName?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search)
            );
        }

        // Apply role filter
        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.role === roleFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            filtered = filtered.filter((user) => user.isActive === isActive);
        }

        return filtered;
    }, [users, searchTerm, roleFilter, statusFilter]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRoleChange = (role: string) => {
        setRoleFilter(roleFilter === role ? "all" : role);
        setCurrentPage(1);
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(statusFilter === status ? "all" : status);
        setCurrentPage(1);
    };

    const handleRowClick = useCallback(
        (user: UserListItem) => {
            navigate(`/admin/users/${user.id}`);
        },
        [navigate]
    );

    const columns = useMemo(() => createUserColumns(currentPage, ITEMS_PER_PAGE), [currentPage]);

    const showEmptyState = !isLoading && filteredUsers.length === 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-16">
                    <h2 className="font-bold leading-6 text-2xl text-gray-900">Users</h2>
                    <TableSearch
                        onSearch={setSearchTerm}
                        placeholder="Search users..."
                        className="w-[450px]"
                    />
                </div>
            </div>

            {/* Filters Section */}
            <div className="px-6 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex rounded-full p-1 gap-2">
                        <button
                            onClick={() => handleStatusChange("active")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                statusFilter === "active"
                                    ? "bg-green-50 border border-green-200 text-green-800"
                                    : "bg-gray-100 border border-gray-200 text-gray-600"
                            }`}
                        >
                            Active users
                        </button>
                        <button
                            onClick={() => handleStatusChange("inactive")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                statusFilter === "inactive"
                                    ? "bg-red-50 border border-red-200 text-red-800"
                                    : "bg-gray-100 border border-gray-200 text-gray-600"
                            }`}
                        >
                            Inactive users
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {ROLE_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleRoleChange(option.id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                    roleFilter === option.id
                                        ? "bg-orange-50 border border-orange-200 text-orange-800"
                                        : "bg-gray-100 border border-gray-200 text-gray-600"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Table
                    data={[]}
                    columns={columns}
                    isLoading={true}
                />
            ) : showEmptyState ? (
                <div className="p-8 text-center">
                    <p className="text-gray-500">
                        No users found matching your criteria.
                    </p>
                </div>
            ) : (
                <>
                    <Table
                        data={paginatedUsers}
                        columns={columns}
                        isLoading={false}
                        onRowClick={handleRowClick}
                    />

                    <PaginationSection
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}