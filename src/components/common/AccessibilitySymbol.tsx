import React from 'react';

interface AccessibilityIconProps {
  className?: string;
  size?: number | string;
  fillColor?: string;
  ringColor?: string;
}

/**
 * Universal Encircled Accessibility Symbol for Inclusive Learning Hub
 * Matches the official ISO / W3C universal accessibility figure (encircled outstretched human figure)
 */
export const AccessibilitySymbol: React.FC<AccessibilityIconProps> = ({
  className = 'w-5 h-5',
  size,
  fillColor = 'currentColor',
  ringColor = 'currentColor',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Encircled Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={ringColor}
        strokeWidth="6.5"
      />
      {/* Head */}
      <circle
        cx="50"
        cy="28"
        r="7.5"
        fill={fillColor}
      />
      {/* Torso, Outstretched Arms & Spread Legs */}
      <path
        d="M 50 40 
           C 43 40, 36 38, 25 35 
           C 22.5 34.2, 20 37.5, 22.5 39.5 
           C 31 46, 38 47.5, 46 48 
           L 46 59 
           L 32 80 
           C 30.5 82.5, 34 85, 36 83 
           L 50 64 
           L 64 83 
           C 66 85, 69.5 82.5, 68 80 
           L 54 59 
           L 54 48 
           C 62 47.5, 69 46, 77.5 39.5 
           C 80 37.5, 77.5 34.2, 75 35 
           C 64 38, 57 40, 50 40 Z"
        fill={fillColor}
        stroke={fillColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
