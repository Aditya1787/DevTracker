import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 backdrop-blur-sm ${className}`}>
      {Icon && (
        <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 mb-4 animate-pulse">
          <Icon className="w-10 h-10" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} isLoading={isLoading}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
