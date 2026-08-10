'use client';

import React from 'react';
import { ThemeVariant } from '../../theme/themeConfig';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ThemeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'indigo',
  size = 'md',
  icon,
  pulse = false,
  className = '',
  children,
  ...props
}) => {
  const variantMap: Record<ThemeVariant, string> = {
    indigo: 'badge-indigo',
    amber: 'badge-amber',
    emerald: 'badge-emerald',
    sky: 'badge-sky',
    purple: 'badge-purple',
    slate: 'badge-slate',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizeMap = {
    sm: 'px-2 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider',
    md: 'px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
