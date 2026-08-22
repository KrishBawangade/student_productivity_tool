'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const sizeMap = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-xl gap-2 font-bold',
    lg: 'px-7 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5 font-extrabold',
  };

  const variantMap = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition-all font-semibold',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all',
  };

  const widthClass = fullWidth ? 'w-full justify-center' : 'inline-flex items-center';
  const disabledClass = disabled || isLoading ? 'opacity-60 pointer-events-none' : '';

  return (
    <button
      className={`${widthClass} ${variantMap[variant]} ${sizeMap[size]} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};
