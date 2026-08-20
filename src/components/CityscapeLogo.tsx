import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CityscapeLogoProps {
  variant?: 'full' | 'icon-only' | 'horizontal' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  fontSize?: string | number;
  animated?: boolean;
}

export const CityscapeLogo: React.FC<CityscapeLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
  fontSize,
  animated = true,
}) => {
  // Key to allow subtle hover replay trigger
  const [replayKey, setReplayKey] = useState(0);

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

  const handleMouseEnter = () => {
    if (animated) {
      setReplayKey((prev) => prev + 1);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-center gap-2.5 sm:gap-3 font-['Montserrat'] select-none ${className}`}
    >
      {/* Official Extracted "Cityscape Skyline & Community Network" Vector Logo Mark with Settled Connecting Animation */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          key={replayKey}
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105 overflow-visible"
          aria-label="Cityscape Official Logo Icon"
        >
          {/* Base Ground Line (Draws first) */}
          <motion.path
            d="M 6 88 H 134"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* SKYLINE BUILDINGS (Civic Navy Silhouette) */}
          {/* Building 1 - Left low-rise with angled roof */}
          <motion.path
            d="M 12 88 V 54 L 26 42 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeInOut' }}
          />

          {/* Building 2 - Tall Central Tower with Spire */}
          <motion.path
            d="M 30 88 V 26 L 40 16 L 50 26 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 40 16 V 6"
            stroke={navyColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65, ease: 'easeOut' }}
          />
          <motion.circle
            cx="40"
            cy="5"
            r="2.5"
            fill={amberColor}
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.85, type: 'spring', stiffness: 400 }}
          />

          {/* Building 3 - Mid-Right Building framing network */}
          <motion.path
            d="M 54 88 V 36 L 70 48 V 88"
            stroke={navyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.35, ease: 'easeInOut' }}
          />

          {/* COMMUNITY CIVIC NETWORK: CONNECTING LINES (Draw gradually from node to node) */}
          {/* 1. Upper Ridge Connection Line (70,48 -> 86,30 -> 108,22 -> 128,40) */}
          <motion.path
            d="M 70 48 L 86 30 L 108 22 L 128 40"
            stroke={amberColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.3,
              delay: 0.45,
              ease: [0.25, 1, 0.5, 1],
            }}
          />

          {/* 2. Middle Sage Teal Mesh Truss Line (86,30 -> 98,56 -> 124,64 -> 128,40) */}
          <motion.path
            d="M 86 30 L 98 56 L 124 64 L 128 40"
            stroke={tealColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.4,
              delay: 0.7,
              ease: [0.25, 1, 0.5, 1],
            }}
          />

          {/* 3. Base Anchor Upward Truss Line (70,88 -> 64 -> 98,56 & 108,22 -> 124,64) */}
          <motion.path
            d="M 70 88 V 64 L 98 56 M 108 22 L 124 64"
            stroke={amberColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.95,
              ease: [0.25, 1, 0.5, 1],
            }}
          />

          {/* 4. Cross-Hatch Harmonic Dashed Connection (86,30 -> 124,64 & 98,56 -> 128,40) */}
          <motion.path
            d="M 86 30 L 124 64 M 98 56 L 128 40"
            stroke={tealColor}
            strokeWidth="2.5"
            strokeDasharray="4 3"
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{
              duration: 1.3,
              delay: 1.15,
              ease: 'easeInOut',
            }}
          />

          {/* NETWORK NODES / DOTS (Scale pop in sequence as lines reach them, with calm settled breathing aura) */}
          {/* Node 1: Building Anchor (70, 48) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.45, type: 'spring', stiffness: 350 }}
            style={{ transformOrigin: '70px 48px' }}
          >
            <circle cx="70" cy="48" r="4.5" fill={navyColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Node 2: Amber Primary Civic Node (86, 30) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.65, ease: 'easeOut' }}
            style={{ transformOrigin: '86px 30px' }}
          >
            <circle cx="86" cy="30" r="5" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Node 3: Apex Amber Node (108, 22) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.25, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.9, ease: 'easeOut' }}
            style={{ transformOrigin: '108px 22px' }}
          >
            <circle cx="108" cy="22" r="6" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Node 4: Eastward Boundary Amber Node (128, 40) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: '128px 40px' }}
          >
            <circle cx="128" cy="40" r="5" fill={amberColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Node 5: Mid-Lower Teal Civic Node (98, 56) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: '98px 56px' }}
          >
            <circle cx="98" cy="56" r="5.5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Node 6: Low-Right Teal Civic Node (124, 64) */}
          <motion.g
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 1.05, ease: 'easeOut' }}
            style={{ transformOrigin: '124px 64px' }}
          >
            <circle cx="124" cy="64" r="5" fill={tealColor} stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
          </motion.g>

          {/* Settled Ambient Pulse: Subtle Travelling Signal Particle connecting civic nodes */}
          {animated && (
            <motion.circle
              r="2"
              fill={amberColor}
              opacity={0.85}
              animate={{
                cx: [70, 86, 108, 128, 124, 98, 70],
                cy: [48, 30, 22, 40, 64, 56, 48],
                opacity: [0, 0.9, 0.9, 0.9, 0.9, 0.9, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4.8,
                ease: 'easeInOut',
                delay: 1.6,
                repeatDelay: 1.2,
              }}
            />
          )}
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


