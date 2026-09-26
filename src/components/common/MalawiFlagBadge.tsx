import React from 'react';

export const MalawiFlagBadge: React.FC<{ size?: 'sm' | 'md' | 'lg'; showText?: boolean }> = ({
  size = 'md',
  showText = true
}) => {
  const barHeight = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2' : 'h-1.5';
  const width = size === 'sm' ? 'w-5' : size === 'lg' ? 'w-8' : 'w-6';

  return (
    <div className="inline-flex items-center gap-1.5" title="Malawi National Curriculum Inspired">
      <div className={`flex flex-col overflow-hidden rounded-[2px] shadow-xs ${width}`}>
        <div className={`bg-neutral-900 ${barHeight} w-full`} />
        <div className={`bg-red-600 ${barHeight} w-full`} />
        <div className={`bg-emerald-600 ${barHeight} w-full`} />
      </div>
      {showText && (
        <span className="text-[11px] font-semibold tracking-wider text-emerald-950 uppercase">
          Malawi
        </span>
      )}
    </div>
  );
};
