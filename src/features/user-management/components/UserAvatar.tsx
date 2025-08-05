import { User } from "lucide-react";
import { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-20 h-20"
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8", 
  xl: "w-10 h-10"
};

export default function UserAvatar({ src, name, size = "md", className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden ${className}`;

  const renderFallback = () => {
    const initials = getInitials(name);
    
    // If we can get initials, show them on colored background
    if (initials) {
      // Generate a color based on the name for consistency
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-red-500'
      ];
      
      const colorIndex = name.length % colors.length;
      const bgColor = colors[colorIndex];
      
      return (
        <div className={`${baseClasses} ${bgColor} text-white font-medium`}>
          <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'}>
            {initials}
          </span>
        </div>
      );
    }
    
    // Fallback to icon if no initials available
    return (
      <div className={`${baseClasses} bg-gray-300`}>
        <User className={`${iconSizeClasses[size]} text-gray-500`} />
      </div>
    );
  };

  // Show fallback if no src, empty src, or image failed to load
  if (!src || !src.trim() || imageError) {
    return renderFallback();
  }

  // Show image with fallback on error
  return (
    <div className={baseClasses}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}