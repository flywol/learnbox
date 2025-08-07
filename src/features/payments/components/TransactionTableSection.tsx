import { useState, useCallback, useMemo } from "react";
import { Table } from "@/common/ui/Table";
import { PaginationSection } from "../../user-management/components/PaginationSection";
import { createTransactionColumns } from "../utils/transactionColumns";
import type { TransactionData } from "../types/payment.types";

const ITEMS_PER_PAGE = 10;

const FILTER_OPTIONS = [
    { id: "all", label: "All" },
    { id: "paid", label: "Paid" },
    { id: "pending", label: "Pending" },
];

interface TransactionTableSectionProps {
    data: TransactionData[];
    isLoading?: boolean;
    onExport?: (selectedIds: string[]) => void;
}

export function TransactionTableSection({ 
    data, 
    isLoading = false, 
    onExport 
}: TransactionTableSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");

    // Apply client-side filtering
    const filteredTransactions = useMemo(() => {
        if (statusFilter === "all") return data;
        return data.filter((transaction) => transaction.paymentStatus === statusFilter);
    }, [data, statusFilter]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, endIndex);
    }, [filteredTransactions, currentPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleExport = () => {
        onExport?.([]);
    };

    const columns = useMemo(() => createTransactionColumns(), []);

    const showEmptyState = !isLoading && filteredTransactions.length === 0;

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex justify-between items-center">
                <div></div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="appearance-none bg-white border border-orange-500 text-orange-500 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {FILTER_OPTIONS.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 fill-current text-orange-500" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <Table
                        data={[]}
                        columns={columns}
                        isLoading={true}
                    />
                ) : showEmptyState ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">
                            No transactions found matching your criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table
                                data={paginatedTransactions}
                                columns={columns}
                                isLoading={false}
                            />
                        </div>

                        <PaginationSection
                            currentPage={currentPage}
                            totalItems={filteredTransactions.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}