/**
 * Utility functions for handling user data safely.
 */

/**
 * Safely extracts the first name from a full name string.
 * Handles null, undefined, empty strings, and single names.
 * 
 * @param fullName - The full name string to parse
 * @param fallback - Fallback string if name is invalid (default: "User")
 * @returns The first name or fallback
 */
export const getFirstName = (fullName?: string | null, fallback: string = "User"): string => {
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return fallback;
  }
  
  const parts = fullName.trim().split(" ");
  return parts[0] || fallback;
};

/**
 * Safely extracts initials from a full name string.
 * Returns 1 or 2 characters (e.g., "John Doe" -> "JD", "John" -> "J").
 * 
 * @param fullName - The full name string to parse
 * @param fallback - Fallback string if name is invalid (default: "U")
 * @returns The initials or fallback
 */
export const getUserInitials = (fullName?: string | null, fallback: string = "U"): string => {
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return fallback;
  }

  const parts = fullName.trim().split(" ");
  
  if (parts.length === 0) return fallback;
  
  const firstInitial = parts[0].charAt(0).toUpperCase();
  
  if (parts.length === 1) {
    return firstInitial;
  }
  
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};
