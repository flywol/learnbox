import { create } from "zustand";
import type { UserFilters } from "../types/user.types";

interface UserUIState {
  // Pagination state
  currentPage: number;
  itemsPerPage: number;
  
  // Filter and search state
  filters: UserFilters;
  
  // UI state
  isFilterDropdownOpen: boolean;
  
  // Actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setFilterDropdownOpen: (open: boolean) => void;
  
  // Computed
  resetPagination: () => void;
}

const defaultFilters: UserFilters = {
  search: "",
  role: "all",
};

export const useUserUIStore = create<UserUIState>((set) => ({
  // Initial state
  currentPage: 1,
  itemsPerPage: 10,
  filters: defaultFilters,
  isFilterDropdownOpen: false,
  
  // Actions
  setCurrentPage: (currentPage) => set({ currentPage }),
  
  setItemsPerPage: (itemsPerPage) => 
    set({ itemsPerPage, currentPage: 1 }), // Reset to first page
  
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters },
      currentPage: 1 // Reset to first page when filtering
    })),
    
  resetFilters: () => 
    set({ filters: defaultFilters, currentPage: 1 }),
    
  setFilterDropdownOpen: (isFilterDropdownOpen) => 
    set({ isFilterDropdownOpen }),
    
  resetPagination: () => 
    set({ currentPage: 1 }),
}));