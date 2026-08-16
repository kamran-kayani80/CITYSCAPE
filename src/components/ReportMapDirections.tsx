import React, { useState } from 'react';
import { MapPin, Copy, Check, Compass, ExternalLink, Car, Footprints } from 'lucide-react';
import { Report } from '../types';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';

// Google Maps Brand Icon
export const GoogleMapsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      fill="#EA4335"
    />
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 10.5 5.5 12 6.3 13.3L12 22V11.5L12 2Z"
      fill="#4285F4"
      opacity="0.35"
    />
    <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
    <circle cx="12" cy="9" r="1.5" fill="#4285F4" />
  </svg>
);

// Waze Brand Icon
export const WazeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M12 3C6.48 3 2 7.03 2 12C2 14.82 3.42 17.32 5.65 18.91C5.46 19.64 5.09 20.65 4.3 21.41C4.12 21.58 4.22 21.88 4.46 21.91C5.69 22.06 7.15 21.75 8.35 20.93C9.48 21.32 10.71 21.5 12 21.5C17.52 21.5 22 17.47 22 12.5C22 7.53 17.52 3 12 3Z"
      fill="#33CCFF"
    />
    <circle cx="8.5" cy="10.5" r="1.5" fill="#0F172A" />
    <circle cx="15.5" cy="10.5" r="1.5" fill="#0F172A" />
    <path
      d="M9 14.5C10 15.5 11 16 12 16C13 16 14 15.5 15 14.5"
      stroke="#0F172A"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <circle cx="7" cy="19.5" r="1.5" fill="#0F172A" />
    <circle cx="17" cy="19.5" r="1.5" fill="#0F172A" />
  </svg>
);

// Apple Maps Brand Icon
export const AppleMapsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#007AFF" />
    <path
      d="M12 4.5L15.5 12L12 10.8L8.5 12L12 4.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M12 19.5L15.5 12L12 13.2L8.5 12L12 19.5Z"
      fill="#FF3B30"
    />
    <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
  </svg>
);

interface ReportMapDirectionsProps {
  report: Report;
  variant?: 'compact' | 'full' | 'button-only';
  className?: string;
}

export const ReportMapDirections: React.FC<ReportMapDirectionsProps> = ({
  report,
  variant = 'full',
  className = '',
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const { userCoords } = useUserLocation();

  const rawLat = Number(report.latitude);
  const rawLng = Number(report.longitude);
  const lat = !isNaN(rawLat) && isFinite(rawLat) ? rawLat : 33.5970;
  const lng = !isNaN(rawLng) && isFinite(rawLng) ? rawLng : 73.0449;

  // Calculate Distance & Travel Estimates
  let distanceKm: number | null = null;
  let distanceFormatted: string | null = null;
  let driveMinutes: number | null = null;
  let walkMinutes: number | null = null;

  if (userCoords && !isNaN(userCoords.latitude) && !isNaN(userCoords.longitude)) {
    distanceKm = calculateDistanceKm(userCoords.latitude, userCoords.longitude, lat, lng);
    distanceFormatted = formatDistanceTag(distanceKm);
    
    // Approx driving speed: ~30 km/h urban city average (~2 mins per km + 2 min buffer)
    driveMinutes = Math.max(1, Math.round((distanceKm / 30) * 60));
    // Approx walking speed: ~4.8 km/h (~12.5 mins per km)
    walkMinutes = Math.max(1, Math.round((distanceKm / 4.8) * 60));
  }

  // Navigation URLs
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${lat},${lng}`;

  const handleCopyCoords = (e: React.MouseEvent) => {
    e.stopPropagation();
    const coordString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  if (variant === 'button-only') {
    return (
      <div
        className={`grid grid-cols-3 items-center bg-slate-100 dark:bg-[#071B2F] p-1 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs gap-1 w-full sm:w-auto ${className}`}
        role="group"
        aria-label="Directions and Maps Navigation"
      >
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#006D5B] dark:bg-[#0A2540] dark:hover:bg-[#006D5B] text-[#051F20] hover:text-white dark:text-slate-100 dark:hover:text-white font-bold text-xs transition-all cursor-pointer border border-[#CBD5E1] dark:border-slate-700 min-h-[34px] sm:min-h-[36px] w-full shadow-xs active:scale-95 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#006D5B]"
          title="Open in Google Maps"
          aria-label="Open in Google Maps"
        >
          <GoogleMapsIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-none font-bold truncate">Maps</span>
        </a>

        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#0284C7] dark:bg-[#0A2540] dark:hover:bg-[#0284C7] text-[#051F20] hover:text-white dark:text-slate-100 dark:hover:text-white font-bold text-xs transition-all cursor-pointer border border-[#CBD5E1] dark:border-slate-700 min-h-[34px] sm:min-h-[36px] w-full shadow-xs active:scale-95 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          title="Open in Waze"
          aria-label="Open in Waze"
        >
          <WazeIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-none font-bold truncate">Waze</span>
        </a>

        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#0A2540] dark:bg-[#0A2540] dark:hover:bg-slate-800 text-[#051F20] hover:text-white dark:text-slate-100 dark:hover:text-white font-bold text-xs transition-all cursor-pointer border border-[#CBD5E1] dark:border-slate-700 min-h-[34px] sm:min-h-[36px] w-full shadow-xs active:scale-95 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
          title="Open in Apple Maps"
          aria-label="Open in Apple Maps"
        >
          <AppleMapsIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-none font-bold truncate">Apple</span>
        </a>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 font-['Montserrat'] text-xs space-y-3 shadow-sm ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[#111827] dark:text-white font-bold truncate">
            <MapPin className="w-4 h-4 text-[#006D5B] dark:text-teal-300 shrink-0" />
            <span className="truncate">{report.addressText}</span>
          </div>

          {distanceFormatted && (
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 border border-[#006D5B]/30 shrink-0">
              {distanceFormatted}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 border-t-1.5 border-[#CBD5E1] dark:border-slate-800">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Google Maps"
            aria-label="Google Maps"
            className="py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-[#006D5B] hover:text-white dark:hover:bg-[#006D5B] text-[#111827] dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm active:scale-98 min-h-[48px]"
          >
            <GoogleMapsIcon className="w-5 h-5 shrink-0" />
            <span className="truncate">Google Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Waze"
            aria-label="Waze"
            className="py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-[#0284C7] hover:text-white dark:hover:bg-[#0284C7] text-[#111827] dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm active:scale-98 min-h-[48px]"
          >
            <WazeIcon className="w-5 h-5 shrink-0" />
            <span className="truncate">Waze</span>
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Apple Maps"
            aria-label="Apple Maps"
            className="py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-[#0A2540] hover:text-white dark:hover:bg-slate-800 text-[#111827] dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm active:scale-98 min-h-[48px]"
          >
            <AppleMapsIcon className="w-5 h-5 shrink-0" />
            <span className="truncate">Apple Maps</span>
          </a>

          <button
            onClick={handleCopyCoords}
            className="col-span-3 sm:col-span-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#111827] dark:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[48px] border-1.5 border-[#CBD5E1] dark:border-slate-700"
            title="Copy GPS Coordinates"
            aria-label="Copy GPS Coordinates"
          >
            {copiedCoords ? (
              <Check className="w-4 h-4 text-[#006D5B] shrink-0" />
            ) : (
              <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
            )}
            <span className="text-xs font-mono font-bold">{copiedCoords ? 'Copied' : 'GPS'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Full Variant for Modal / Municipal Work Order Details
  return (
    <div className={`p-6 bg-[#0A2540] text-white rounded-xl border-1.5 border-[#006D5B] shadow-xl space-y-4 font-['Montserrat'] ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#006D5B]/40">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-[#006D5B] text-white flex items-center justify-center font-bold shadow-md shrink-0 border border-teal-300/30">
            <GoogleMapsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Field Crew Route & Directions
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Turn-by-turn navigation options for field crews and residents
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyCoords}
          className={`self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border min-h-[48px] ${
            copiedCoords
              ? 'bg-[#006D5B] text-white border-teal-400'
              : 'bg-[#071B2F] text-slate-200 border-slate-700 hover:bg-slate-800'
          }`}
          title="Copy exact GPS Coordinates"
          aria-label="Copy exact GPS Coordinates"
        >
          {copiedCoords ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>COPIED COORDS</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>{lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
            </>
          )}
        </button>
      </div>

      {/* Address & Travel Estimates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-3 p-3.5 bg-white/10 rounded-2xl border border-white/10 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#CCFF00] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-200">
              Reported Location
            </span>
            <p className="text-xs font-bold text-white leading-snug">{report.addressText}</p>
            {report.wardZone && (
              <p className="text-[10px] text-[#CCFF00] font-mono font-extrabold mt-0.5">
                Ward Zone: {report.wardZone}
              </p>
            )}
          </div>
        </div>

        {distanceFormatted && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Distance</span>
              <p className="text-xs font-black text-[#CCFF00] font-mono">{distanceFormatted}</p>
            </div>
          </div>
        )}

        {driveMinutes !== null && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-2.5">
            <Car className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Est. Driving</span>
              <p className="text-xs font-black text-amber-300 font-mono">~{driveMinutes} min drive</p>
            </div>
          </div>
        )}

        {walkMinutes !== null && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-2.5">
            <Footprints className="w-5 h-5 text-cyan-300 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Est. Walking</span>
              <p className="text-xs font-black text-cyan-300 font-mono">~{walkMinutes} min walk</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Google Maps"
          aria-label="Google Maps"
          className="py-3 px-4 bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-98 min-h-[48px]"
        >
          <GoogleMapsIcon className="w-5 h-5 shrink-0" />
          <span>Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-auto" />
        </a>

        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Waze"
          aria-label="Waze"
          className="py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-98 min-h-[48px]"
        >
          <WazeIcon className="w-5 h-5 shrink-0" />
          <span>Waze</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-auto" />
        </a>

        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Apple Maps"
          aria-label="Apple Maps"
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md border border-slate-700 hover:scale-[1.02] active:scale-98 min-h-[48px]"
        >
          <AppleMapsIcon className="w-5 h-5 shrink-0" />
          <span>Apple Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-auto" />
        </a>
      </div>
    </div>
  );
};

