import React from 'react';

export const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full border transition-all duration-300';
  
  const variants = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    gray: 'bg-slate-800 border-slate-700/60 text-slate-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
