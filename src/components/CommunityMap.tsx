import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Locate, RotateCcw, MapPin, Sparkles, Navigation, Map as MapIcon, Globe, Flame, Layers } from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG } from '../lib/constants';
import { formatTimeAgo } from '../lib/utils';

export type MapLayerMode = 'street' | 'satellite' | 'heatmap';

interface CommunityMapProps {
  reports: Report[];
  selectedReportId?: string | null;
  onSelectReport: (report: Report) => void;
  onUpvoteReport: (reportId: string, e: React.MouseEvent) => void;
  // Pin location selection mode for new reports
  isPinningLocation?: boolean;
  pinnedLocation?: { lat: number; lng: number } | null;
  onPinLocationChange?: (lat: number, lng: number) => void;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onUpvoteReport,
  isPinningLocation = false,
  pinnedLocation,
  onPinLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const userLocMarkerRef = useRef<L.Marker | null>(null);

  const [mapMode, setMapMode] = useState<MapLayerMode>('street');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: San Francisco center
    const defaultLat = 37.7749;
    const defaultLng = -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      zoomControl: false,
    });

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create Layer Groups
    const heatmapLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    heatmapLayerRef.current = heatmapLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Global map click handler when in location picking mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isPinningLocation && onPinLocationChange) {
        onPinLocationChange(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map tile layer based on active mapMode (street | satellite | heatmap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CITYSCAPE';
    let maxZoom = 19;

    if (mapMode === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEROGRID, IGN, IGP, UPR-EGP, and GIS User Community';
      maxZoom = 18;
    } else if (mapMode === 'heatmap') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
      maxZoom = 19;
    }

    const newTileLayer = L.tileLayer(url, { maxZoom, attribution }).addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapMode]);

  // Render heat-map circles when in heat-map mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heatLayer = heatmapLayerRef.current;
    if (!map || !heatLayer) return;

    heatLayer.clearLayers();

    if (mapMode === 'heatmap') {
      reports.forEach((report) => {
        const lat = Number(report.latitude);
        const lng = Number(report.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const upvotes = typeof report.upvotesCount === 'number' && !isNaN(report.upvotesCount)
          ? report.upvotesCount
          : typeof (report as any).upvotes === 'number' && !isNaN((report as any).upvotes)
          ? (report as any).upvotes
          : 0;

        const baseRadius = report.severity === 'CRITICAL' ? 240 : report.severity === 'HIGH' ? 180 : 120;
        const upvoteBoost = Math.min(upvotes * 15, 150);
        const totalRadius = Number(baseRadius + upvoteBoost);

        if (isNaN(totalRadius) || totalRadius <= 0) return;

        const color = report.status === 'RESOLVED'
          ? '#10b981'
          : report.severity === 'CRITICAL'
          ? '#ff2a5f'
          : report.severity === 'HIGH'
          ? '#f59e0b'
          : '#06b6d4';

        // Outer radial halo
        const heatCircle = L.circle([lat, lng], {
          radius: totalRadius,
          stroke: false,
          fillColor: color,
          fillOpacity: 0.3,
        });

        // Mid-intensity core
        const innerCircle = L.circle([lat, lng], {
          radius: totalRadius * 0.45,
          stroke: false,
          fillColor: color,
          fillOpacity: 0.6,
        });

        // Hotspot center point
        const coreCircle = L.circle([lat, lng], {
          radius: totalRadius * 0.15,
          color: '#ffffff',
          weight: 1.5,
          fillColor: '#ffffff',
          fillOpacity: 0.9,
        });

        heatCircle.addTo(heatLayer);
        innerCircle.addTo(heatLayer);
        coreCircle.addTo(heatLayer);
      });
    }
  }, [reports, mapMode]);

  // Update report markers whenever reports array or selected report changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (isPinningLocation) return; // Hide report pins if actively picking pin location

    reports.forEach((report) => {
      const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
      const isSelected = report.id === selectedReportId;
      const isEmergency = report.category === 'EMERGENCY';

      // Custom HTML Pin Marker with status color and pin tail
      const iconHtml = `
        <div class="relative group cursor-pointer ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'} transition-all duration-200">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 ${isEmergency ? 'border-yellow-300 bg-red-600 ring-4 ring-red-500/50 animate-pulse' : 'border-white'}" style="${isEmergency ? '' : `background-color: ${statusConf.pinHex}`}">
            ${
              isEmergency
                ? `<svg class="w-4 h-4 text-yellow-300 fill-current animate-bounce" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
                : `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
            }
          </div>
          ${
            isEmergency
              ? `<div class="absolute -inset-2 rounded-full bg-red-600/40 animate-ping"></div>`
              : isSelected
              ? `<div class="absolute -inset-1 rounded-full bg-[#008080]/40 animate-ping"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      // Build popup content HTML
      const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
      const popupHtml = `
        <div class="w-64 p-3.5 space-y-2.5 bg-[#f4faf9] text-[#1A1A1A] font-sans">
          ${
            isEmergency
              ? `<div class="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-between shadow-xs">
                  <span>🚨 EMERGENCY ALERT</span>
                  <span>PRIORITY 1</span>
                </div>`
              : ''
          }
          <div class="relative h-28 w-full rounded-xl overflow-hidden bg-[#008080]/10">
            <img src="${report.imageUrls[0]}" alt="${report.title}" class="w-full h-full object-cover"/>
            <span class="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider text-white shadow-xs" style="background-color: ${statusConf.pinHex}">
              ${statusConf.label}
            </span>
          </div>

          <div>
            <span class="text-[10px] font-black text-[#008080] uppercase tracking-wider">${catConf.label}</span>
            <h4 class="font-heading font-black text-sm text-[#1c1a3b] line-clamp-1 leading-snug">${report.title}</h4>
            <p class="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">${report.addressText}</p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/80 text-xs gap-1.5">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-[#008080] text-[#CCFF00] font-black rounded-xl text-[10px] flex items-center gap-1 hover:bg-[#006666] shadow-xs">
              🧭 Route
            </a>
            <button id="popup-btn-${report.id}" class="btn-primary-designer px-3 py-1 rounded-xl text-xs cursor-pointer">
              View →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('click', () => {
        onSelectReport(report);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${report.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            onSelectReport(report);
          });
        }
      });

      marker.addTo(layer);
    });

    // If report is selected, pan map to its coordinates
    if (selectedReportId) {
      const selected = reports.find((r) => r.id === selectedReportId);
      if (selected) {
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.8 });
      }
    }
  }, [reports, selectedReportId, isPinningLocation]);

  // Handle active pinning location marker for new reports modal
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isPinningLocation && pinnedLocation) {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.setLatLng([pinnedLocation.lat, pinnedLocation.lng]);
      } else {
        const pinIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-10 h-10 rounded-full bg-[#008080] text-[#CCFF00] flex items-center justify-center shadow-xl border-2 border-white pulse-ring">
                <svg class="w-6 h-6 fill-current animate-bounce" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
          `,
          className: 'pin-picker-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const marker = L.marker([pinnedLocation.lat, pinnedLocation.lng], {
          icon: pinIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          if (onPinLocationChange) {
            onPinLocationChange(newPos.lat, newPos.lng);
          }
        });

        pinMarkerRef.current = marker;
      }

      map.flyTo([pinnedLocation.lat, pinnedLocation.lng], 16, { duration: 0.5 });
    } else {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }
    }
  }, [isPinningLocation, pinnedLocation]);

  // "Locate Me" GPS trigger
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 16, { duration: 1 });

          // Add user teal pulsing dot
          if (userLocMarkerRef.current) {
            userLocMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              html: `
                <div class="w-6 h-6 rounded-full bg-[#008080] border-2 border-white shadow-lg pulse-ring"></div>
              `,
              className: 'user-gps-dot',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });
            userLocMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          }

          if (isPinningLocation && onPinLocationChange) {
            onPinLocationChange(latitude, longitude);
          }
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not determine your GPS location. Please select location manually on the map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Reset Map View to city bounds
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([37.7749, -122.4194], 13, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner font-['Montserrat']">
      {/* Leaflet map container element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-1" />

      {/* Layer Control Toggle (Top Left Overlay) */}
      {!isPinningLocation && (
        <div className="absolute top-4 left-4 z-20 flex items-center p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/80 dark:border-slate-800">
          <button
            onClick={() => setMapMode('street')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-black transition-all cursor-pointer ${
              mapMode === 'street'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#008080]'
            }`}
            title="Street Vector Map"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Street</span>
          </button>

          <button
            onClick={() => setMapMode('satellite')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-black transition-all cursor-pointer ${
              mapMode === 'satellite'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#008080]'
            }`}
            title="Satellite Aerial View"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Satellite</span>
          </button>

          <button
            onClick={() => setMapMode('heatmap')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-black transition-all cursor-pointer ${
              mapMode === 'heatmap'
                ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-red-500'
            }`}
            title="Infrastructure Density Heat Map"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="hidden sm:inline">Heat Map</span>
          </button>
        </div>
      )}

      {/* Pinning Banner Overlay */}
      {isPinningLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#003333] rounded-2xl px-5 py-3 shadow-xl flex items-center space-x-2.5 text-xs font-bold border border-[#008080]/30">
          <Navigation className="w-4 h-4 text-[#CCFF00] animate-spin" />
          <span className="text-white font-medium">Click on the map or drag the pin to set issue location</span>
        </div>
      )}

      {/* Floating Map Controls Overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          title="Center on My GPS Location"
          className="btn-soft-tactile p-3 text-[#008080] rounded-2xl cursor-pointer flex items-center justify-center active:scale-95 bg-white dark:bg-slate-800 shadow-md"
        >
          <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#008080]' : ''}`} />
        </button>

        <button
          onClick={handleResetView}
          title="Reset Map View"
          className="btn-soft-tactile p-3 text-[#008080] rounded-2xl cursor-pointer flex items-center justify-center active:scale-95 bg-white dark:bg-slate-800 shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      {!isPinningLocation && (
        <>
          {mapMode === 'heatmap' ? (
            <div className="absolute bottom-6 left-6 z-20 hidden md:block p-3.5 bg-[#003333] rounded-2xl border border-[#008080]/30 shadow-2xl w-64">
              <div className="flex items-center space-x-2 text-xs font-['Montserrat'] font-black text-white mb-2">
                <Flame className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" />
                <span>Hazard Density Heat Map</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 mb-2 border border-white/20"></div>
              <div className="flex justify-between text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">
                <span>Low</span>
                <span>Moderate</span>
                <span>Critical Hotspot</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-6 left-6 z-20 hidden md:block p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg w-60">
              <h4 className="text-[10px] font-['Montserrat'] font-black uppercase tracking-widest text-[#008080] mb-2.5">Status Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-[#1A1A1A] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-xs"></div>
                  <span>Open (Priority Hazard)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1A1A1A] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-xs"></div>
                  <span>Work in Progress</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1A1A1A] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-xs"></div>
                  <span>Resolved / Fixed</span>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Floating Badge */}
          <div className="absolute bottom-6 right-6 z-20 bg-[#003333] p-4 flex items-center gap-5 border border-[#008080]/30 rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="text-2xl font-['Montserrat'] font-black text-white font-mono">
                {reports.filter((r) => r.status === 'RESOLVED').length}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-black">Fixed</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-['Montserrat'] font-black text-[#CCFF00] font-mono">{reports.length}</div>
              <div className="text-[9px] uppercase tracking-wider text-teal-200 font-black">Total Mapped</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
