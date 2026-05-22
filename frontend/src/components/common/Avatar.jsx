import React, { useState } from 'react';

export const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-24 h-24 text-2xl font-bold'
  };

  const getInitials = (n) => {
    if (!n) return '?';
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate color palette based on name characters
  const getBackgroundColor = (n) => {
    if (!n) return 'bg-slate-800';
    const charCodeSum = n.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colors = [
      'bg-indigo-600',
      'bg-emerald-600',
      'bg-violet-600',
      'bg-cyan-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-sky-600'
    ];
    return colors[charCodeSum % colors.length];
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none ${
        sizes[size]
      } ${!src || hasError ? `${getBackgroundColor(name)} text-white` : 'bg-slate-800'} ${className}`}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
export default Avatar;
