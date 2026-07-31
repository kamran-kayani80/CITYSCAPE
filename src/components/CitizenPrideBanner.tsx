import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, Building2, ChevronDown, Check, Compass, Landmark, History, Locate, Loader2 } from 'lucide-react';

interface CityData {
  id: string;
  cityName: string;
  demonym: string;
  phrasePrefix: string; // e.g. "I AM A" or "I AM"
  inspirationalSlogan: string;
  culturalHeritage: string; // Rich traditional identity & cultural values
  culturalLandmarks: string; // Iconic heritage sites & historical monuments
  landmarksName: string;
  wardName: string;
  themeBg: 'navy' | 'white' | 'teal';
  svgSilhouettes: React.ReactNode;
}

// Known demonym dictionary with motivational civic slogans & rich cultural heritage for instant accurate mapping
const DEMONYM_MAP: Record<string, { demonym: string; prefix: string; inspirationalSlogan: string; culturalHeritage: string; culturalLandmarks: string }> = {
  rawalpindi: {
    demonym: 'RAWALPINDIAN',
    prefix: 'I AM A',
    inspirationalSlogan: 'Preserving Ancient Potohari Heritage • Building a Stronger, Greener City',
    culturalHeritage: 'Ancient Potohari Crossroads • Garrison Heritage & Vibrant Crafts',
    culturalLandmarks: 'Raja Bazaar Clock Tower, Ayub Park & Taxila Gateway'
  },
  islamabad: {
    demonym: 'ISLAMABADIAN',
    prefix: 'I AM AN',
    inspirationalSlogan: 'Eco-Sanctuary of Margalla • Uniting Tradition & Modern Civic Care',
    culturalHeritage: 'Saidpur Heritage Village & Margalla Eco-Traditions',
    culturalLandmarks: 'Faisal Mosque, Pakistan Monument & Lok Virsa Museum'
  },
  lahore: {
    demonym: 'LAHORI',
    prefix: 'I AM A',
    inspirationalSlogan: 'Zinda Dilan-e-Lahore • Heart of Mughal Splendor, Sufi Mysticism & Hospitality',
    culturalHeritage: 'Mughal Architecture & Sufi Mysticism',
    culturalLandmarks: 'Badshahi Mosque, Lahore Fort & Shalamar Gardens'
  },
  karachi: {
    demonym: 'KARACHITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Lights — Standing Strong With Cosmopolitan Heritage & Resilience',
    culturalHeritage: 'Colonial Maritime Heritage & Port Trade History',
    culturalLandmarks: 'Mazar-e-Quaid, Mohatta Palace & Empress Market'
  },
  peshawar: {
    demonym: 'PESHAWARI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Flowers & Storytellers — Honoring Ancient Silk Road Traditions',
    culturalHeritage: 'Ancient Silk Route Gateway & Pashtun Hospitality',
    culturalLandmarks: 'Qissa Khwani Bazaar, Bala Hisar Fort & Mahabat Khan Mosque'
  },
  quetta: {
    demonym: 'QUETTAITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'Fruit Garden of the Nation — Nurturing Balochi Craftsmanship & Mountain Traditions',
    culturalHeritage: 'Fruit Gardens & Traditional Balochi Rug Weaving',
    culturalLandmarks: 'Hanna Lake, Urak Valley & Bolan Pass Gateway'
  },
  multan: {
    demonym: 'MULTANI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Saints — Honoring Centuries of Kashikari Blue Tile Craft & Sufi Wisdom',
    culturalHeritage: 'Kashikari Blue Tile Pottery & Sufi Heritage',
    culturalLandmarks: 'Shrine of Shah Rukn-e-Alam, Tomb of Bahauddin Zakariya & Fort Kohna'
  },
  faisalabad: {
    demonym: 'FAISALABADI',
    prefix: 'I AM A',
    inspirationalSlogan: 'Engine of Growth — Preserving Lyallpur Craftsmanship & Community Unity',
    culturalHeritage: 'Textile Artisan Legacy & Historic Eight-Bazaar Clock Tower Grid',
    culturalLandmarks: 'Ghanta Ghar (Clock Tower), Gumti Fountain & Lyallpur Heritage'
  },
  sialkot: {
    demonym: 'SIALKOTI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Iqbal & Master Artisans — Crafting World-Class Heritage & Pride',
    culturalHeritage: 'Poetic Legacy of Allama Iqbal & Artisan Craftsmanship',
    culturalLandmarks: 'Iqbal Manzil, Sialkot Fort & Marala Headworks'
  },
  gujranwala: {
    demonym: 'GUJRANWALI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Champions (Pahlwans) — Honoring Athletic Heritage & Local Unity',
    culturalHeritage: 'Traditional Wrestling (Pahlwani) & Culinary Craftsmanship',
    culturalLandmarks: 'Estcourt Clock Tower, Nishan-e-Manzil & Sheranwala Gate'
  },
  'new york': {
    demonym: 'NEW YORKER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Melting Pot of Nations • Harlem Renaissance & Beacon of Freedom',
    culturalHeritage: 'Harlem Jazz, Broadway & Immigrant Cultural Legacy',
    culturalLandmarks: 'Statue of Liberty, Brooklyn Bridge & Central Park'
  },
  'new york city': {
    demonym: 'NEW YORKER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Melting Pot of Nations • Harlem Renaissance & Beacon of Freedom',
    culturalHeritage: 'Harlem Jazz, Broadway & Immigrant Cultural Legacy',
    culturalLandmarks: 'Statue of Liberty, Brooklyn Bridge & Central Park'
  },
  london: {
    demonym: 'LONDONER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Protecting Millennia of Crown, Globe Theatre & Maritime History',
    culturalHeritage: 'Thames Maritime Tradition & Shakespearean Heritage',
    culturalLandmarks: 'Big Ben, Tower of London & Globe Theatre'
  },
  paris: {
    demonym: 'PARISIAN',
    prefix: 'I AM A',
    inspirationalSlogan: 'Illuminating Neighborhoods With Enlightenment, Salon Culture & Passion',
    culturalHeritage: 'Bohemian Salon Culture & Architectural Elegance',
    culturalLandmarks: 'Eiffel Tower, Louvre Museum & Notre-Dame Cathedral'
  },
  sydney: {
    demonym: 'SYDNEY-SIDER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Harbor of Opportunity — Honoring Eora First Nations & Coastal Heritage',
    culturalHeritage: 'Eora Nation Heritage & Pacific Maritime Traditions',
    culturalLandmarks: 'Sydney Opera House, Harbor Bridge & Bondi Beach'
  },
  berlin: {
    demonym: 'BERLINER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Uniting Creative Expression, Freedom & Historic Reunification',
    culturalHeritage: 'Creative Avant-Garde & Historic Reunification Spirit',
    culturalLandmarks: 'Brandenburg Gate, Museum Island & East Side Gallery'
  },
  tokyo: {
    demonym: 'TOKYOITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'Edo Shrine Traditions Meeting High-Tech Innovation in Harmony',
    culturalHeritage: 'Edo Shinto Traditions & Omotenashi Hospitality',
    culturalLandmarks: 'Sensō-ji Temple, Meiji Shrine & Tokyo Tower'
  },
  'san francisco': {
    demonym: 'SAN FRANCISCAN',
    prefix: 'I AM A',
    inspirationalSlogan: 'Bridging Gold Rush Legacy, Bay Culture & Pioneer Innovation',
    culturalHeritage: 'Gold Rush History, Maritime Bay Culture & Cable Car Heritage',
    culturalLandmarks: 'Golden Gate Bridge, Alcatraz & Dragon Gate'
  }
};

// Smart fallback algorithm for any newly geotagged city
function getSmartDemonym(name: string): { demonym: string; prefix: string; inspirationalSlogan: string; culturalHeritage: string; culturalLandmarks: string } {
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
    prefix: startsWithVowel ? 'I AM AN' : 'I AM A',
    inspirationalSlogan: `Standing Strong Together to Preserve Heritage & Build a Safer ${clean}`,
    culturalHeritage: `Vibrant ${clean} Cultural Heritage • Local Artisan & Civic Traditions`,
    culturalLandmarks: `${clean} Central Square, Historic Clock Tower & Civic Gardens`
  };
}

const CITIES: CityData[] = [
  {
    id: 'rawalpindi',
    cityName: 'Rawalpindi',
    demonym: 'RAWALPINDIAN',
    phrasePrefix: 'I AM A',
    inspirationalSlogan: 'Preserving Ancient Potohari Heritage • Building a Stronger, Greener City',
    culturalHeritage: 'Ancient Potohari Crossroads • Garrison Heritage & Vibrant Crafts',
    culturalLandmarks: 'Raja Bazaar Clock Tower, Ayub Park & Taxila Gateway',
    landmarksName: 'Raja Bazaar & Ayub National Park',
    wardName: 'Rawalpindi Cantonment Ward 3',
    themeBg: 'navy',
    svgSilhouettes: (
      <svg className="w-full h-full text-[#008080]/40" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
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
    inspirationalSlogan: 'Eco-Sanctuary of Margalla • Uniting Tradition & Modern Civic Care',
    culturalHeritage: 'Saidpur Heritage Village & Margalla Eco-Traditions',
    culturalLandmarks: 'Faisal Mosque, Pakistan Monument & Lok Virsa Museum',
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
    inspirationalSlogan: 'Melting Pot of Nations • Harlem Renaissance & Beacon of Freedom',
    culturalHeritage: 'Harlem Jazz, Broadway & Immigrant Cultural Legacy',
    culturalLandmarks: 'Statue of Liberty, Brooklyn Bridge & Central Park',
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
    inspirationalSlogan: 'Protecting Millennia of Crown, Globe Theatre & Maritime History',
    culturalHeritage: 'Thames Maritime Tradition & Shakespearean Heritage',
    culturalLandmarks: 'Big Ben, Tower of London & Globe Theatre',
    landmarksName: 'Big Ben & London Eye',
    wardName: 'Westminster Borough Ward 2',
    themeBg: 'navy',
    svgSilhouettes: (
      <svg className="w-full h-full text-[#008080]/40" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
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
    inspirationalSlogan: 'Illuminating Our Neighborhoods Through Shared Civic Care & Passion',
    culturalHeritage: 'Bohemian Salon Culture & Architectural Elegance',
    culturalLandmarks: 'Eiffel Tower, Louvre Museum & Notre-Dame Cathedral',
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
    inspirationalSlogan: 'Innovating Community Harmony & Safe Streets Every Single Day',
    culturalHeritage: 'Edo Shinto Traditions & Omotenashi Hospitality',
    culturalLandmarks: 'Sensō-ji Temple, Meiji Shrine & Tokyo Tower',
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

    localStorage.setItem('cityscape_user_city', city.cityName);
    window.dispatchEvent(new CustomEvent('cityscape:city-changed', { detail: { cityName: city.cityName } }));

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
    localStorage.setItem('cityscape_user_city', cityName);
    if (_lat && _lon) {
      localStorage.setItem('cityscape_user_lat', _lat.toString());
      localStorage.setItem('cityscape_user_lng', _lon.toString());
    }
    window.dispatchEvent(new CustomEvent('cityscape:city-changed', { detail: { cityName, lat: _lat, lng: _lon } }));

    const matchedKnown = CITIES.find((c) => c.cityName.toLowerCase() === cityName.toLowerCase());

    if (matchedKnown) {
      setCustomCityData(null);
      setSelectedCityId(matchedKnown.id);
      setGeotagSuccessMsg(`Geotagged: ${matchedKnown.cityName} • Welcome, ${matchedKnown.demonym}!`);
      if (onLocationChange) onLocationChange(matchedKnown.cityName);
    } else {
      const { demonym, prefix, inspirationalSlogan, culturalHeritage, culturalLandmarks } = getSmartDemonym(cityName);
      const newCityObj: CityData = {
        id: `geotagged-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
        cityName: cityName,
        demonym: demonym,
        phrasePrefix: prefix,
        inspirationalSlogan: inspirationalSlogan,
        culturalHeritage: culturalHeritage,
        culturalLandmarks: culturalLandmarks,
        landmarksName: 'Local Heritage & Public Infrastructure',
        wardName: `${cityName} Municipal Ward 1`,
        themeBg: 'navy',
        svgSilhouettes: (
          <svg className="w-full h-full text-[#008080]/40" viewBox="0 0 600 200" fill="currentColor" aria-hidden="true">
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

  // Color theme classes mapping for WCAG AAA high contrast compliance using official brand palette
  const themeStyles = {
    white: {
      card: 'bg-white text-[#111827] border-2 border-[#CBD5E1] dark:border-slate-700 shadow-xl',
      sloganPrefix: 'text-[#111827] dark:text-white font-black',
      demonymText: 'text-[#006D5B] dark:text-[#CCFF00] font-black',
      badge: 'bg-[#0A2540] text-white font-black',
      wardText: 'text-slate-800 dark:text-slate-200 font-bold',
      button: 'bg-[#B45309] text-white hover:bg-[#92400E] font-black active:scale-[0.98] border-2 border-amber-300 shadow-lg'
    },
    navy: {
      card: 'bg-[#0A2540] text-white border-2 border-[#006D5B] shadow-2xl',
      sloganPrefix: 'text-white font-black',
      demonymText: 'text-[#CCFF00] font-black',
      badge: 'bg-[#006D5B] text-white border border-[#CCFF00]/40 font-black',
      wardText: 'text-slate-100 font-bold',
      button: 'bg-[#B45309] text-white hover:bg-[#92400E] font-black active:scale-[0.98] border-2 border-amber-300 shadow-lg'
    },
    teal: {
      card: 'bg-[#006D5B] text-white border-2 border-[#CCFF00]/40 shadow-xl',
      sloganPrefix: 'text-white font-black',
      demonymText: 'text-[#CCFF00] font-black',
      badge: 'bg-[#0A2540] text-[#CCFF00] font-black',
      wardText: 'text-slate-100 font-bold',
      button: 'bg-[#0A2540] text-[#CCFF00] hover:bg-black font-black active:scale-[0.98] border-2 border-[#CCFF00]/40 shadow-lg'
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
        {/* Dynamic Watermark Architectural Silhouette (Low opacity for high text legibility on mobile) */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 pointer-events-none opacity-15 dark:opacity-25 z-0 overflow-hidden flex items-end justify-end">
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

        {/* Top Meta Bar: Location Selector & Civic Ward Context */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          {/* Left Civic Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#008080] text-[#CCFF00] shadow-xs border border-[#CCFF00]/30 font-['Montserrat']">
              <Building2 className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span>{activeCity.wardName}</span>
            </div>

            <div className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#CCFF00]/20 text-[#008080] dark:text-[#CCFF00] border border-[#CCFF00]/40 font-['Montserrat']">
              <span className="w-2 h-2 rounded-full bg-[#008080] dark:bg-[#CCFF00] animate-pulse" />
              <span>{activeCity.demonym} JURISDICTION</span>
            </div>

            <div className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/30 dark:bg-slate-900/40 backdrop-blur-xs text-slate-800 dark:text-slate-200 border border-slate-300/40 dark:border-slate-700/40 font-['Montserrat']">
              <Compass className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00] shrink-0" />
              <span>{activeCity.landmarksName}</span>
            </div>
          </div>

          {/* Right Controls: Geotag & City Selector */}
          <div className="flex items-center space-x-2">
            {/* Auto-Geotag Button */}
            <button
              onClick={handleDetectGeotagLocation}
              disabled={isGeotagging}
              title="Auto-detect current city via GPS"
              className="flex items-center space-x-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-extrabold text-[#1A1A1A] dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm hover:border-[#008080] transition-all cursor-pointer min-h-[44px] disabled:opacity-50 font-['Montserrat']"
            >
              {isGeotagging ? (
                <Loader2 className="w-4 h-4 text-[#008080] animate-spin" />
              ) : (
                <Locate className="w-4 h-4 text-[#008080] dark:text-[#CCFF00]" />
              )}
              <span className="hidden sm:inline">{isGeotagging ? 'Geotagging...' : 'Auto-GPS'}</span>
            </button>

            {/* Location Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="Change current city location"
                className="flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#1A1A1A] dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm hover:border-[#008080] transition-all cursor-pointer min-h-[44px] font-['Montserrat']"
              >
                <MapPin className="w-4 h-4 text-[#008080] dark:text-[#CCFF00]" />
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
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 p-2 z-50 text-slate-800 dark:text-slate-100 font-['Montserrat']"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Your City</span>
                      <span className="text-[10px] text-[#008080] dark:text-[#CCFF00] font-extrabold">WCAG AAA</span>
                    </div>
                    <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer min-h-[44px] ${
                            city.id === activeCity.id
                              ? 'bg-[#008080] text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{city.cityName}</span>
                            <span className={`text-[10px] ${city.id === activeCity.id ? 'text-[#CCFF00]' : 'text-slate-600 dark:text-slate-400'}`}>
                              {city.demonym} • {city.wardName}
                            </span>
                          </div>
                          {city.id === activeCity.id && <Check className="w-4 h-4 text-[#CCFF00]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>



        {/* Centerpiece Slogan ("Pride Element") & Cultural Values */}
        <div className="relative z-10 my-3 sm:my-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <h1 className="font-['Montserrat'] font-black tracking-tight text-2xl sm:text-4xl lg:text-5xl leading-tight">
                <span className={themeStyles.sloganPrefix}>I AM A PROUD </span>
                <span className={`inline-block underline decoration-[#008080] dark:decoration-[#CCFF00] decoration-4 underline-offset-4 ${themeStyles.demonymText}`}>
                  {activeCity.demonym}
                </span>
              </h1>
              
              <div className="flex items-center space-x-2 text-xs sm:text-sm md:text-base font-extrabold tracking-wide opacity-95 font-['Montserrat']">
                <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-[#008080] dark:text-[#CCFF00]" />
                <span className="italic">"{activeCity.inspirationalSlogan}"</span>
              </div>

              {/* Cultural Heritage & Traditional Values Section */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 font-['Montserrat']">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm">
                  <History className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00] shrink-0" />
                  <span><strong>Cultural Heritage:</strong> {activeCity.culturalHeritage}</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm">
                  <Landmark className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00] shrink-0" />
                  <span><strong>Heritage Monuments:</strong> {activeCity.culturalLandmarks}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>



        {/* Bottom Interactive Call-to-Action Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/10 dark:border-white/10 font-['Montserrat']">
          <div className="flex items-center space-x-2 text-xs font-bold opacity-90">
            <Compass className="w-4 h-4 text-[#008080] dark:text-[#CCFF00]" />
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

