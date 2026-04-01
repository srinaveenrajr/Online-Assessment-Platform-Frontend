import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, variant = 'glass', children, ...props }) => {
  const variants = {
    glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl text-white',
    plain: 'bg-white border border-slate-200 shadow-sm',
    gradient: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg',
  };

  return (
    <div
      className={twMerge(
        'rounded-2xl p-6 transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
