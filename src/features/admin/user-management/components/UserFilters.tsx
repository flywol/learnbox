import { Search, ChevronDown } from "lucide-react";
import { useUserUIStore } from "../store/userUIStore";
import type { UserFilters } from "../types/user.types";

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
}

const roleOptions = [
  { value: "all", label: "All" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
];

export default function UserFiltersComponent({ filters, onFiltersChange }: UserFiltersProps) {
  const { isFilterDropdownOpen, setFilterDropdownOpen } = useUserUIStore();

  const selectedRoleLabel = roleOptions.find(option => option.value === filters.role)?.label || "All";

  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search user"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-sm transition-all"
        />
      </div>

      {/* Role Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setFilterDropdownOpen(!isFilterDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
        >
          <span className="text-sm text-gray-700 font-medium">{selectedRoleLabel}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isFilterDropdownOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setFilterDropdownOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFiltersChange({ role: option.value as UserFilters['role'] });
                    setFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    filters.role === option.value 
                      ? 'bg-orange-50 text-orange-600 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}