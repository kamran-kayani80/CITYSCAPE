import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, Building2, Compass, Landmark, History, Locate, Loader2, RefreshCw, Plus, ShieldCheck, HeartHandshake, Globe2 } from 'lucide-react';
import { ThreeDWeatherWidget } from './ThreeDWeatherWidget';
import { KNOWN_CITIES, calculateDistanceKm } from '../lib/geoUtils';

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

// Pool of random motivational slogans for residents to own their city and report issues to the municipal team
export const CIVIC_MOTIVATIONAL_SLOGANS = [
  "This is your city — Own your street! Spot a pothole, broken streetlight, or leak? Report it directly to municipal crews.",
  "Every report is an act of community care. Alerting our city team keeps our streets safe for elders and children.",
  "Proud residents build thriving cities. When you speak up about neighborhood hazards, public works gets to work.",
  "You own this neighborhood! Take 60 seconds to file a report and help municipal teams prioritize what matters most.",
  "From local sidewalks to public parks: You are the eyes of our city. Report issues promptly and earn Civic Karma.",
  "Don't just pass by a hazard — Be the community leader your street needs. File a report to municipal public works.",
  "Bridging neighbors and city teams: Every voice counts, and every street deserves rapid municipal care.",
  "A safer, cleaner neighborhood starts with you. Report street issues today and help our dedicated city crews take action.",
  "Own your city, protect your community: Report hazards with one tap and track real-time resolution updates.",
  "Civic pride in action: Reporting neighborhood issues helps our public works teams build a better tomorrow."
];

// Known demonym dictionary with motivational civic slogans & rich cultural heritage
const DEMONYM_MAP: Record<string, { demonym: string; prefix: string; inspirationalSlogan: string; culturalHeritage: string; culturalLandmarks: string }> = {
  rawalpindi: {
    demonym: 'RAWALPINDIAN',
    prefix: 'I AM A',
    inspirationalSlogan: 'Preserving Ancient Potohari Heritage • Building a Stronger, Greener City Together',
    culturalHeritage: 'Ancient Potohari Crossroads • Garrison Heritage & Vibrant Crafts',
    culturalLandmarks: 'Raja Bazaar Clock Tower, Ayub Park & Taxila Gateway'
  },
  islamabad: {
    demonym: 'ISLAMABADIAN',
    prefix: 'I AM AN',
    inspirationalSlogan: 'Eco-Sanctuary of Margalla • Uniting Tradition & Proactive Municipal Care',
    culturalHeritage: 'Saidpur Heritage Village & Margalla Eco-Traditions',
    culturalLandmarks: 'Faisal Mosque, Pakistan Monument & Lok Virsa Museum'
  },
  lahore: {
    demonym: 'LAHORI',
    prefix: 'I AM A',
    inspirationalSlogan: 'Zinda Dilan-e-Lahore • Caring for Mughal Splendor, Sufi Wisdom & Thriving Streets',
    culturalHeritage: 'Mughal Architecture & Sufi Mysticism',
    culturalLandmarks: 'Badshahi Mosque, Lahore Fort & Shalamar Gardens'
  },
  karachi: {
    demonym: 'KARACHITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Lights — Standing Strong With Cosmopolitan Resilience & Community Ownership',
    culturalHeritage: 'Colonial Maritime Heritage & Port Trade History',
    culturalLandmarks: 'Mazar-e-Quaid, Mohatta Palace & Empress Market'
  },
  peshawar: {
    demonym: 'PESHAWARI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Flowers & Storytellers — Honoring Ancient Silk Road Pride & Civic Care',
    culturalHeritage: 'Ancient Silk Route Gateway & Pashtun Hospitality',
    culturalLandmarks: 'Qissa Khwani Bazaar, Bala Hisar Fort & Mahabat Khan Mosque'
  },
  quetta: {
    demonym: 'QUETTAITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'Fruit Garden of the Nation — Nurturing Balochi Craftsmanship & Mountain Unity',
    culturalHeritage: 'Fruit Gardens & Traditional Balochi Rug Weaving',
    culturalLandmarks: 'Hanna Lake, Urak Valley & Bolan Pass Gateway'
  },
  multan: {
    demonym: 'MULTANI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Saints — Honoring Centuries of Blue Tile Craft, Sufi Heritage & Safe Streets',
    culturalHeritage: 'Kashikari Blue Tile Pottery & Sufi Heritage',
    culturalLandmarks: 'Shrine of Shah Rukn-e-Alam, Tomb of Bahauddin Zakariya & Fort Kohna'
  },
  faisalabad: {
    demonym: 'FAISALABADI',
    prefix: 'I AM A',
    inspirationalSlogan: 'Engine of Growth — Preserving Artisan Craftsmanship & Active Neighborhood Care',
    culturalHeritage: 'Textile Artisan Legacy & Historic Eight-Bazaar Clock Tower Grid',
    culturalLandmarks: 'Ghanta Ghar (Clock Tower), Gumti Fountain & Lyallpur Heritage'
  },
  sialkot: {
    demonym: 'SIALKOTI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Iqbal & Master Artisans — Crafting World-Class Heritage & Civic Pride',
    culturalHeritage: 'Poetic Legacy of Allama Iqbal & Artisan Craftsmanship',
    culturalLandmarks: 'Iqbal Manzil, Sialkot Fort & Marala Headworks'
  },
  gujranwala: {
    demonym: 'GUJRANWALI',
    prefix: 'I AM A',
    inspirationalSlogan: 'City of Champions — Honoring Athletic Heritage, Local Unity & Clean Streets',
    culturalHeritage: 'Traditional Wrestling & Culinary Craftsmanship',
    culturalLandmarks: 'Estcourt Clock Tower, Nishan-e-Manzil & Sheranwala Gate'
  },
  'new york': {
    demonym: 'NEW YORKER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Melting Pot of Nations • Owning Our Streets & Caring for Every Block',
    culturalHeritage: 'Harlem Jazz, Broadway & Immigrant Cultural Legacy',
    culturalLandmarks: 'Statue of Liberty, Brooklyn Bridge & Central Park'
  },
  'new york city': {
    demonym: 'NEW YORKER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Melting Pot of Nations • Owning Our Streets & Caring for Every Block',
    culturalHeritage: 'Harlem Jazz, Broadway & Immigrant Cultural Legacy',
    culturalLandmarks: 'Statue of Liberty, Brooklyn Bridge & Central Park'
  },
  london: {
    demonym: 'LONDONER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Protecting Millennia of Heritage • Active Neighbors Building Stronger Boroughs',
    culturalHeritage: 'Thames Maritime Tradition & Shakespearean Heritage',
    culturalLandmarks: 'Big Ben, Tower of London & Globe Theatre'
  },
  paris: {
    demonym: 'PARISIAN',
    prefix: 'I AM A',
    inspirationalSlogan: 'Illuminating Neighborhoods With Enlightenment, Civic Pride & Community Care',
    culturalHeritage: 'Bohemian Salon Culture & Architectural Elegance',
    culturalLandmarks: 'Eiffel Tower, Louvre Museum & Notre-Dame Cathedral'
  },
  sydney: {
    demonym: 'SYDNEY-SIDER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Harbor of Opportunity — Caring for Coastal Beauty & Neighborhood Safety',
    culturalHeritage: 'Eora Nation Heritage & Pacific Maritime Traditions',
    culturalLandmarks: 'Sydney Opera House, Harbor Bridge & Bondi Beach'
  },
  berlin: {
    demonym: 'BERLINER',
    prefix: 'I AM A',
    inspirationalSlogan: 'Uniting Creative Expression, Freedom & Proactive Neighborhood Care',
    culturalHeritage: 'Creative Avant-Garde & Historic Reunification Spirit',
    culturalLandmarks: 'Brandenburg Gate, Museum Island & East Side Gallery'
  },
  tokyo: {
    demonym: 'TOKYOITE',
    prefix: 'I AM A',
    inspirationalSlogan: 'Harmonizing Ancient Shrine Traditions With Modern Civic Care & Cleanliness',
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
    inspirationalSlogan: `Standing Strong Together to Own Our City, Protect Local Heritage & Build a Safer ${clean}`,
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
    inspirationalSlogan: 'Preserving Ancient Potohari Heritage • Building a Stronger, Greener City Together',
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

        {/* Potohari Margalla Mountain Ridge */}
        <path d="M250,240 L340,140 L390,170 L480,90 L560,160 L680,80 L700,240 Z" fill="url(#pindiTeal)" opacity="0.35" />

        {/* The Civic Arch */}
        <path d="M120,240 Q180,120 240,240 M140,240 Q180,140 220,240" stroke="url(#pindiGold)" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M180,120 L180,70" stroke="#CCFF00" strokeWidth="4" />
        <circle cx="180" cy="65" r="7" fill="#CCFF00" filter="url(#pindiGlow)" />

        {/* Raja Bazaar Clock Tower */}
        <g filter="url(#pindiGlow)">
          <path d="M420,240 L420,100 L410,100 L410,70 L430,25 L430,10 L432,10 L432,25 L452,70 L452,100 L442,100 L442,240 Z" fill="url(#pindiGold)" />
          <circle cx="431" cy="85" r="11" fill="#FFFFFF" stroke="#0A2540" strokeWidth="2" />
          <circle cx="431" cy="85" r="2" fill="#0A2540" />
          <line x1="431" y1="85" x2="431" y2="78" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" />
          <line x1="431" y1="85" x2="436" y2="85" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" />
          <path d="M426,130 Q431,123 436,130 L436,155 L426,155 Z" fill="#0A2540" opacity="0.7" />
          <path d="M426,170 Q431,163 436,170 L436,200 L426,200 Z" fill="#0A2540" opacity="0.7" />
        </g>

        {/* Ayub National Park Arch */}
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
    inspirationalSlogan: 'Eco-Sanctuary of Margalla • Uniting Tradition & Proactive Municipal Care',
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

        {/* Faisal Mosque Artwork */}
        <g>
          <path d="M220,240 L220,50 L225,50 L225,240 M420,240 L420,50 L425,50 L425,240" stroke="url(#isbLime)" strokeWidth="4" />
          <circle cx="222.5" cy="45" r="4" fill="#CCFF00" />
          <circle cx="422.5" cy="45" r="4" fill="#CCFF00" />
          <polygon points="240,240 322.5,100 405,240" fill="url(#isbLime)" opacity="0.85" />
          <path d="M322.5,100 L322.5,55" stroke="#CCFF00" strokeWidth="3" />
          <polygon points="322.5,50 320,58 325,58" fill="#CCFF00" />
          <circle cx="322.5" cy="40" r="6" fill="#CCFF00" />
        </g>

        {/* Pakistan Monument Petals */}
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
    inspirationalSlogan: 'Melting Pot of Nations • Owning Our Streets & Caring for Every Block',
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
        <path d="M100,240 L100,100 L115,100 L115,240 M280,240 L280,100 L295,100 L295,240 M115,120 Q197.5,190 280,120" stroke="#CBD5E1" strokeWidth="3" fill="none" opacity="0.7" />
        <g transform="translate(450, 20)">
          <path d="M80,220 L105,220 L100,160 L92,100 L102,70 L92,70 L85,30 L80,10 L75,30 L68,70 L58,70 L68,100 L60,160 Z" fill="#006D5B" />
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
    inspirationalSlogan: 'Protecting Millennia of Heritage • Active Neighbors Building Stronger Boroughs',
    culturalHeritage: 'Thames Maritime Tradition & Shakespearean Heritage',
    culturalLandmarks: 'Big Ben, Tower of London & Globe Theatre',
    landmarksName: 'Big Ben & London Eye',
    wardName: 'Westminster Borough Ward 2',
    gradientStyle: 'from-[#0A2540] via-[#0284C7] to-[#006D5B]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="220" cy="130" r="85" stroke="#CCFF00" strokeWidth="5" fill="none" opacity="0.6" />
        <circle cx="220" cy="130" r="12" fill="#CCFF00" />
        <line x1="220" y1="130" x2="220" y2="240" stroke="#CCFF00" strokeWidth="6" />
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
    inspirationalSlogan: 'Illuminating Neighborhoods With Enlightenment, Civic Pride & Community Care',
    culturalHeritage: 'Bohemian Salon Culture & Architectural Elegance',
    culturalLandmarks: 'Eiffel Tower, Louvre Museum & Notre-Dame Cathedral',
    landmarksName: 'Eiffel Tower & Louvre Pyramid',
    wardName: '7th Arrondissement',
    gradientStyle: 'from-[#006D5B] via-[#0A2540] to-[#B45309]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    inspirationalSlogan: 'Harmonizing Ancient Shrine Traditions With Modern Civic Care & Cleanliness',
    culturalHeritage: 'Edo Shinto Traditions & Omotenashi Hospitality',
    culturalLandmarks: 'Sensō-ji Temple, Meiji Shrine & Tokyo Tower',
    landmarksName: 'Mt. Fuji & Tokyo Tower',
    wardName: 'Shinjuku Ward',
    gradientStyle: 'from-[#0A2540] via-[#881337] to-[#006D5B]',
    monumentArtwork: (
      <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M120,240 L280,100 Q320,80 360,100 L520,240 Z" fill="#0A2540" opacity="0.6" />
        <path d="M280,100 Q320,80 360,100 L340,130 Q320,120 300,130 Z" fill="#FFFFFF" opacity="0.8" />
        <circle cx="320" cy="70" r="45" fill="#E11D48" opacity="0.8" />
      </svg>
    )
  }
];

interface CitizenPrideBannerProps {
  onLocationChange?: (cityName: string) => void;
  onOpenReportModal?: () => void;
}

export const CitizenPrideBanner: React.FC<CitizenPrideBannerProps> = ({ onLocationChange, onOpenReportModal }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('rawalpindi');
  const [customCityData, setCustomCityData] = useState<CityData | null>(null);
  const [isGeotagging, setIsGeotagging] = useState<boolean>(false);
  const [geotagSuccessMsg, setGeotagSuccessMsg] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat?: number; lng?: number }>({
    lat: 33.597,
    lng: 73.0449,
  });

  // Dynamic Random Slogan State
  const [sloganIndex, setSloganIndex] = useState<number>(() => Math.floor(Math.random() * CIVIC_MOTIVATIONAL_SLOGANS.length));
  const [isRotatingSlogan, setIsRotatingSlogan] = useState<boolean>(false);

  const activeCity: CityData = customCityData || CITIES.find((c) => c.id === selectedCityId) || CITIES[0];

  const handleNextSlogan = () => {
    setIsRotatingSlogan(true);
    setTimeout(() => {
      setSloganIndex((prev) => (prev + 1) % CIVIC_MOTIVATIONAL_SLOGANS.length);
      setIsRotatingSlogan(false);
    }, 150);
  };

  const handleDetectGeotagLocation = () => {
    setIsGeotagging(true);
    setGeotagSuccessMsg(null);

    if (!navigator.geolocation) {
      setIsGeotagging(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });

        // 1. Check if coords are close (<60km) to a known curated city (0 network requests needed!)
        let closestKnownCity: string | null = null;
        let minDistance = Infinity;
        for (const city of KNOWN_CITIES) {
          const d = calculateDistanceKm(latitude, longitude, city.lat, city.lng);
          if (d < minDistance) {
            minDistance = d;
            if (d < 60) {
              closestKnownCity = city.name;
            }
          }
        }

        if (closestKnownCity) {
          applyDetectedCity(closestKnownCity, latitude, longitude);
          setIsGeotagging(false);
          return;
        }

        // 2. Fallback to Open-Meteo or Nominatim with rate limiting
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: { 'User-Agent': 'CITYSCAPE-CommunityCivicPlatform/1.0', 'Accept-Language': 'en' },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.municipality || addr.county || addr.state_district || addr.state || 'Rawalpindi';
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
      { timeout: 6000, enableHighAccuracy: false }
    );
  };

  const applyDetectedCity = (cityName: string, _lat: number, _lon: number) => {
    localStorage.setItem('cityscape_user_city', cityName);
    if (_lat !== undefined && _lon !== undefined && !isNaN(_lat) && !isNaN(_lon) && isFinite(_lat) && isFinite(_lon)) {
      localStorage.setItem('cityscape_user_lat', _lat.toString());
      localStorage.setItem('cityscape_user_lng', _lon.toString());
      setCurrentCoords({ lat: _lat, lng: _lon });
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
    const savedCity = localStorage.getItem('cityscape_user_city');
    if (savedCity) {
      const matched = CITIES.find((c) => c.cityName.toLowerCase() === savedCity.toLowerCase());
      if (matched) {
        setSelectedCityId(matched.id);
      }
    }
  }, []);

  const handleOpenReport = () => {
    if (onOpenReportModal) {
      onOpenReportModal();
    } else {
      window.dispatchEvent(new CustomEvent('cityscape:open-report-modal'));
    }
  };

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
        className="relative w-full min-h-[180px] sm:min-h-[220px] md:min-h-[240px] rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#0A2540] via-[#0E3357] to-[#0A2540] dark:from-[#051321] dark:via-[#0A2540] dark:to-[#051321] text-white border-2 border-[#1E3A8A]/40 dark:border-slate-700 shadow-xl transition-all duration-500"
      >
        {/* Subtle Organic Clay Gradient & Glow with Brand Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,109,91,0.35),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(180,83,9,0.2),transparent_50%)] pointer-events-none z-0" />

        {/* Civic Arch Decorative Pattern Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-[radial-gradient(circle_at_0_50%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none z-0" />

        {/* Dynamic Watermark Monument Artwork Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 pointer-events-none z-0 overflow-hidden flex items-end justify-end opacity-20 sm:opacity-25 md:opacity-30 hover:opacity-35 transition-opacity">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full max-h-[140px] sm:max-h-[180px] md:max-h-[220px]"
            >
              {activeCity.monumentArtwork}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Meta Bar: Location Selector, Geotag Trigger & Civic Context */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3.5 border-b border-white/15 dark:border-white/10">
          {/* Civic Jurisdiction Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#006D5B] text-white border border-teal-300/40 shadow-xs shrink-0">
              <Building2 className="w-3.5 h-3.5 text-teal-200 shrink-0" />
              <span className="truncate max-w-[130px] xs:max-w-none">{activeCity.wardName}</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold bg-[#B45309] text-white border border-amber-300/40 shadow-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse shrink-0" />
              <span className="truncate max-w-[120px] xs:max-w-none">{activeCity.demonym} JURISDICTION</span>
            </div>

            <div className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold bg-white/15 dark:bg-slate-800/80 text-white border border-white/20 shadow-xs shrink-0">
              <Compass className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate max-w-[180px]">{activeCity.landmarksName}</span>
            </div>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('cityscape:open-civic-lexicon'))}
              title="Open International Civic Lexicon Matrix & Standards"
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-xs shrink-0 transition-all cursor-pointer active:scale-95"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">ISO 37120</span>
              <span>Civic Lexicon</span>
            </button>
          </div>

          {/* Right: Consolidated Geotag Location Control */}
          <div className="flex items-center self-start sm:self-auto shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDetectGeotagLocation}
              disabled={isGeotagging}
              title="Click to detect current location or refresh geotag"
              aria-label={`Current location: ${activeCity.cityName}. Click to auto-detect GPS location.`}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl text-xs font-bold shadow-xs active:scale-97 transition-all cursor-pointer disabled:opacity-60 min-h-[38px] w-full sm:w-auto"
            >
              {isGeotagging ? (
                <Loader2 className="w-3.5 h-3.5 text-teal-300 animate-spin shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              )}
              <span className="truncate max-w-[140px] sm:max-w-[180px]">
                {isGeotagging ? 'Detecting Location...' : activeCity.cityName}
              </span>
              <span className="text-[10px] font-semibold text-teal-200 bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider ml-0.5 shrink-0 hidden xs:inline">
                {isGeotagging ? 'GPS' : 'Auto GPS'}
              </span>
            </button>
          </div>
        </div>

        {/* Geotag Success Notification Toast */}
        <AnimatePresence>
          {geotagSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              className="relative z-10 py-2 px-3.5 my-2 rounded-xl bg-[#006D5B] text-white text-xs font-bold flex items-center gap-2 shadow-sm border border-teal-300/40"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{geotagSuccessMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid: Pride Slogan, Random Motivational Callout (Left) & 3D Weather Widget (Right) */}
        <div className="relative z-10 pt-2.5 sm:pt-3 md:pt-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 items-stretch">
          {/* Left Column (Pride Slogan & Motivational Call to Action): 7 Columns on Desktop */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5 sm:space-y-3.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between"
              >
                {/* Scaled Responsive Slogan Headline */}
                <div className="space-y-0.5 sm:space-y-1">
                  <span
                    className="block text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-white"
                    style={{ color: '#FFFFFF' }}
                  >
                    Civic Resident Demonym
                  </span>
                  <h1
                    className="font-extrabold tracking-tight text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight text-white flex flex-wrap items-center gap-1.5 sm:gap-2"
                    style={{ color: '#FFFFFF' }}
                  >
                    <span className="whitespace-nowrap text-white" style={{ color: '#FFFFFF' }}>
                      I AM A PROUD
                    </span>
                    <span
                      className="inline-block text-white bg-white/20 backdrop-blur-md px-2.5 xs:px-3 sm:px-4 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl border-2 border-white shadow-md max-w-full truncate"
                      style={{ color: '#FFFFFF' }}
                    >
                      {activeCity.demonym}
                    </span>
                  </h1>
                </div>
                
                {/* Dynamic Motivational Slogan Box (Randomized Civic Call to Own the City & Report to Public Works) */}
                <div className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/12 dark:bg-white/8 backdrop-blur-md border border-white/25 shadow-sm space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                      <span>Neighborhood Civic Duty</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextSlogan}
                      title="Generate another motivational civic slogan"
                      aria-label="Generate new random motivational slogan"
                      className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/15 hover:bg-white/30 text-white text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer border border-white/20 active:scale-95 shrink-0"
                    >
                      <RefreshCw className={`w-3 h-3 text-teal-300 ${isRotatingSlogan ? 'animate-spin' : ''}`} />
                      <span>Inspire Me</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={sloganIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs sm:text-sm font-semibold text-white leading-relaxed break-words"
                    >
                      "{CIVIC_MOTIVATIONAL_SLOGANS[sloganIndex]}"
                    </motion.p>
                  </AnimatePresence>

                  {/* Motivational Action Bar: Report to Municipal Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-white/15">
                    <button
                      id="banner-btn-report-problem"
                      type="button"
                      onClick={handleOpenReport}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#B45309] hover:bg-[#92400E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer border border-amber-300/40 min-h-[40px] sm:min-h-[44px]"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3] text-amber-200" />
                      <span>Report a Problem to City Team</span>
                    </button>
                    <span className="text-[10px] sm:text-[11px] text-teal-200 font-medium text-center sm:text-right">
                      +50 Civic Karma for every report
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: 3D Weather Widget (5 Columns on Desktop) */}
          <div className="lg:col-span-5 w-full flex">
            <ThreeDWeatherWidget
              cityName={activeCity.cityName}
              lat={currentCoords.lat}
              lng={currentCoords.lng}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
