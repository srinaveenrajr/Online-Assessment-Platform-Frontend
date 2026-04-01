import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          'w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-800',
          error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1 animate-pulse">{error}</p>}
    </div>
  );
};

export default Input;
