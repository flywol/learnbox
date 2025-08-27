import { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const spacingClasses = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export default function Stack({
  children,
  spacing = 'md',
  align = 'stretch',
  className = '',
}: StackProps) {
  return (
    <div className={`flex flex-col ${spacingClasses[spacing]} ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
}