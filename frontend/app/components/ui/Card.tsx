'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'interactive' | 'panel' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  padding = 'md',
  hoverEffect = true,
  className = '',
  children,
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const variantMap = {
    glass: 'glass-card rounded-3xl',
    interactive: 'glass-card-interactive rounded-3xl cursor-pointer',
    panel: 'glass-panel rounded-3xl',
    flat: 'bg-white border border-slate-200 rounded-3xl shadow-sm',
  };

  const baseClass = `${variantMap[variant]} ${paddingMap[padding]} ${className}`;

  return (
    <div className={baseClass} {...props}>
      {children}
    </div>
  );
};
