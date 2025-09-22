import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApiClient } from '../api/userApiClient'
import type { UserListItem, DetailedUser, UserFilters } from '../types/user.types'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Hook to fetch all users with optional filters
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userApiClient.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch a specific user by ID
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => userApiClient.getUserById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to update a user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      data,
      role
    }: {
      userId: string
      data: any
      role: string
    }) => {
      return userApiClient.updateUser(userId, data, role)
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      // Invalidate and refetch specific user
      queryClient.invalidateQueries({ 
        queryKey: userKeys.detail(variables.userId) 
      })
      
      // Optional: Update the cache optimistically
      queryClient.setQueryData(
        userKeys.detail(variables.userId),
        (oldData: DetailedUser | undefined) => {
          if (oldData) {
            return { ...oldData, ...variables.data }
          }
          return oldData
        }
      )
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
    },
  })
}

// Hook to create a user
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApiClient.createUser,
    onSuccess: () => {
      // Invalidate users list to refetch with new user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
    },
  })
}

// Utility function to filter users client-side (for search/filter)
export function filterUsers(users: UserListItem[], filters: UserFilters): UserListItem[] {
  let filtered = users

  // Filter by search (name and email)
  if (filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim()
    filtered = filtered.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }

  // Filter by role
  if (filters.role !== "all") {
    filtered = filtered.filter(user => user.role === filters.role)
  }

  return filtered
}

// Utility function to paginate users client-side
export function paginateUsers(
  users: UserListItem[], 
  page: number, 
  itemsPerPage: number
): {
  paginatedUsers: UserListItem[]
  totalPages: number
  totalItems: number
} {
  const totalItems = users.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = users.slice(startIndex, endIndex)

  return {
    paginatedUsers,
    totalPages,
    totalItems
  }
}