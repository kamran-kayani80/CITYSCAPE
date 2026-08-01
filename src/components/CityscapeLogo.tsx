import React from 'react';

interface CityscapeLogoProps {
  variant?: 'full' | 'icon-only' | 'horizontal' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const CityscapeLogo: React.FC<CityscapeLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Sizing map for SVG icon container
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Color configurations based on light vs dark theme variant
  const isDark = variant === 'dark';

  const navyColor = isDark ? '#38BDF8' : '#0A2540'; // Civic Navy / Bright Blue
  const tealColor = isDark ? '#2DD4BF' : '#006D5B'; // Warm Sage Teal
  const amberColor = isDark ? '#CCFF00' : '#B45309'; // Action Amber / Lime
  const textColor = isDark ? '#FFFFFF' : '#0A2540'; // Deep Civic Navy / White
  const taglineColor = isDark ? '#94A3B8' : '#64748B'; // Neutral Gray

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 font-['Montserrat'] ${className}`}>
      {/* "The Civic Arch" Vector Logo Mark (1:1 Ratio, 100x100 viewBox) */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105"
          aria-hidden="true"
        >
          {/* Base Foundation Ground Line */}
          <path
            d="M 10 88 L 90 88"
            stroke={navyColor}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Outer Civic Arch (The Arch of Community Protection) */}
          <path
            d="M 18 88 V 46 C 18 28 32 14 50 14 C 68 14 82 28 82 46 V 88"
            stroke={tealColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Doorway Archway (Welcoming Doorway Silhouette) */}
          <path
            d="M 38 88 V 62 C 38 55 43 50 50 50 C 57 50 62 55 62 62 V 88"
            stroke={amberColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Civic Skyline Center Spire */}
          <path
            d="M 50 50 V 22"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Civic Spire Beacon Node */}
          <circle cx="50" cy="18" r="5" fill={amberColor} stroke={navyColor} strokeWidth="2" />

          {/* Side Civic Nodes (Community Connections) */}
          <circle cx="18" cy="46" r="4" fill={navyColor} />
          <circle cx="82" cy="46" r="4" fill={navyColor} />
        </svg>
      </div>

      {/* Typography: Wordmark & Tagline */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-['Montserrat'] font-black uppercase tracking-tight ${textSizes[size]}`}
            style={{ color: textColor }}
          >
            CITYSCAPE
          </span>
          {showTagline && (
            <span
              className={`font-['Inter'] font-semibold tracking-wide mt-1 ${taglineSizes[size]}`}
              style={{ color: taglineColor }}
            >
              Bridging Citizens & Municipal Public Works
            </span>
          )}
        </div>
      )}
    </div>
  );
};

