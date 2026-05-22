import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  onClick,
  ...props
}) => {
  const baseStyle = 'rounded-2xl border transition-all duration-300';
  const glassStyle = glass 
    ? 'bg-slate-900/60 backdrop-blur-md border-slate-800/50' 
    : 'bg-slate-900 border-slate-800';
  
  const hoverStyle = hoverEffect 
    ? 'hover:-translate-y-1 hover:border-slate-700/60 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.99] cursor-pointer' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${glassStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
