import React, { useState } from 'react';
import { Navigation, MapPin, Copy, Check, Compass, ExternalLink, Car, Footprints, ShieldCheck } from 'lucide-react';
import { Report } from '../types';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';

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

  const lat = report.latitude;
  const lng = report.longitude;

  // Calculate Distance & Travel Estimates
  let distanceKm: number | null = null;
  let distanceFormatted: string | null = null;
  let driveMinutes: number | null = null;
  let walkMinutes: number | null = null;

  if (userCoords && lat && lng) {
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
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-black bg-[#008080] hover:bg-[#006666] text-[#CCFF00] shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
        title="Open Google Maps turn-by-turn directions"
      >
        <Navigation className="w-3.5 h-3.5 text-[#CCFF00]" />
        <span>Directions</span>
        <ExternalLink className="w-3 h-3 opacity-70" />
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-3 bg-teal-950/20 dark:bg-slate-800/80 rounded-2xl border border-[#008080]/30 font-['Montserrat'] text-xs space-y-2 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 font-bold truncate">
            <MapPin className="w-3.5 h-3.5 text-[#008080] shrink-0" />
            <span className="truncate">{report.addressText}</span>
          </div>

          {distanceFormatted && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#008080] text-[#CCFF00] shrink-0">
              {distanceFormatted}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-1.5 px-2 bg-[#008080] hover:bg-[#006666] text-white rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <Navigation className="w-3 h-3 text-[#CCFF00]" />
            <span>Google Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Navigate with Waze"
          >
            <Compass className="w-3 h-3" />
            <span>Waze</span>
          </a>

          <button
            onClick={handleCopyCoords}
            className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
            title="Copy GPS Coordinates"
          >
            {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  // Full Variant for Modal / Municipal Work Order Details
  return (
    <div className={`p-4 bg-gradient-to-br from-[#003333] via-[#004d4d] to-slate-900 text-white rounded-3xl border border-[#008080]/60 shadow-xl space-y-4 font-['Montserrat'] ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#008080]/40">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-2xl bg-[#CCFF00] text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Navigation className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#CCFF00]">
              Field Crew Route & Directions
            </h3>
            <p className="text-[11px] text-teal-100/90 font-medium">
              Turn-by-turn navigation for public works crew dispatch
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyCoords}
          className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            copiedCoords
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-white/10 text-teal-100 hover:bg-white/20 border-white/20'
          }`}
        >
          {copiedCoords ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>GPS Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
            </>
          )}
        </button>
      </div>

      {/* Address & Travel Estimates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-3 p-3 bg-white/10 rounded-2xl border border-white/10 flex items-start gap-2.5">
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
            <Compass className="w-5 h-5 text-emerald-300" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Distance</span>
              <p className="text-xs font-black text-[#CCFF00] font-mono">{distanceFormatted}</p>
            </div>
          </div>
        )}

        {driveMinutes !== null && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-2.5">
            <Car className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Est. Driving</span>
              <p className="text-xs font-black text-amber-300 font-mono">~{driveMinutes} min drive</p>
            </div>
          </div>
        )}

        {walkMinutes !== null && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-2.5">
            <Footprints className="w-5 h-5 text-cyan-300" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">Est. Walking</span>
              <p className="text-xs font-black text-cyan-300 font-mono">~{walkMinutes} min walk</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>Launch Google Maps Route</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
        >
          <Compass className="w-4 h-4" />
          <span>Open in Waze</span>
        </a>

        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-slate-700 active:scale-98"
        >
          <MapPin className="w-4 h-4 text-slate-300" />
          <span>Apple Maps</span>
        </a>
      </div>
    </div>
  );
};
