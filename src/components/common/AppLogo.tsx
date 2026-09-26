import React, { useState, useEffect } from 'react';
import { getActiveLogoSrc } from '../../data/logos';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'icon' | 'full' | 'horizontal' | 'hero' | 'compact';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  useImage?: boolean;
}

/**
 * Official StudyMaster Malawi circular logo image asset
 */
export const AppLogoIcon: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-10 h-10',
  className = ''
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(getActiveLogoSrc());

  useEffect(() => {
    const handleLogoChange = () => {
      setLogoSrc(getActiveLogoSrc());
    };
    window.addEventListener('studymaster_logo_changed', handleLogoChange);
    return () => window.removeEventListener('studymaster_logo_changed', handleLogoChange);
  }, []);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
      <img
        src={logoSrc}
        alt="StudyMaster Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-full drop-shadow-xs select-none"
      />
    </div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(getActiveLogoSrc());

  useEffect(() => {
    const handleLogoChange = () => {
      setLogoSrc(getActiveLogoSrc());
    };
    window.addEventListener('studymaster_logo_changed', handleLogoChange);
    return () => window.removeEventListener('studymaster_logo_changed', handleLogoChange);
  }, []);

  // If variant is hero (the centered hero branding)
  if (variant === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center select-none ${
          onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''
        } ${className}`}
      >
        {/* Emblem Image */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 mb-2 p-1 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center">
          <img
            src={logoSrc}
            alt="StudyMaster"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Wordmark */}
        <div className="flex items-center justify-center gap-1.5 my-1">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Study<span className="text-red-600">Master</span>
          </span>
        </div>

        {/* Tagline */}
        {showSubtitle && (
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 italic tracking-wide flex items-center justify-center gap-1.5">
            <span>Learn • Practice • Excel</span>
          </p>
        )}
      </div>
    );
  }

  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
    hero: 'w-32 h-32'
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
    '2xl': 'text-3xl font-black',
    hero: 'text-4xl font-black'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]' : ''
      } ${className}`}
    >
      <div className="rounded-full bg-white p-0.5 shadow-2xs border border-slate-200 shrink-0">
        <AppLogoIcon sizeClass={iconSizes[size]} />
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className={`tracking-tight text-slate-900 font-black ${titleSizes[size]}`}>
              Study<span className="text-red-600">Master</span>
            </span>
          </div>

          {showSubtitle && (
            <span className="text-[10px] text-slate-500 font-medium tracking-tight">
              Learn • Practice • Excel
            </span>
          )}
        </div>
      )}
    </div>
  );
};
