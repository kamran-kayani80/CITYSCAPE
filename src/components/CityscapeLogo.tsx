import React from 'react';

interface CityscapeLogoProps {
  variant?: 'full' | 'icon-only' | 'horizontal' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  fontSize?: string | number;
}

export const CityscapeLogo: React.FC<CityscapeLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
  fontSize,
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
    md: 'text-[28px] sm:text-[36px]',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Color configurations based on official Brand Guide tokens
  const isDark = variant === 'dark';

  const navyColor = isDark ? '#60A5FA' : '#0A2540'; // Civic Navy (#0A2540)
  const tealColor = isDark ? '#2DD4BF' : '#006D5B'; // Warm Sage Teal (#006D5B)
  const amberColor = isDark ? '#F59E0B' : '#B45309'; // Action Amber (#B45309)
  const textColor = isDark ? '#FFFFFF' : '#0A2540'; // Civic Navy Primary Brand Wordmark
  const taglineColor = isDark ? '#94A3B8' : '#475569'; // High-Contrast Slate

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 font-['Montserrat'] ${className}`}>
      {/* Official Extracted "Cityscape Skyline & Community Network" Vector Logo Mark */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105"
          aria-label="Cityscape Official Logo Icon"
        >
          {/* Base Ground Line */}
          <path
            d="M 6 88 H 134"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* SKYLINE BUILDINGS (Civic Navy Silhouette) */}
          {/* Building 1 - Left low-rise with angled roof */}
          <path
            d="M 12 88 V 54 L 26 42 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Building 2 - Tall Central Tower with Spire */}
          <path
            d="M 30 88 V 26 L 40 16 L 50 26 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 40 16 V 6"
            stroke={navyColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="40" cy="5" r="2.5" fill={amberColor} />

          {/* Building 3 - Mid-Right Building framing network */}
          <path
            d="M 54 88 V 36 L 70 48 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* COMMUNITY CIVIC NETWORK (Action Amber & Warm Sage Teal Mesh) */}
          {/* Network Connection Lines */}
          <path
            d="M 70 48 L 86 30 L 108 22 L 128 40"
            stroke={amberColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 86 30 L 98 56 L 124 64 L 128 40"
            stroke={tealColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 70 88 V 64 L 98 56 M 108 22 L 124 64"
            stroke={amberColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 86 30 L 124 64 M 98 56 L 128 40"
            stroke={tealColor}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />

          {/* Network Nodes (Citizens / Wards) */}
          <circle cx="86" cy="30" r="5" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="108" cy="22" r="6" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="128" cy="40" r="5" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />

          <circle cx="98" cy="56" r="5.5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="124" cy="64" r="5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="70" cy="48" r="4.5" fill={navyColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
        </svg>
      </div>

      {/* Typography: Wordmark & Official Tagline from Brand Guide */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-['Montserrat'] font-black uppercase tracking-tight text-[#0A2540] dark:text-white ${fontSize ? '' : textSizes[size]}`}
            style={{ color: textColor, ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : {}) }}
          >
            CITYSCAPE
          </span>
          {showTagline && (
            <span
              className={`font-['Inter'] font-semibold tracking-wide mt-1 text-slate-600 dark:text-slate-300 ${taglineSizes[size]}`}
              style={{ color: taglineColor }}
            >
              A Community Civic Engagement Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};

