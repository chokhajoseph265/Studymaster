import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { INITIAL_AD_CONFIG } from '../../data/initialData';

interface AdBannerProps {
  variant?: 'card' | 'compact' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ variant = 'card' }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !INITIAL_AD_CONFIG.enabled) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="my-2 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-950 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wider border border-emerald-800">
            Notice
          </span>
          <p className="text-xs font-medium text-neutral-200 line-clamp-1">
            {INITIAL_AD_CONFIG.sponsorName} • {INITIAL_AD_CONFIG.sponsorTagline}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative my-3 p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-emerald-300 text-[9px] font-bold uppercase tracking-wider border border-white/10">
            Community Partner
          </span>
          <span className="text-xs font-semibold text-emerald-200">
            {INITIAL_AD_CONFIG.sponsorName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-neutral-400 hover:text-white p-1"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
        {INITIAL_AD_CONFIG.sponsorTagline}
      </p>

      {INITIAL_AD_CONFIG.sponsorCtaUrl && (
        <div className="flex items-center justify-end pt-1 border-t border-white/10">
          <a
            href={INITIAL_AD_CONFIG.sponsorCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 underline underline-offset-2"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
