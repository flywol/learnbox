import { Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface TableSearchProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TableSearch({
    onSearch,
    placeholder = "Search...",
    className = "",
}: TableSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const handleSearch = useCallback(
        (value: string) => {
            onSearch(value);
        },
        [onSearch]
    );

    useEffect(() => {
        handleSearch(debouncedSearch);
    }, [debouncedSearch, handleSearch]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder:text-gray-400"
            />
        </div>
    );
}