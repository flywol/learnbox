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

    // Generate page numbers to show
    const getVisiblePages = () => {
        const pages = [];
        const maxPages = 5; // Show up to 5 page numbers
        
        if (totalPages <= maxPages) {
            // Show all pages if we have 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Calculate range around current page
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);
            
            // Adjust if we're near the beginning or end
            if (end - start + 1 < maxPages) {
                if (start === 1) {
                    end = Math.min(totalPages, start + maxPages - 1);
                } else if (end === totalPages) {
                    start = Math.max(1, end - maxPages + 1);
                }
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        ‹
                    </button>
                    <div className="flex gap-1">
                        {visiblePages.map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-3 py-1 text-sm border rounded transition-colors ${
                                    pageNum === currentPage
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "border-gray-300 hover:bg-gray-50"
                                }`}>
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    <button
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}