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
  // Sizing map for SVG icon width/height
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-5xl sm:text-6xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-sm',
    xl: 'text-base',
  };

  // Color configurations based on light vs dark theme variant
  const isDark = variant === 'dark';

  const skylineColor = isDark ? '#38BDF8' : '#0052CC'; // Progressive Blue
  const tealColor = isDark ? '#2DD4BF' : '#00A389'; // Community Teal
  const coralColor = isDark ? '#FF7A59' : '#FF5A36'; // Engaged Coral
  const textColor = isDark ? '#FFFFFF' : '#0A2540'; // Deep Civic Navy / White
  const taglineColor = isDark ? '#94A3B8' : '#64748B'; // Neutral Gray

  return (
    <div className={`inline-flex items-center gap-3 font-['Montserrat'] ${className}`}>
      {/* Dynamic Cityscape & Community Mesh Vector Logo Mark */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* --- LEFT SIDE: CITY SKYLINE BUILDINGS (Progressive Blue) --- */}
          {/* Building 1 (Far Left Low-rise) */}
          <path
            d="M 10 100 L 10 65 L 30 65 L 30 100"
            stroke={skylineColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Building 2 (Mid-rise with angled roof) */}
          <path
            d="M 30 100 L 30 45 L 45 35 L 60 45 L 60 100"
            stroke={skylineColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Building 3 (High-rise Tower with Spire) */}
          <path
            d="M 60 100 L 60 25 L 75 15 L 90 25 L 90 100"
            stroke={skylineColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Skyline Base Ground Line */}
          <path
            d="M 5 100 L 195 100"
            stroke={skylineColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* --- RIGHT SIDE: CONNECTED COMMUNITY MESH NETWORK (Coral & Teal) --- */}
          {/* Network Connections */}
          <path
            d="M 90 60 L 115 35 L 145 20 L 175 40 L 185 75 L 155 90 L 120 85 L 90 60"
            stroke={coralColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 115 35 L 155 90"
            stroke={tealColor}
            strokeWidth="3.5"
            strokeDasharray="4 3"
          />
          <path
            d="M 145 20 L 120 85"
            stroke={coralColor}
            strokeWidth="3.5"
          />
          <path
            d="M 115 35 L 175 40"
            stroke={tealColor}
            strokeWidth="3.5"
          />
          <path
            d="M 90 60 L 145 20"
            stroke={skylineColor}
            strokeWidth="3.5"
          />

          {/* Network Nodes (Community Citizen Circles) */}
          <circle cx="90" cy="60" r="7" fill={skylineColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="115" cy="35" r="7.5" fill={coralColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="145" cy="20" r="8" fill={tealColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="175" cy="40" r="7.5" fill={coralColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="185" cy="75" r="6.5" fill={tealColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="155" cy="90" r="7.5" fill={coralColor} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="120" cy="85" r="7" fill={skylineColor} stroke="#FFFFFF" strokeWidth="2" />

          {/* Inner Node Accent Glows */}
          <circle cx="145" cy="20" r="3" fill="#FFFFFF" />
          <circle cx="115" cy="35" r="2.5" fill="#FFFFFF" />
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
              className={`font-['Inter'] font-semibold tracking-wide mt-0.5 ${taglineSizes[size]}`}
              style={{ color: taglineColor }}
            >
              Inclusive by design. Exclusive by experience.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
