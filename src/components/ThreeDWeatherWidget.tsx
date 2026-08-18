import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  MoonStar,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Eye,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

export interface WeatherData {
  city: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
  precipitationChance: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  conditionLabel: string;
  conditionCategory: 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  hourly: {
    time: string;
    temp: number;
    code: number;
  }[];
  daily: {
    day: string;
    max: number;
    min: number;
    code: number;
  }[];
  civicAdvisory: string;
  lastUpdated: string;
}

// Known coordinates mapping
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  rawalpindi: { lat: 33.597, lng: 73.0449 },
  islamabad: { lat: 33.6844, lng: 73.0479 },
  lahore: { lat: 31.5204, lng: 74.3587 },
  karachi: { lat: 24.8607, lng: 67.0011 },
  peshawar: { lat: 34.0151, lng: 71.5249 },
  quetta: { lat: 30.1798, lng: 66.975 },
  multan: { lat: 30.1575, lng: 71.5249 },
  faisalabad: { lat: 31.4504, lng: 73.135 },
  sialkot: { lat: 32.4945, lng: 74.5229 },
  gujranwala: { lat: 32.1877, lng: 74.1945 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'new york city': { lat: 40.7128, lng: -74.006 },
  london: { lat: 51.5074, lng: -0.1278 },
  paris: { lat: 48.8566, lng: 2.3522 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  berlin: { lat: 52.52, lng: 13.405 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
};

// Interpret WMO weather codes into human condition & category
function interpretWmoCode(code: number, isDay: boolean = true): {
  label: string;
  category: 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  advisory: string;
} {
  if (code === 0) {
    return {
      label: isDay ? 'Sunny & Clear' : 'Clear Starlit Night',
      category: 'clear',
      advisory: 'Optimal visibility for civic inspections and outdoor transit.',
    };
  }
  if (code === 1 || code === 2) {
    return {
      label: isDay ? 'Partly Sunny' : 'Partly Cloudy Night',
      category: 'cloudy',
      advisory: 'Pleasant weather for neighborhood walking and community events.',
    };
  }
  if (code === 3) {
    return {
      label: 'Overcast Skies',
      category: 'cloudy',
      advisory: 'Mild conditions; municipal operations running on normal schedule.',
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      label: 'Fog & Atmospheric Mist',
      category: 'fog',
      advisory: 'Reduced visibility on major roads; exercise caution at intersections.',
    };
  }
  if (code >= 51 && code <= 67) {
    return {
      label: 'Passing Rain Showers',
      category: 'rain',
      advisory: 'Watch for wet road surfaces and report any drainage blockages.',
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      label: 'Snow & Flurries',
      category: 'snow',
      advisory: 'Municipal gritting crews prioritized on major transit corridors.',
    };
  }
  if (code >= 80 && code <= 82) {
    return {
      label: 'Heavy Rain Showers',
      category: 'rain',
      advisory: 'Stormwater drains monitored; please report standing street water.',
    };
  }
  if (code >= 95 && code <= 99) {
    return {
      label: 'Thunderstorm Active',
      category: 'thunderstorm',
      advisory: 'Electrical storm advisory; stay clear of high powerlines and trees.',
    };
  }
  return {
    label: 'Fair Weather',
    category: 'clear',
    advisory: 'Standard conditions across city municipal sectors.',
  };
}

interface ThreeDWeatherWidgetProps {
  cityName: string;
  lat?: number;
  lng?: number;
  className?: string;
}

// Client-side cache for weather data to prevent Open-Meteo rate limits
const weatherMemoryCache = new Map<string, { data: WeatherData; timestamp: number }>();
const WEATHER_CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL

export const ThreeDWeatherWidget: React.FC<ThreeDWeatherWidgetProps> = ({
  cityName,
  lat,
  lng,
  className = '',
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 3D Card Parallax Tilt Ref
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Mild tilt for high-end optical depth
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const fetchWeather = async () => {
    const cacheKey = `${cityName.toLowerCase().trim()}_${lat?.toFixed(2) || ''}_${lng?.toFixed(2) || ''}`;

    // 1. Check in-memory cache
    const cached = weatherMemoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL_MS) {
      setWeather(cached.data);
      setIsLoading(false);
      return;
    }

    // 2. Check sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(`cityscape_weather_${cacheKey}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < WEATHER_CACHE_TTL_MS) {
            weatherMemoryCache.set(cacheKey, { data: parsed.data, timestamp: parsed.timestamp });
            setWeather(parsed.data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Ignore JSON or storage errors
      }
    }

    setIsLoading(true);
    let targetLat = lat;
    let targetLng = lng;

    const lowerCity = cityName.toLowerCase().trim();
    if ((targetLat === undefined || targetLng === undefined) && CITY_COORDS[lowerCity]) {
      targetLat = CITY_COORDS[lowerCity].lat;
      targetLng = CITY_COORDS[lowerCity].lng;
    }

    // Dynamic Geocoding lookup if coords still missing
    if (targetLat === undefined || targetLng === undefined) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            targetLat = geoData.results[0].latitude;
            targetLng = geoData.results[0].longitude;
          }
        }
      } catch (e) {
        console.warn('Geocoding notice, using default coordinates:', e);
      }
    }

    if (targetLat === undefined || targetLng === undefined) {
      targetLat = 33.597;
      targetLng = 73.0449; // Default Rawalpindi
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const current = data.current || {};
        const daily = data.daily || {};
        const hourly = data.hourly || {};

        const weatherCode = current.weather_code ?? 0;
        const isDay = current.is_day === 1;
        const { label, category, advisory } = interpretWmoCode(weatherCode, isDay);

        // Process hourly (next 6 hours)
        const hourlyList = [];
        const nowIndex = 0;
        for (let i = nowIndex; i < Math.min(nowIndex + 6, hourly.time?.length || 0); i++) {
          const timeStr = hourly.time?.[i] || '';
          const hourPart = timeStr.split('T')[1]?.slice(0, 5) || `${i}:00`;
          hourlyList.push({
            time: hourPart,
            temp: Math.round(hourly.temperature_2m?.[i] ?? 24),
            code: hourly.weather_code?.[i] ?? 0,
          });
        }

        // Process daily (next 3 days)
        const dailyList = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < Math.min(3, daily.time?.length || 0); i++) {
          const d = new Date(daily.time[i]);
          dailyList.push({
            day: i === 0 ? 'Today' : dayNames[d.getDay()],
            max: Math.round(daily.temperature_2m_max?.[i] ?? 28),
            min: Math.round(daily.temperature_2m_min?.[i] ?? 18),
            code: daily.weather_code?.[i] ?? 0,
          });
        }

        const weatherPayload: WeatherData = {
          city: cityName,
          temperature: Math.round(current.temperature_2m ?? 26),
          apparentTemperature: Math.round(current.apparent_temperature ?? 27),
          humidity: Math.round(current.relative_humidity_2m ?? 50),
          windSpeed: Math.round(current.wind_speed_10m ?? 12),
          windDirection: Math.round(current.wind_direction_10m ?? 180),
          pressure: Math.round(current.surface_pressure ?? 1013),
          uvIndex: Math.round(current.uv_index ?? 4),
          weatherCode,
          isDay,
          precipitationChance: Math.round(daily.precipitation_probability_max?.[0] ?? 10),
          tempMax: Math.round(daily.temperature_2m_max?.[0] ?? 30),
          tempMin: Math.round(daily.temperature_2m_min?.[0] ?? 19),
          sunrise: daily.sunrise?.[0]?.split('T')[1]?.slice(0, 5) || '05:45',
          sunset: daily.sunset?.[0]?.split('T')[1]?.slice(0, 5) || '19:15',
          conditionLabel: label,
          conditionCategory: category,
          civicAdvisory: advisory,
          hourly: hourlyList,
          daily: dailyList,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Cache the result
        weatherMemoryCache.set(cacheKey, { data: weatherPayload, timestamp: Date.now() });
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(
              `cityscape_weather_${cacheKey}`,
              JSON.stringify({ data: weatherPayload, timestamp: Date.now() })
            );
          }
        } catch {
          // Ignore storage quota
        }

        setWeather(weatherPayload);
      } else {
        generateSmartFallbackWeather(cityName);
      }
    } catch (err) {
      console.warn('Weather fetch notice, using cached or fallback data:', err);
      generateSmartFallbackWeather(cityName);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartFallbackWeather = (city: string) => {
    // Generate realistic simulated weather based on current local season
    const isDayTime = new Date().getHours() >= 6 && new Date().getHours() <= 19;
    const baseTemp = city.toLowerCase().includes('karachi') ? 31 : city.toLowerCase().includes('london') ? 16 : 27;
    const { label, category, advisory } = interpretWmoCode(isDayTime ? 1 : 0, isDayTime);

    setWeather({
      city,
      temperature: baseTemp,
      apparentTemperature: baseTemp + 2,
      humidity: 48,
      windSpeed: 14,
      windDirection: 210,
      pressure: 1012,
      uvIndex: isDayTime ? 5 : 0,
      weatherCode: 1,
      isDay: isDayTime,
      precipitationChance: 12,
      tempMax: baseTemp + 4,
      tempMin: baseTemp - 5,
      sunrise: '05:52',
      sunset: '19:08',
      conditionLabel: label,
      conditionCategory: category,
      civicAdvisory: advisory,
      hourly: [
        { time: '12:00', temp: baseTemp, code: 0 },
        { time: '14:00', temp: baseTemp + 2, code: 1 },
        { time: '16:00', temp: baseTemp + 1, code: 1 },
        { time: '18:00', temp: baseTemp - 1, code: 2 },
        { time: '20:00', temp: baseTemp - 3, code: 0 },
        { time: '22:00', temp: baseTemp - 5, code: 0 },
      ],
      daily: [
        { day: 'Today', max: baseTemp + 3, min: baseTemp - 4, code: 1 },
        { day: 'Tomorrow', max: baseTemp + 4, min: baseTemp - 3, code: 0 },
        { day: 'Day After', max: baseTemp + 2, min: baseTemp - 5, code: 2 },
      ],
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  useEffect(() => {
    fetchWeather();
  }, [cityName, lat, lng]);

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  // Toggle Day/Night simulation mode for user preview
  const toggleDayNightMode = () => {
    if (!weather) return;
    const newIsDay = !weather.isDay;
    const { label, category, advisory } = interpretWmoCode(weather.weatherCode, newIsDay);
    setWeather({
      ...weather,
      isDay: newIsDay,
      conditionLabel: label,
      conditionCategory: category,
      civicAdvisory: advisory,
    });
  };

  // Render High-Fidelity 3D Volumetric Weather Sculpture (Day & Night Adaptive)
  const render3DWeatherSculpture = (category: string, isDay: boolean) => {
    return (
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none perspective-[800px] shrink-0">
        {/* Ambient Depth Rim Glow - Adaptive to Day/Night */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-colors duration-700 ${
            category === 'clear'
              ? isDay
                ? 'bg-amber-400/50 opacity-70'
                : 'bg-indigo-400/40 dark:bg-indigo-500/50 opacity-80'
              : category === 'cloudy'
              ? isDay
                ? 'bg-sky-300/40 opacity-60'
                : 'bg-indigo-900/40 dark:bg-indigo-700/40 opacity-70'
              : category === 'thunderstorm'
              ? 'bg-purple-500/50 opacity-70'
              : category === 'rain'
              ? isDay
                ? 'bg-teal-400/40 opacity-60'
                : 'bg-indigo-600/40 opacity-70'
              : category === 'snow'
              ? 'bg-cyan-200/50 opacity-60'
              : 'bg-slate-300/40 opacity-60'
          }`}
        />

        {/* 3D SCULPTURE: CLEAR (DAY = SUN, NIGHT = MOON) */}
        {category === 'clear' && (
          isDay ? (
            /* DAY TIME: 3D VOLUMETRIC RADIANT SUN */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Pulsing Corona Rays */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                className="absolute inset-1.5 rounded-full border-2 border-dashed border-amber-300/70 opacity-80"
              />
              {/* Outer Ray Beams */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center opacity-70"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-1.5 h-6 rounded-full bg-gradient-to-t from-amber-400 to-amber-200"
                    style={{ transform: `rotate(${deg}deg) translateY(-32px)` }}
                  />
                ))}
              </motion.div>

              {/* 3D Clay Sphere Sun Orb */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[inset_-4px_-4px_8px_rgba(180,83,9,0.7),inset_4px_4px_8px_rgba(255,255,255,0.9),0_10px_20px_rgba(245,158,11,0.5)] bg-gradient-to-br from-[#FDE047] via-[#F59E0B] to-[#D97706] border border-amber-200 flex items-center justify-center"
              >
                {/* Specular Highlight */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-white/80 blur-[1px]" />
                <div className="w-4 h-4 rounded-full bg-amber-100/30" />
              </motion.div>
            </div>
          ) : (
            /* NIGHT TIME: 3D VOLUMETRIC LUMINOUS MOON WITH CONSTELLATION TWINKLES */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Celestial Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
                className="absolute inset-1 rounded-full border border-dashed border-indigo-300/40 opacity-70"
              />

              {/* Twinkling Star Clusters */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 36, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Star 1 - Top Right */}
                <motion.div
                  animate={{ scale: [0.7, 1.25, 0.7], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  className="absolute -top-1 right-2 text-amber-200 drop-shadow-[0_0_6px_rgba(254,240,138,0.9)]"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-amber-100 stroke-amber-300" />
                </motion.div>

                {/* Star 2 - Bottom Left */}
                <motion.div
                  animate={{ scale: [1.2, 0.6, 1.2], opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: 'easeInOut' }}
                  className="absolute bottom-1 left-2 text-cyan-200 drop-shadow-[0_0_6px_rgba(165,243,252,0.9)]"
                >
                  <Sparkles className="w-3 h-3 fill-cyan-100 stroke-cyan-300" />
                </motion.div>

                {/* Star 3 - Far Right */}
                <motion.div
                  animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.8, delay: 1, ease: 'easeInOut' }}
                  className="absolute right-0 bottom-4 text-purple-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                </motion.div>

                {/* Star 4 - Far Left Top */}
                <motion.div
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3.2, delay: 1.5, ease: 'easeInOut' }}
                  className="absolute left-1 top-3 text-indigo-200"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-100 shadow-[0_0_8px_rgba(199,210,254,0.9)]" />
                </motion.div>
              </motion.div>

              {/* 3D Volumetric Crescent Moon */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                  rotate: [-2, 3, -2],
                  scale: [1, 1.03, 1],
                }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="relative w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center"
              >
                {/* Outer Silver Moonlight Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-300/30 to-white/40 blur-md" />

                {/* Crescent Moon Body (Sculpted with Clay Gradient & Craters) */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#E2E8F0] to-[#94A3B8] shadow-[inset_-4px_-4px_8px_rgba(30,41,59,0.6),inset_4px_4px_8px_rgba(255,255,255,1),0_10px_22px_rgba(99,102,241,0.35)] border border-white/90 overflow-hidden flex items-center justify-center">
                  {/* Subtle Lunar Craters */}
                  <div className="absolute top-2.5 left-3 w-2.5 h-2.5 rounded-full bg-slate-300/70 shadow-[inset_1px_1px_2px_rgba(15,23,42,0.4)]" />
                  <div className="absolute bottom-3 left-4 w-3.5 h-3.5 rounded-full bg-slate-300/60 shadow-[inset_1px_1px_2px_rgba(15,23,42,0.4)]" />
                  <div className="absolute top-6 left-2 w-1.5 h-1.5 rounded-full bg-slate-300/50" />

                  {/* Moon Eclipse Shadow Mask to create 3D Crescent Shape */}
                  <div className="absolute -top-1 -right-1 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0A2540] dark:bg-[#07211E] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.8)] opacity-95 transition-colors" />

                  {/* Specular Highlight along Crescent Ridge */}
                  <div className="absolute top-1.5 left-2 w-4 h-6 rounded-full bg-white/70 blur-[1px] -rotate-12 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          )
        )}

        {/* 3D SCULPTURE: CLOUDY (DAY = SUN + CLOUD, NIGHT = MOON + CLOUD) */}
        {category === 'cloudy' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {isDay ? (
              /* Background Sun Peeking */
              <motion.div
                animate={{ y: [0, -3, 0], scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-[#FDE047] via-[#F59E0B] to-[#D97706] shadow-[inset_-2px_-2px_6px_rgba(180,83,9,0.6),0_4px_12px_rgba(245,158,11,0.4)] border border-amber-200"
              >
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-white/70" />
              </motion.div>
            ) : (
              /* Background Moon Peeking (Night Time) */
              <motion.div
                animate={{ y: [0, -3, 0], rotate: [-2, 3, -2] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute -top-1.5 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#E2E8F0] to-[#94A3B8] shadow-[inset_-2px_-2px_5px_rgba(30,41,59,0.6),0_4px_14px_rgba(165,180,252,0.5)] border border-white/90 overflow-hidden flex items-center justify-center"
              >
                {/* Crescent Shadow Mask */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#0A2540] dark:bg-[#07211E] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)] opacity-95 transition-colors" />
                <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80" />
              </motion.div>
            )}

            {/* Foreground 3D Volumetric Cloud Group */}
            <motion.div
              animate={{ x: [-2, 2, -2], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative z-10 flex items-center justify-center"
            >
              <div className={`relative w-14 h-9 sm:w-16 sm:h-10 rounded-2xl shadow-[inset_-3px_-3px_6px_rgba(15,23,42,0.15),inset_3px_3px_6px_rgba(255,255,255,0.9),0_10px_16px_rgba(10,37,64,0.2)] border flex items-center justify-center ${
                isDay
                  ? 'bg-gradient-to-b from-white via-slate-100 to-slate-300 border-white/80'
                  : 'bg-gradient-to-b from-slate-100 via-slate-200 to-indigo-200/90 border-indigo-100/80 shadow-[0_10px_18px_rgba(30,27,75,0.3)]'
              }`}>
                {/* Cloud Puffs */}
                <div className="absolute -top-3 left-2 w-7 h-7 bg-gradient-to-b from-white to-slate-200 rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9)]" />
                <div className="absolute -top-4 right-2 w-8 h-8 bg-gradient-to-b from-white to-slate-200 rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9)]" />
                <div className="relative z-10 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  ☁️
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 3D SCULPTURE: RAIN / SHOWERS (DAY & NIGHT ADAPTIVE) */}
        {category === 'rain' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Optional Night Moon in Rain Background */}
            {!isDay && (
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-2 right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFFBEB] to-[#94A3B8] overflow-hidden opacity-80"
              >
                <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0A2540] dark:bg-[#07211E]" />
              </motion.div>
            )}

            {/* 3D Slate Rain Cloud */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className={`relative z-10 w-14 h-8 rounded-2xl shadow-[inset_-3px_-3px_6px_rgba(15,23,42,0.25),inset_3px_3px_6px_rgba(255,255,255,0.8),0_8px_14px_rgba(10,37,64,0.25)] border flex items-center justify-center ${
                isDay
                  ? 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-slate-300'
                  : 'bg-gradient-to-b from-slate-400 via-slate-600 to-indigo-900 border-slate-500 text-indigo-100'
              }`}
            >
              <div className="absolute -top-3 left-1.5 w-6 h-6 bg-gradient-to-b from-slate-100 to-slate-300 rounded-full" />
              <div className="absolute -top-4 right-1.5 w-7 h-7 bg-gradient-to-b from-slate-100 to-slate-300 rounded-full" />
            </motion.div>

            {/* Falling 3D Rain Droplets */}
            <div className="flex gap-2 mt-1 z-0">
              {[0, 1, 2].map((idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [-2, 10, -2], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: idx * 0.35,
                    ease: 'easeInOut',
                  }}
                  className={`w-1.5 h-3 rounded-full transform rotate-12 ${
                    isDay
                      ? 'bg-gradient-to-b from-teal-300 to-teal-600 shadow-[0_2px_4px_rgba(13,148,136,0.5)]'
                      : 'bg-gradient-to-b from-cyan-200 to-indigo-500 shadow-[0_2px_6px_rgba(56,189,248,0.6)]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3D SCULPTURE: THUNDERSTORM */}
        {category === 'thunderstorm' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="relative z-10 w-14 h-8 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-900 rounded-2xl shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.5),inset_3px_3px_6px_rgba(255,255,255,0.3),0_8px_16px_rgba(10,37,64,0.4)] border border-slate-600 flex items-center justify-center"
            >
              <div className="absolute -top-3 left-1.5 w-6 h-6 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full" />
              <div className="absolute -top-4 right-1.5 w-7 h-7 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full" />
            </motion.div>

            {/* 3D Golden Lightning Bolt */}
            <motion.div
              animate={{ opacity: [1, 0.4, 1, 0.8, 1], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="relative -mt-1 z-20 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            >
              <CloudLightning className="w-6 h-6 fill-amber-300 stroke-amber-400 stroke-2" />
            </motion.div>
          </div>
        )}

        {/* 3D SCULPTURE: SNOW */}
        {category === 'snow' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative z-10 w-14 h-8 bg-gradient-to-b from-blue-50 via-sky-100 to-sky-200 rounded-2xl shadow-[inset_-3px_-3px_6px_rgba(14,116,144,0.2),inset_3px_3px_6px_rgba(255,255,255,0.9),0_8px_14px_rgba(10,37,64,0.2)] border border-sky-100 flex items-center justify-center"
            >
              <div className="absolute -top-3 left-1.5 w-6 h-6 bg-white rounded-full" />
              <div className="absolute -top-4 right-1.5 w-7 h-7 bg-white rounded-full" />
            </motion.div>

            {/* 3D Rotating Snowflake Crystals */}
            <div className="flex gap-2 mt-1 z-0">
              {[0, 1].map((idx) => (
                <motion.div
                  key={idx}
                  animate={{ rotate: 360, y: [-1, 6, -1] }}
                  transition={{ repeat: Infinity, duration: 3.5, delay: idx * 0.6, ease: 'linear' }}
                  className="text-sky-300 drop-shadow-[0_0_4px_rgba(56,189,248,0.8)]"
                >
                  <CloudSnow className="w-4 h-4 fill-sky-200 stroke-sky-400" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 3D SCULPTURE: FOG / MIST */}
        {category === 'fog' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <motion.div
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-14 h-8 bg-gradient-to-b from-slate-200 to-slate-400 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8)] border border-slate-300"
            />
            <motion.div
              animate={{ x: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="mt-1 space-y-1 w-12"
            >
              <div className="h-1 rounded-full bg-slate-300/80 shadow-xs" />
              <div className="h-1 rounded-full bg-slate-400/80 shadow-xs w-3/4 mx-auto" />
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative z-20 w-full ${className}`}>
      {/* Main 3D Weather Glass/Clay Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full bg-white/95 dark:bg-[#07211E]/95 backdrop-blur-md border-2 border-[#8EB69B]/60 dark:border-teal-500/40 rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_12px_28px_rgba(10,37,64,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] text-[#111827] dark:text-white transition-all duration-300 flex flex-col justify-between"
      >
        {/* Subtle Specular Top Sheen */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none" />

        {/* Top Header Row: Geotag Status & Refresh / Toggle Units */}
        <div className="flex items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-slate-200/80 dark:border-teal-500/20 text-xs">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006D5B]" />
            </span>
            <span className="font-bold tracking-wide uppercase text-[#006D5B] dark:text-teal-300 text-[10px] sm:text-xs shrink-0">
              Live Weather
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate text-[11px] sm:text-xs">
              {cityName}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Day / Night Mode Cycle Switcher (Interactive Preview & Live Diurnal Sync) */}
            <button
              type="button"
              onClick={toggleDayNightMode}
              disabled={isLoading || !weather}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer min-h-[28px] ${
                weather?.isDay
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-[#B45309] dark:text-amber-300 hover:bg-amber-100 shadow-xs'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 shadow-xs'
              }`}
              title={`Currently showing ${weather?.isDay ? 'Daytime (Sun)' : 'Nighttime (Moon)'} mode. Click to toggle Day/Night simulation.`}
              aria-label={`Toggle Day or Night weather animation. Currently ${weather?.isDay ? 'Day' : 'Night'}.`}
            >
              {weather?.isDay ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-spin-slow" />
                  <span className="hidden xs:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-300" />
                  <span className="hidden xs:inline">Night</span>
                </>
              )}
            </button>

            {/* Unit Switcher */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-300/80 dark:border-slate-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setUnit('C')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer min-h-[28px] ${
                  unit === 'C'
                    ? 'bg-[#006D5B] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#111827]'
                }`}
                title="Display in Celsius"
                aria-label="Display in Celsius"
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUnit('F')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer min-h-[28px] ${
                  unit === 'F'
                    ? 'bg-[#006D5B] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#111827]'
                }`}
                title="Display in Fahrenheit"
                aria-label="Display in Fahrenheit"
              >
                °F
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchWeather}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#006D5B] dark:hover:text-teal-300 transition-all cursor-pointer border border-slate-300/80 dark:border-slate-700 disabled:opacity-50 min-h-[28px] min-w-[28px] flex items-center justify-center"
              title="Refresh live weather report"
              aria-label="Refresh live weather report"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#006D5B]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center Main Metric Body */}
        {isLoading && !weather ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006D5B]" />
            <span className="text-xs font-semibold">Calibrating Atmospheric Sensors...</span>
          </div>
        ) : weather ? (
          <div className="pt-2.5 sm:pt-3 space-y-3">
            {/* Primary Row: 3D Sculpture + Large Scaled Temperature + Condition */}
            <div className="flex items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {render3DWeatherSculpture(weather.conditionCategory, weather.isDay)}

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-baseline space-x-1.5 flex-wrap">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A2540] dark:text-white leading-none">
                      {displayTemp(weather.temperature)}°{unit}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                      Feels {displayTemp(weather.apparentTemperature)}°
                    </span>
                  </div>

                  <div className="font-bold text-xs sm:text-sm lg:text-base text-[#006D5B] dark:text-teal-300 leading-tight truncate">
                    {weather.conditionLabel}
                  </div>

                  <div className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                    <span>H: {displayTemp(weather.tempMax)}°</span>
                    <span>•</span>
                    <span>L: {displayTemp(weather.tempMin)}°</span>
                  </div>
                </div>
              </div>

              {/* Quick Diagnostic Pill */}
              <div className="flex flex-col items-end text-right space-y-1 shrink-0">
                {weather.isDay ? (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF3C7] dark:bg-amber-950/70 text-[#B45309] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-800">
                    <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400" />
                    <span>UV {weather.uvIndex}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <MoonStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 fill-indigo-300" />
                    <span>Night Sky</span>
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Rain: {weather.precipitationChance}%
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid (3 Key Indicators) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
              <div className="p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 sm:space-x-2">
                <Droplets className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <div className="leading-none truncate">
                  <span className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium">Humidity</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">{weather.humidity}%</span>
                </div>
              </div>

              <div className="p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 sm:space-x-2">
                <Wind className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <div className="leading-none truncate">
                  <span className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium">Wind</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">{weather.windSpeed} km/h</span>
                </div>
              </div>

              <div className="p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 sm:space-x-2">
                <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="leading-none truncate">
                  <span className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium">Pressure</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">{weather.pressure} hPa</span>
                </div>
              </div>
            </div>

            {/* Expandable 3D Civic Atmospheric Details Trigger */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full pt-2 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#006D5B] dark:text-teal-300 hover:text-[#0A2540] dark:hover:text-white transition-colors cursor-pointer border-t border-slate-200/80 dark:border-slate-700/80 min-h-[32px]"
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{isExpanded ? 'Collapse Forecast' : 'View Hourly & 3-Day Forecast'}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable Forecast Drawer */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-2.5 pt-1.5 overflow-hidden"
                >
                  {/* Civic Operational Advisory Note */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-900 dark:text-teal-100 flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#006D5B] dark:text-teal-300 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[#006D5B] dark:text-teal-200">Civic Advisory:</span>
                      <p className="leading-relaxed text-[11px]">{weather.civicAdvisory}</p>
                    </div>
                  </div>

                  {/* Hourly Temperature Cards */}
                  <div>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Next 6 Hours</span>
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {weather.hourly.map((h, i) => (
                        <div
                          key={i}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-0.5"
                        >
                          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400">{h.time}</span>
                          <span className="block text-xs font-black text-[#0A2540] dark:text-white">
                            {displayTemp(h.temp)}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-Day Outlook Cards */}
                  <div>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>3-Day Trend</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {weather.daily.map((d, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between text-xs"
                        >
                          <span className="font-bold text-[#111827] dark:text-white text-[11px] sm:text-xs">{d.day}</span>
                          <div className="flex items-center justify-between pt-1 font-bold text-xs">
                            <span className="text-[#006D5B] dark:text-teal-300">{displayTemp(d.max)}°</span>
                            <span className="text-slate-400">{displayTemp(d.min)}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-right text-slate-400 dark:text-slate-500 font-mono pt-0.5">
                    Sync: {weather.lastUpdated}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};
