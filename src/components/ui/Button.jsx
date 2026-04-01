import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ className, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
    icon: 'p-2',
  };

  return (
    <button
      className={twMerge(
        'rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export default Button;
