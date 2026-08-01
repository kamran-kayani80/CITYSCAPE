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

  const blueColor = isDark ? '#38BDF8' : '#0052CC'; // Progressive Blue / Civic Navy
  const tealColor = isDark ? '#2DD4BF' : '#00A389'; // Community Teal
  const coralColor = isDark ? '#FF7A59' : '#FF5A36'; // Engaged Coral
  const textColor = isDark ? '#FFFFFF' : '#0052CC'; // Primary Brand Wordmark
  const taglineColor = isDark ? '#94A3B8' : '#64748B'; // Neutral Gray

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
            stroke={blueColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* SKYLINE BUILDINGS (Progressive Blue Silhouette) */}
          {/* Building 1 - Left low-rise with angled roof */}
          <path
            d="M 12 88 V 54 L 26 42 V 88"
            stroke={blueColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Building 2 - Tall Central Tower with Spire */}
          <path
            d="M 30 88 V 26 L 40 16 L 50 26 V 88"
            stroke={blueColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 40 16 V 6"
            stroke={blueColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="40" cy="5" r="2.5" fill={coralColor} />

          {/* Building 3 - Mid-Right Building framing network */}
          <path
            d="M 54 88 V 36 L 70 48 V 88"
            stroke={blueColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* COMMUNITY CIVIC NETWORK (Engaged Coral & Community Teal Mesh) */}
          {/* Network Connection Lines */}
          <path
            d="M 70 48 L 86 30 L 108 22 L 128 40"
            stroke={coralColor}
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
            stroke={coralColor}
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
          <circle cx="86" cy="30" r="5" fill={coralColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="108" cy="22" r="6" fill={coralColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="128" cy="40" r="5" fill={coralColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />

          <circle cx="98" cy="56" r="5.5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="124" cy="64" r="5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          <circle cx="70" cy="48" r="4.5" fill={blueColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
        </svg>
      </div>

      {/* Typography: Wordmark & Official Tagline from Brand Guide */}
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
              A Community Civic Engagement Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};

