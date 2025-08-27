import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  rounded = 'lg',
}: CardProps) {
  return (
    <div 
      className={`bg-white ${paddingClasses[padding]} ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${className}`}
    >
      {children}
    </div>
  );
}