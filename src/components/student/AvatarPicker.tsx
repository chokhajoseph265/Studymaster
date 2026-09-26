import React from 'react';
import { INITIAL_AVATARS } from '../../data/initialData';
import { AvatarOption } from '../../types';
import { Check } from 'lucide-react';

interface AvatarPickerProps {
  selectedAvatarId: string;
  onSelect: (id: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatarId, onSelect }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-neutral-700">
        Choose Built-in Student Avatar:
      </label>
      <div className="grid grid-cols-4 gap-2.5">
        {INITIAL_AVATARS.map((avatar) => {
          const isSelected = selectedAvatarId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20 scale-105'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-1 ${avatar.accentBg}`}>
                {avatar.emoji}
              </div>
              <span className="text-[10px] font-bold text-neutral-800 truncate max-w-full">
                {avatar.name}
              </span>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-neutral-500 italic mt-0.5">
        * Built-in avatars only. Profile photo uploads are disabled for student safety.
      </p>
    </div>
  );
};
