import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, Building2, ChevronDown, Check, Compass, Landmark, History, Locate, Loader2, Award } from 'lucide-react';

interface CityData {
  id: string;
  cityName: string;
  demonym: string;
  phrasePrefix: string; // e.g. "I AM A" or "I AM"
  inspirationalSlogan: string;
  culturalHeritage: string;
  culturalLandmarks: string;
  landmarksName: string;
  wardName: string;
  gradientStyle: string; // CSS gradient class
  monumentArtwork: React.ReactNode;
}

// Known demonym dictionary with motivational civic slogans & rich cultural heritage
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
    inspirationalSlogan: 'City of Champions — Honoring Athletic Heritage & Local Unity',
    culturalHeritage: 'Traditional Wrestling & Culinary Craftsmanship',
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
  }
};

function getSmartDemonym(name: string): { demonym: string; prefix: string; inspirationalSlogan: string; culturalHeritage: string; culturalLandmarks: string } {
  const clean = name.trim();
  const lower = clean.toLowerCase();
  if (DEMONYM_MAP[lower]) return DEMONYM_MAP[lower];

  let demonym = clean.toUpperCase();
  if (lower.endsWith('i')) demonym = `${clean.toUpperCase()}AN`;
  else if (lower.endsWith('a')) demonym = `${clean.slice(0, -1).toUpperCase()}AN`;
  else if (lower.endsWith('o') || lower.endsWith('u')) demonym = `${clean.toUpperCase()}AN`;
  else if (lower.endsWith('e')) demonym = `${clean.toUpperCase()}R`;
  else demonym = `${clean.toUpperCase()}IAN`;

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
    landmarksName: 'Raja Bazaar Clock Tower & Ayub Park',
    wardName: 'Rawalpindi Cantonment Ward 3',
    gradientStyle: 'from-[#0A2540] via-[#004D40] to-[#006D5B]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="pindiGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="pindiTeal" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#006D5B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.75" />
          </linearGradient>
          <filter id="pindiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Potohari Margalla Mountain Ridge (Background Layer) */}
        <path d="M250,240 L340,140 L390,170 L480,90 L560,160 L680,80 L700,240 Z" fill="url(#pindiTeal)" opacity="0.35" />

        {/* The Civic Arch ("Architectural Gateway") */}
        <path d="M120,240 Q180,120 240,240 M140,240 Q180,140 220,240" stroke="url(#pindiGold)" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M180,120 L180,70" stroke="#CCFF00" strokeWidth="4" />
        <circle cx="180" cy="65" r="7" fill="#CCFF00" filter="url(#pindiGlow)" />

        {/* Raja Bazaar Clock Tower (Midground Photo-manipulated Illustration) */}
        <g filter="url(#pindiGlow)">
          <path d="M420,240 L420,100 L410,100 L410,70 L430,25 L430,10 L432,10 L432,25 L452,70 L452,100 L442,100 L442,240 Z" fill="url(#pindiGold)" />
          {/* Clock Dial */}
          <circle cx="431" cy="85" r="11" fill="#FFFFFF" stroke="#0A2540" strokeWidth="2" />
          <circle cx="431" cy="85" r="2" fill="#0A2540" />
          <line x1="431" y1="85" x2="431" y2="78" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" />
          <line x1="431" y1="85" x2="436" y2="85" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" />
          {/* Arched Windows */}
          <path d="M426,130 Q431,123 436,130 L436,155 L426,155 Z" fill="#0A2540" opacity="0.7" />
          <path d="M426,170 Q431,163 436,170 L436,200 L426,200 Z" fill="#0A2540" opacity="0.7" />
        </g>

        {/* Ayub National Park Arch & Garden Silhouettes */}
        <path d="M520,240 Q570,140 620,240 M540,240 Q570,160 600,240" stroke="#CCFF00" strokeWidth="5" fill="none" opacity="0.8" />
        <circle cx="570" cy="180" r="15" fill="none" stroke="url(#pindiGold)" strokeWidth="3" opacity="0.6" />
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
    landmarksName: 'Faisal Mosque & Pakistan Monument',
    wardName: 'Sector F-7 Ward 1',
    gradientStyle: 'from-[#004D40] via-[#006D5B] to-[#0A2540]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="isbLime" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#006D5B" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="isbGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
        </defs>

        {/* Margalla Hills backdrop */}
        <path d="M100,240 Q220,110 320,160 Q440,70 580,140 Q650,90 700,240 Z" fill="#0A2540" opacity="0.5" />

        {/* Faisal Mosque Photo-manipulated Artwork */}
        <g>
          {/* Minarets */}
          <path d="M220,240 L220,50 L225,50 L225,240 M420,240 L420,50 L425,50 L425,240" stroke="url(#isbLime)" strokeWidth="4" />
          <circle cx="222.5" cy="45" r="4" fill="#CCFF00" />
          <circle cx="422.5" cy="45" r="4" fill="#CCFF00" />

          {/* Main Tent Roof */}
          <polygon points="240,240 322.5,100 405,240" fill="url(#isbLime)" opacity="0.85" />
          <path d="M322.5,100 L322.5,55" stroke="#CCFF00" strokeWidth="3" />
          <polygon points="322.5,50 320,58 325,58" fill="#CCFF00" />

          {/* Crescent & Star */}
          <circle cx="322.5" cy="40" r="6" fill="#CCFF00" />
        </g>

        {/* Pakistan Monument Petals Illustration */}
        <g transform="translate(480, 80)">
          <path d="M60,160 Q10,80 60,10 Q110,80 60,160 Z" fill="url(#isbGold)" opacity="0.85" />
          <path d="M60,160 Q30,100 60,40 Q90,100 60,160 Z" fill="#0A2540" opacity="0.3" />
        </g>
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
    landmarksName: 'Statue of Liberty & Brooklyn Bridge',
    wardName: 'Manhattan Ward 4',
    gradientStyle: 'from-[#0A2540] via-[#1E293B] to-[#B45309]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="nyTorch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Brooklyn Bridge Cables */}
        <path d="M100,240 L100,100 L115,100 L115,240 M280,240 L280,100 L295,100 L295,240 M115,120 Q197.5,190 280,120" stroke="#CBD5E1" strokeWidth="3" fill="none" opacity="0.7" />

        {/* Statue of Liberty Torch Silhouette */}
        <g transform="translate(450, 20)">
          <path d="M80,220 L105,220 L100,160 L92,100 L102,70 L92,70 L85,30 L80,10 L75,30 L68,70 L58,70 L68,100 L60,160 Z" fill="#006D5B" />
          {/* Glowing Torch Flame */}
          <circle cx="80" cy="8" r="14" fill="url(#nyTorch)" />
          <path d="M80,-5 Q70,8 80,20 Q90,8 80,-5 Z" fill="#FDE047" />
        </g>
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
    gradientStyle: 'from-[#0A2540] via-[#0284C7] to-[#006D5B]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* London Eye Wheel */}
        <circle cx="220" cy="130" r="85" stroke="#CCFF00" strokeWidth="5" fill="none" opacity="0.6" />
        <circle cx="220" cy="130" r="12" fill="#CCFF00" />
        <line x1="220" y1="130" x2="220" y2="240" stroke="#CCFF00" strokeWidth="6" />

        {/* Big Ben Tower */}
        <g transform="translate(460, 10)">
          <path d="M40,230 L40,80 L32,80 L32,50 L48,20 L48,2 L50,2 L50,20 L66,50 L58,80 L50,80 L50,230 Z" fill="#F59E0B" />
          <circle cx="49" cy="65" r="10" fill="#FFFFFF" stroke="#0A2540" strokeWidth="2" />
        </g>
      </svg>
    )
  },
  {
    id: 'paris',
    cityName: 'Paris',
    demonym: 'PARISIAN',
    phrasePrefix: 'I AM A',
    inspirationalSlogan: 'Illuminating Neighborhoods With Enlightenment, Salon Culture & Passion',
    culturalHeritage: 'Bohemian Salon Culture & Architectural Elegance',
    culturalLandmarks: 'Eiffel Tower, Louvre Museum & Notre-Dame Cathedral',
    landmarksName: 'Eiffel Tower & Louvre Pyramid',
    wardName: '7th Arrondissement',
    gradientStyle: 'from-[#006D5B] via-[#0A2540] to-[#B45309]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Eiffel Tower */}
        <g transform="translate(380, 10)">
          <path d="M80,230 Q110,140 122,50 L125,5 L128,50 Q140,140 170,230 L145,230 Q132,160 125,120 Q118,160 105,230 Z" fill="#CCFF00" opacity="0.85" />
          <rect x="110" y="120" width="30" height="10" fill="#0A2540" />
          <rect x="116" y="60" width="18" height="8" fill="#0A2540" />
        </g>
      </svg>
    )
  },
  {
    id: 'tokyo',
    cityName: 'Tokyo',
    demonym: 'TOKYOITE',
    phrasePrefix: 'I AM A',
    inspirationalSlogan: 'Edo Shrine Traditions Meeting High-Tech Innovation in Harmony',
    culturalHeritage: 'Edo Shinto Traditions & Omotenashi Hospitality',
    culturalLandmarks: 'Sensō-ji Temple, Meiji Shrine & Tokyo Tower',
    landmarksName: 'Mt. Fuji & Tokyo Tower',
    wardName: 'Shinjuku Ward',
    gradientStyle: 'from-[#0A2540] via-[#881337] to-[#006D5B]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Mt Fuji */}
        <path d="M120,240 L280,100 Q320,80 360,100 L520,240 Z" fill="#0A2540" opacity="0.6" />
        <path d="M280,100 Q320,80 360,100 L340,130 Q320,120 300,130 Z" fill="#FFFFFF" opacity="0.8" />
        {/* Rising Sun */}
        <circle cx="320" cy="70" r="45" fill="#E11D48" opacity="0.8" />
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.county || addr.state_district || addr.state || 'Rawalpindi';
            applyDetectedCity(detectedCity, latitude, longitude);
          } else {
            applyDetectedCity('Rawalpindi', latitude, longitude);
          }
        } catch {
          applyDetectedCity('Rawalpindi', latitude, longitude);
        } finally {
          setIsGeotagging(false);
        }
      },
      (_err) => {
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
        gradientStyle: 'from-[#0A2540] via-[#004D40] to-[#006D5B]',
        monumentArtwork: (
          <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" aria-hidden="true">
            <path d="M100,240 Q180,120 260,240 M140,240 Q180,140 220,240" stroke="#CCFF00" strokeWidth="5" fill="none" opacity="0.8" />
            <circle cx="180" cy="110" r="15" fill="#B45309" opacity="0.8" />
          </svg>
        )
      };

      setCustomCityData(newCityObj);
      setGeotagSuccessMsg(`Geotagged: ${cityName} • Welcome, ${demonym}!`);
      if (onLocationChange) onLocationChange(cityName);
    }

    setTimeout(() => setGeotagSuccessMsg(null), 5000);
  };

  useEffect(() => {
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
        () => {},
        { timeout: 4000 }
      );
    }
  }, []);

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
        className="relative w-full min-h-[180px] sm:min-h-[230px] rounded-3xl p-5 sm:p-8 overflow-hidden flex flex-col justify-between clay-card-lvl3 bg-[#F7F3EB] text-[#2C2518] border-2 border-[#E4DACB] shadow-xl transition-all duration-500"
      >
        {/* Subtle Organic Clay Gradient & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(163,232,213,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(245,208,192,0.35),transparent_50%)] pointer-events-none z-0" />

        {/* Civic Arch Decorative Pattern Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-[radial-gradient(circle_at_0_50%,rgba(255,255,255,0.4),transparent_70%)] pointer-events-none z-0" />

        {/* Dynamic Watermark Monument Artwork Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 pointer-events-none z-0 overflow-hidden flex items-end justify-end opacity-40 hover:opacity-60 transition-opacity">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, x: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full h-full max-h-[220px]"
            >
              {activeCity.monumentArtwork}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Meta Bar: Location Selector & Civic Context */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          {/* Left Civic Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#A3E8D5] text-[#063B2F] border border-[#7CD6B8] shadow-xs font-['Montserrat']">
              <Building2 className="w-3.5 h-3.5 text-[#063B2F] shrink-0" />
              <span>{activeCity.wardName}</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#F5D0C0] text-[#5C2718] border border-[#E5B3A3] font-['Montserrat'] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#5C2718] animate-pulse" />
              <span>{activeCity.demonym} JURISDICTION</span>
            </div>

            <div className="hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#A3D5E0] text-[#093C47] border border-[#7BC3CF] font-['Montserrat'] shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#093C47] shrink-0" />
              <span>{activeCity.landmarksName}</span>
            </div>
          </div>

          {/* Right Controls: Geotag & City Selector */}
          <div className="flex items-center space-x-2">
            {/* Auto-GPS Geotag */}
            <button
              onClick={handleDetectGeotagLocation}
              disabled={isGeotagging}
              title="Auto-detect current city via GPS"
              className="flex items-center space-x-1.5 bg-[#06182B]/80 hover:bg-[#06182B] px-3 py-2 rounded-xl text-xs font-black text-white border border-slate-700 shadow-xs hover:border-[#006D5B] transition-all cursor-pointer min-h-[44px] disabled:opacity-50 font-['Montserrat'] backdrop-blur-md"
            >
              {isGeotagging ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Locate className="w-4 h-4 text-amber-400" />
              )}
              <span className="hidden sm:inline">{isGeotagging ? 'Geotagging...' : 'Auto-GPS'}</span>
            </button>

            {/* City Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="Change current city location"
                className="flex items-center space-x-2 bg-[#06182B]/80 hover:bg-[#06182B] px-3.5 py-2 rounded-xl text-xs font-black text-white border border-slate-700 shadow-xs hover:border-[#006D5B] transition-all cursor-pointer min-h-[44px] font-['Montserrat'] backdrop-blur-md"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{activeCity.cityName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* City Selection Modal Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-64 bg-[#0A2540] rounded-2xl shadow-2xl border-2 border-[#006D5B] p-2 z-50 text-white font-['Montserrat']"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-700/60 pb-2">
                      <span>Select City</span>
                      <span className="text-[10px] text-emerald-400 font-black">WCAG AAA</span>
                    </div>
                    <div className="space-y-1 mt-1.5 max-h-60 overflow-y-auto">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer min-h-[44px] ${
                            city.id === activeCity.id
                              ? 'bg-[#006D5B] text-white border border-[#006D5B]'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{city.cityName}</span>
                            <span className={`text-[10px] ${city.id === activeCity.id ? 'text-amber-200' : 'text-slate-400'}`}>
                              {city.demonym} • {city.wardName}
                            </span>
                          </div>
                          {city.id === activeCity.id && <Check className="w-4 h-4 text-amber-300" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Center Slogan ("Pride Element") & Cultural Identity */}
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
              <h1 className="font-['Montserrat'] font-black tracking-tight text-2xl sm:text-4xl lg:text-5xl leading-none text-[#2C2518]">
                <span>I AM A PROUD </span>
                <span className="inline-block text-[#063B2F] bg-[#A3E8D5] px-3 py-1 rounded-2xl border-2 border-[#7CD6B8]">
                  {activeCity.demonym}
                </span>
              </h1>
              
              <p className="flex items-center space-x-2 text-xs sm:text-sm md:text-base font-black tracking-wide text-black bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 inline-flex shadow-xs font-['Montserrat']">
                <Sparkles className="w-4 h-4 shrink-0 text-[#B45309]" />
                <span className="italic text-black font-black">"{activeCity.inspirationalSlogan}"</span>
              </p>

              {/* Glassmorphic Cultural Heritage Card */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 font-['Montserrat']">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#06182B]/80 border border-slate-700 text-slate-100 shadow-xs backdrop-blur-md">
                  <History className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Cultural Heritage:</strong> {activeCity.culturalHeritage}</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#06182B]/80 border border-slate-700 text-slate-100 shadow-xs backdrop-blur-md">
                  <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Heritage Monuments:</strong> {activeCity.culturalLandmarks}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
};


