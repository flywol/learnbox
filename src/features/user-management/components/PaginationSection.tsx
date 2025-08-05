interface PaginationSectionProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function PaginationSection({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationSectionProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
                Showing {startItem}-{endItem} of {totalItems}
            </div>
            {totalPages > 1 && (
                <div className="flex gap-2">
                    <button
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNum = currentPage;

                            if (totalPages <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage === totalPages) {
                                pageNum = totalPages - 2 + i;
                            } else if (currentPage === 1) {
                                pageNum = i + 1;
                            } else {
                                pageNum = currentPage - 1 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`rounded px-3 py-1 text-sm transition-colors ${
                                        pageNum === currentPage
                                            ? "bg-orange-600 text-white"
                                            : "border hover:bg-gray-50"
                                    }`}>
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}