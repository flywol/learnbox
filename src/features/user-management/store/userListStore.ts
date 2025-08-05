import { create } from "zustand";
import type { UserListItem, DetailedUser, UserFilters } from "../types/user.types";

interface UserListState {
  // Users list state
  users: UserListItem[];
  loading: boolean;
  error: string | null;
  
  // Pagination state
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  
  // Filter and search state
  filters: UserFilters;
  
  // Current user detail state
  currentUser: DetailedUser | null;
  userDetailLoading: boolean;
  userDetailError: string | null;
  
  // Update state
  updateLoading: boolean;
  updateError: string | null;
  
  // Actions
  setUsers: (users: UserListItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  
  // Filter actions
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  
  // User detail actions
  setCurrentUser: (user: DetailedUser | null) => void;
  setUserDetailLoading: (loading: boolean) => void;
  setUserDetailError: (error: string | null) => void;
  
  // Update actions
  setUpdateLoading: (loading: boolean) => void;
  setUpdateError: (error: string | null) => void;
  
  // Computed getters
  getFilteredUsers: () => UserListItem[];
  getPaginatedUsers: () => UserListItem[];
  getTotalPages: () => number;
}

const defaultFilters: UserFilters = {
  search: "",
  role: "all",
};

export const useUserListStore = create<UserListState>((set, get) => ({
  // Initial state
  users: [],
  loading: false,
  error: null,
  
  // Pagination initial state
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  
  // Filter initial state
  filters: defaultFilters,
  
  // User detail initial state
  currentUser: null,
  userDetailLoading: false,
  userDetailError: null,
  
  // Update initial state
  updateLoading: false,
  updateError: null,
  
  // Basic actions
  setUsers: (users) => set((state) => {
    // When setting new users, recalculate totalItems based on current filters
    let filtered = users;
    
    // Apply current filters
    if (state.filters.search.trim()) {
      const searchTerm = state.filters.search.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (state.filters.role !== "all") {
      filtered = filtered.filter(user => user.role === state.filters.role);
    }
    
    return {
      users,
      totalItems: filtered.length
    };
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Pagination actions
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  
  // Filter actions
  setFilters: (newFilters) => 
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      // Recalculate filtered users to get correct total
      let filtered = state.users;
      
      // Filter by search (name and email)
      if (updatedFilters.search.trim()) {
        const searchTerm = updatedFilters.search.toLowerCase().trim();
        filtered = filtered.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by role
      if (updatedFilters.role !== "all") {
        filtered = filtered.filter(user => user.role === updatedFilters.role);
      }
      
      return {
        filters: updatedFilters,
        currentPage: 1, // Reset to first page when filtering
        totalItems: filtered.length
      };
    }),
  resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),
  
  // User detail actions
  setCurrentUser: (currentUser) => set({ currentUser }),
  setUserDetailLoading: (userDetailLoading) => set({ userDetailLoading }),
  setUserDetailError: (userDetailError) => set({ userDetailError }),
  
  // Update actions
  setUpdateLoading: (updateLoading) => set({ updateLoading }),
  setUpdateError: (updateError) => set({ updateError }),
  
  // Computed getters
  getFilteredUsers: () => {
    const { users, filters } = get();
    let filtered = users;
    
    // Filter by search (name and email)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by role
    if (filters.role !== "all") {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    return filtered;
  },
  
  getPaginatedUsers: () => {
    const { currentPage, itemsPerPage } = get();
    const filteredUsers = get().getFilteredUsers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredUsers.slice(startIndex, endIndex);
  },
  
  getTotalPages: () => {
    const { itemsPerPage } = get();
    const filteredUsers = get().getFilteredUsers();
    return Math.ceil(filteredUsers.length / itemsPerPage);
  },
}));