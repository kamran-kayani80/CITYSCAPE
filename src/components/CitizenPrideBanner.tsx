import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, Building2, ChevronDown, Check, Compass, Locate, Loader2, Navigation } from 'lucide-react';

interface CityData {
  id: string;
  cityName: string;
  demonym: string;
  phrasePrefix: string; // e.g. "I AM A" or "I AM"
  landmarksName: string;
  wardName: string;
  themeBg: 'navy' | 'white' | 'teal';
  svgSilhouettes: React.ReactNode;
}

// Known demonym dictionary for instant accurate mapping
const DEMONYM_MAP: Record<string, { demonym: string; prefix: string }> = {
  rawalpindi: { demonym: 'RAWALPINDIAN', prefix: 'I AM A' },
  islamabad: { demonym: 'ISLAMABADIAN', prefix: 'I AM AN' },
  lahore: { demonym: 'LAHORI', prefix: 'I AM A' },
  karachi: { demonym: 'KARACHITE', prefix: 'I AM A' },
  peshawar: { demonym: 'PESHAWARI', prefix: 'I AM A' },
  quetta: { demonym: 'QUETTAITE', prefix: 'I AM A' },
  multan: { demonym: 'MULTANI', prefix: 'I AM A' },
  faisalabad: { demonym: 'FAISALABADI', prefix: 'I AM A' },
  sialkot: { demonym: 'SIALKOTI', prefix: 'I AM A' },
  gujranwala: { demonym: 'GUJRANWALI', prefix: 'I AM A' },
  'new york': { demonym: 'NEW YORKER', prefix: 'I AM A' },
  'new york city': { demonym: 'NEW YORKER', prefix: 'I AM A' },
  london: { demonym: 'LONDONER', prefix: 'I AM A' },
  paris: { demonym: 'PARISIAN', prefix: 'I AM A' },
  sydney: { demonym: 'SYDNEY-SIDER', prefix: 'I AM A' },
  berlin: { demonym: 'BERLINER', prefix: 'I AM A' },
  tokyo: { demonym: 'TOKYOITE', prefix: 'I AM A' }
};

// Smart fallback algorithm for any newly geotagged city
function getSmartDemonym(name: string): { demonym: string; prefix: string } {
  const clean = name.trim();
  const lower = clean.toLowerCase();
  if (DEMONYM_MAP[lower]) return DEMONYM_MAP[lower];

  let demonym = clean.toUpperCase();
  if (lower.endsWith('i')) {
    demonym = `${clean.toUpperCase()}AN`;
  } else if (lower.endsWith('a')) {
    demonym = `${clean.slice(0, -1).toUpperCase()}AN`;
  } else if (lower.endsWith('o') || lower.endsWith('u')) {
    demonym = `${clean.toUpperCase()}AN`;
  } else if (lower.endsWith('e')) {
    demonym = `${clean.toUpperCase()}R`;
  } else {
    demonym = `${clean.toUpperCase()}IAN`;
  }

  const startsWithVowel = /^[aeiou]/i.test(demonym);
  return {
    demonym,
    prefix: startsWithVowel ? 'I AM AN' : 'I AM A'
  };
}

const CITIES: CityData[] = [
  {
    id: 'rawalpindi',
    cityName: 'Rawalpindi',
    demonym: 'RAWALPINDIAN',
    phrasePrefix: 'I AM A',
    landmarksName: 'Raja Bazaar & Ayub National Park',
    wardName: 'Rawalpindi Cantonment Ward 3',
    themeBg: 'navy',
    svgSilhouettes: (
      <svg className="w-full h-full text-indigo-900/60" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        {/* Historic Rawalpindi Clock Tower / Arch Silhouette */}
        <path d="M110,190 L110,80 L105,80 L105,50 L120,20 L120,5 L122,5 L122,20 L137,50 L132,80 L127,80 L127,190 Z" />
        <circle cx="121" cy="62" r="8" className="text-amber-400/40" />
        {/* Ayub Park Pavilion Arch */}
        <path d="M260,190 Q310,110 360,190 M280,190 Q310,130 340,190" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Margalla Ridge Silhouette Backdrop */}
        <path d="M380,190 L420,130 L450,150 L500,90 L550,140 L600,190 Z" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'islamabad',
    cityName: 'Islamabad',
    demonym: 'ISLAMABADIAN',
    phrasePrefix: 'I AM AN',
    landmarksName: 'Faisal Mosque & Margalla Hills',
    wardName: 'Sector F-7 Ward 1',
    themeBg: 'teal',
    svgSilhouettes: (
      <svg className="w-full h-full text-emerald-900/40" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        {/* Faisal Mosque Triangular Silhouette & Minarets */}
        <path d="M180,190 L180,50 L184,50 L184,190 M320,190 L320,50 L324,50 L324,190 M200,190 L252,110 L304,190 Z" />
        <path d="M252,110 L252,60" stroke="currentColor" strokeWidth="3" />
        {/* Margalla Hills outline */}
        <path d="M50,190 Q120,100 200,140 Q300,70 420,130 Q500,80 600,190 Z" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'nyc',
    cityName: 'New York City',
    demonym: 'NEW YORKER',
    phrasePrefix: 'I AM A',
    landmarksName: 'Statue of Liberty & Empire State Building',
    wardName: 'Manhattan Ward 4',
    themeBg: 'white',
    svgSilhouettes: (
      <svg className="w-full h-full text-slate-200/90 dark:text-slate-800/80" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        <path d="M70,190 L95,190 L90,140 L85,110 L92,85 L85,85 L85,70 L75,50 L80,35 L75,25 L73,15 L70,25 L65,35 L70,50 L60,70 L60,85 L53,85 L60,110 L55,140 Z" />
        <polygon points="70,5 67,20 73,20" />
        <polygon points="50,15 65,22 62,25" />
        <polygon points="90,15 75,22 78,25" />
        <path d="M85,85 L100,55 L108,58 L95,90 Z" />
        <path d="M420,190 L420,130 L425,130 L425,90 L430,90 L430,50 L433,50 L433,20 L435,5 L437,20 L437,50 L440,50 L440,90 L445,90 L445,130 L450,130 L450,190 Z" />
        <rect x="428" y="95" width="14" height="30" />
        <rect x="425" y="135" width="20" height="50" />
        <path d="M220,190 L220,100 L230,100 L230,190 M230,120 Q280,160 330,120 M330,100 L340,100 L340,190" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
    )
  },
  {
    id: 'london',
    cityName: 'London',
    demonym: 'LONDONER',
    phrasePrefix: 'I AM A',
    landmarksName: 'Big Ben & London Eye',
    wardName: 'Westminster Borough Ward 2',
    themeBg: 'navy',
    svgSilhouettes: (
      <svg className="w-full h-full text-indigo-900/60" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        <path d="M120,190 L120,70 L115,70 L115,45 L125,20 L125,5 L127,5 L127,20 L137,45 L133,70 L128,70 L128,190 Z" />
        <circle cx="124" cy="55" r="7" className="text-amber-500/30" />
        <circle cx="450" cy="110" r="65" stroke="currentColor" strokeWidth="6" fill="none" />
        <circle cx="450" cy="110" r="12" />
        <line x1="450" y1="110" x2="450" y2="190" stroke="currentColor" strokeWidth="6" />
        <line x1="450" y1="110" x2="400" y2="175" stroke="currentColor" strokeWidth="4" />
        <line x1="450" y1="110" x2="500" y2="175" stroke="currentColor" strokeWidth="4" />
        <path d="M260,190 L260,110 L275,110 L275,190 M310,190 L310,110 L325,110 L325,190 M275,150 L310,150" stroke="currentColor" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'paris',
    cityName: 'Paris',
    demonym: 'PARISIAN',
    phrasePrefix: 'I AM A',
    landmarksName: 'Eiffel Tower & Notre Dame',
    wardName: '7th Arrondissement',
    themeBg: 'teal',
    svgSilhouettes: (
      <svg className="w-full h-full text-emerald-900/40" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        <path d="M150,190 Q175,120 185,50 L187,10 L189,50 Q199,120 224,190 L204,190 Q192,140 187,110 Q182,140 170,190 Z" />
        <rect x="175" y="110" width="24" height="8" />
        <rect x="180" y="60" width="14" height="6" />
        <path d="M380,190 L380,90 L410,90 L410,190 M410,130 L450,130 M450,90 L450,190 L480,190 L480,90 Z" />
        <circle cx="430" cy="110" r="14" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    )
  },
  {
    id: 'tokyo',
    cityName: 'Tokyo',
    demonym: 'TOKYOITE',
    phrasePrefix: 'I AM A',
    landmarksName: 'Mt. Fuji & Tokyo Tower',
    wardName: 'Shinjuku Ward',
    themeBg: 'white',
    svgSilhouettes: (
      <svg className="w-full h-full text-slate-200/90 dark:text-slate-800/80" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
        <path d="M100,190 L220,90 Q250,75 280,90 L400,190 Z" />
        <path d="M220,90 Q250,75 280,90 L260,120 Q250,110 240,120 Z" fill="#FFFFFF" opacity="0.3" />
        <path d="M460,190 L490,50 L492,10 L494,50 L524,190 L504,190 L492,100 L480,190 Z" />
        <rect x="480" y="110" width="24" height="10" />
      </svg>
    )
  }
];

interface CitizenPrideBannerProps {
  onLocationChange?: (cityName: string) => void;
}

export const CitizenPrideBanner: React.FC<CitizenPrideBannerProps> = ({ onLocationChange }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('rawalpindi');
  const [customCityData, setCustomCityData] = useState<CityData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isGeotagging, setIsGeotagging] = useState<boolean>(false);
  const [geotagSuccessMsg, setGeotagSuccessMsg] = useState<string | null>(null);

  // Active City resolver
  const activeCity: CityData = customCityData || CITIES.find((c) => c.id === selectedCityId) || CITIES[0];

  const handleSelectCity = (city: CityData) => {
    setCustomCityData(null);
    setSelectedCityId(city.id);
    setIsDropdownOpen(false);
    if (onLocationChange) {
      onLocationChange(city.cityName);
    }
  };

  // Browser Geolocation Geotagging
  const handleDetectGeotagLocation = () => {
    setIsGeotagging(true);
    setGeotagSuccessMsg(null);

    if (!navigator.geolocation) {
      setIsGeotagging(false);
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding lookup via OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.county || addr.state_district || addr.state || 'Rawalpindi';
            
            applyDetectedCity(detectedCity, latitude, longitude);
          } else {
            // Fallback default
            applyDetectedCity('Rawalpindi', latitude, longitude);
          }
        } catch {
          // If network error, fallback to Rawalpindi
          applyDetectedCity('Rawalpindi', latitude, longitude);
        } finally {
          setIsGeotagging(false);
        }
      },
      (_err) => {
        // Geolocation denied or unavailable -> Default to Rawalpindi
        applyDetectedCity('Rawalpindi', 33.597, 73.0479);
        setIsGeotagging(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const applyDetectedCity = (cityName: string, _lat: number, _lon: number) => {
    const matchedKnown = CITIES.find((c) => c.cityName.toLowerCase() === cityName.toLowerCase());

    if (matchedKnown) {
      setCustomCityData(null);
      setSelectedCityId(matchedKnown.id);
      setGeotagSuccessMsg(`Geotagged: ${matchedKnown.cityName} • Welcome, ${matchedKnown.demonym}!`);
      if (onLocationChange) onLocationChange(matchedKnown.cityName);
    } else {
      const { demonym, prefix } = getSmartDemonym(cityName);
      const newCityObj: CityData = {
        id: `geotagged-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
        cityName: cityName,
        demonym: demonym,
        phrasePrefix: prefix,
        landmarksName: 'Local Heritage & Public Infrastructure',
        wardName: `${cityName} Municipal Ward 1`,
        themeBg: 'navy',
        svgSilhouettes: (
          <svg className="w-full h-full text-indigo-900/60" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
            <path d="M100,190 L120,80 L180,80 L200,190 M250,190 Q300,100 350,190 M400,190 L420,60 L450,60 L470,190 Z" />
            <circle cx="200" cy="70" r="10" className="text-amber-400/40" />
          </svg>
        )
      };

      setCustomCityData(newCityObj);
      setGeotagSuccessMsg(`Geotagged: ${cityName} • Welcome, ${demonym}!`);
      if (onLocationChange) onLocationChange(cityName);
    }

    setTimeout(() => setGeotagSuccessMsg(null), 5000);
  };

  // Auto-detect on mount
  useEffect(() => {
    // Check if initial detection can run silently
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`);
            if (res.ok) {
              const data = await res.json();
              const detected = data.address?.city || data.address?.town || data.address?.county || 'Rawalpindi';
              applyDetectedCity(detected, pos.coords.latitude, pos.coords.longitude);
            }
          } catch {
            // Ignore silent error
          }
        },
        () => {
          // Ignore silent fallback
        },
        { timeout: 4000 }
      );
    }
  }, []);

  // Color theme classes mapping for WCAG AAA high contrast compliance
  const themeStyles = {
    white: {
      card: 'bg-white text-[#111827] border-[1.5px] border-[#CBD5E1] shadow-[0_4px_12px_rgba(10,37,64,0.08)]',
      sloganPrefix: 'text-[#0A2540]',
      demonymText: 'text-[#B45309]', // Action Amber for maximum pop
      badge: 'bg-[#006D5B] text-white',
      wardText: 'text-slate-600 dark:text-slate-400',
      button: 'bg-[#0A2540] text-white hover:bg-[#071a2e] active:scale-[0.98]'
    },
    navy: {
      card: 'bg-[#0A2540] text-white border-[1.5px] border-[#0A2540] shadow-[0_4px_20px_rgba(10,37,64,0.25)]',
      sloganPrefix: 'text-slate-100',
      demonymText: 'text-amber-400', // High contrast vibrant amber
      badge: 'bg-[#006D5B] text-white border border-teal-400/30',
      wardText: 'text-indigo-200',
      button: 'bg-[#B45309] text-white hover:bg-[#964205] active:scale-[0.98]'
    },
    teal: {
      card: 'bg-[#006D5B] text-white border-[1.5px] border-[#006D5B] shadow-[0_4px_16px_rgba(0,109,91,0.2)]',
      sloganPrefix: 'text-emerald-50',
      demonymText: 'text-amber-300',
      badge: 'bg-[#0A2540] text-white',
      wardText: 'text-emerald-100',
      button: 'bg-[#0A2540] text-white hover:bg-[#071a2e] active:scale-[0.98]'
    }
  }[activeCity.themeBg];

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative z-20 my-2 sm:my-4"
      aria-label="Citizen Pride Banner"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className={`relative w-full min-h-[170px] sm:min-h-[220px] rounded-2xl p-5 sm:p-8 overflow-hidden flex flex-col justify-between transition-colors duration-300 ${themeStyles.card}`}
      >
        {/* Dynamic Watermark Architectural Silhouette */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 pointer-events-none opacity-80 z-0 overflow-hidden flex items-end justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full max-h-[180px] sm:max-h-[210px]"
            >
              {activeCity.svgSilhouettes}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Meta Bar: Location Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-end gap-3">

          <div className="flex items-center space-x-2">
            {/* Location Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="Change current city location"
                className="flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#0A2540] dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm hover:border-[#0A2540] transition-all cursor-pointer min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-[#B45309]" />
                <span>{activeCity.cityName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* City Selection Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-slate-800 dark:text-slate-100"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Select Your City
                    </div>
                    <div className="space-y-1 mt-1">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer min-h-[44px] ${
                            city.id === activeCity.id
                              ? 'bg-[#0A2540] text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{city.cityName}</span>
                            <span className={`text-[10px] ${city.id === activeCity.id ? 'text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                              {city.demonym}
                            </span>
                          </div>
                          {city.id === activeCity.id && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>



        {/* Centerpiece Slogan ("Pride Element") */}
        <div className="relative z-10 my-3 sm:my-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h1 className="font-heading font-black tracking-tight text-2xl sm:text-4xl lg:text-5xl leading-tight">
                <span className={themeStyles.sloganPrefix}>{activeCity.phrasePrefix} </span>
                <span className={`inline-block underline decoration-[#B45309] decoration-4 underline-offset-4 ${themeStyles.demonymText}`}>
                  {activeCity.demonym}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Call-to-Action Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2 text-xs font-bold opacity-90">
            <Compass className="w-4 h-4 text-[#B45309]" />
            <span>24/7 Municipal Service Response Active</span>
          </div>

          <a
            href="#issue-list-section"
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-transform cursor-pointer min-h-[48px] ${themeStyles.button}`}
          >
            <span>Explore {activeCity.cityName} Requests</span>
          </a>
        </div>
      </motion.div>
    </motion.section>
  );
};

