import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    glass: 'bg-white/10 backdrop-blur-md text-white border-white/20',
  };

  return (
    <span
      className={twMerge(
        'px-3 py-1 text-xs font-bold rounded-full border transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
