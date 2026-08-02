import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Locate, RotateCcw, MapPin, Sparkles, Navigation, Map as MapIcon, Globe, Flame, Layers } from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG } from '../lib/constants';
import { formatTimeAgo } from '../lib/utils';

export type MapLayerMode = 'street' | 'satellite' | 'heatmap';

function isValidLatLng(lat: any, lng: any): boolean {
  const nLat = Number(lat);
  const nLng = Number(lng);
  return !isNaN(nLat) && !isNaN(nLng) && isFinite(nLat) && isFinite(nLng) && Math.abs(nLat) <= 90 && Math.abs(nLng) <= 180;
}

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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isGeoTagged, setIsGeoTagged] = useState(false);

  // Initialize Leaflet Map instance & Auto Geo-Tag
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

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
      if (isPinningLocation && onPinLocationChange && e.latlng && isValidLatLng(e.latlng.lat, e.latlng.lng)) {
        onPinLocationChange(e.latlng.lat, e.latlng.lng);
      }
    });

    // AUTOMATIC GEOTAGGING ON INITIALIZATION
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted || mapInstanceRef.current !== map) return;
          const { latitude, longitude, accuracy } = pos.coords;
          if (!isValidLatLng(latitude, longitude)) {
            setIsLocating(false);
            return;
          }

          setUserLocation({ lat: latitude, lng: longitude, accuracy });
          setIsGeoTagged(true);
          setIsLocating(false);

          map.flyTo([latitude, longitude], 15, { duration: 1.2 });

          // Add pulsing user geotag marker & accuracy halo safely
          if (userLocMarkerRef.current && map.hasLayer(userLocMarkerRef.current)) {
            userLocMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="w-7 h-7 rounded-full bg-[#006D5B] border-3 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-[#006D5B]/30 animate-pulse">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#CCFF00]"></div>
                  </div>
                </div>
              `,
              className: 'user-geotag-marker',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
            userLocMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          }

          // Accuracy circle
          if (accuracy && accuracy < 5000) {
            L.circle([latitude, longitude], {
              radius: Math.min(accuracy, 200),
              color: '#006D5B',
              weight: 1.5,
              fillColor: '#006D5B',
              fillOpacity: 0.12,
            }).addTo(map);
          }
        },
        (err) => {
          if (!isMounted) return;
          console.log('Default geotag fallback to city center:', err.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }

    return () => {
      isMounted = false;
      userLocMarkerRef.current = null;
      pinMarkerRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
      heatmapLayerRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map tile layer based on active mapMode (street | satellite | heatmap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
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
      const lat = Number(report.latitude);
      const lng = Number(report.longitude);
      if (!isValidLatLng(lat, lng)) return;

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

      const marker = L.marker([lat, lng], { icon: customIcon });

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

          <div class="flex flex-col gap-2 pt-2 border-t border-slate-200 text-xs">
            <div class="flex items-center gap-1.5">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" title="Google Maps" aria-label="Google Maps" class="flex-1 py-1.5 px-2 bg-[#008080] text-white hover:bg-[#006666] font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 shadow-2xs">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#EA4335"/><circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/></svg>
                Google Maps
              </a>
              <a href="https://waze.com/ul?ll=${lat},${lng}&navigate=yes" target="_blank" rel="noopener noreferrer" title="Waze" aria-label="Waze" class="py-1.5 px-2 bg-sky-500 text-white hover:bg-sky-600 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 shadow-2xs">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C6.48 3 2 7.03 2 12C2 14.82 3.42 17.32 5.65 18.91C5.46 19.64 5.09 20.65 4.3 21.41C4.12 21.58 4.22 21.88 4.46 21.91C5.69 22.06 7.15 21.75 8.35 20.93C9.48 21.32 10.71 21.5 12 21.5C17.52 21.5 22 17.47 22 12.5C22 7.53 17.52 3 12 3Z" fill="#33CCFF"/><circle cx="8.5" cy="10.5" r="1.5" fill="#0F172A"/><circle cx="15.5" cy="10.5" r="1.5" fill="#0F172A"/></svg>
                Waze
              </a>
              <a href="https://maps.apple.com/?daddr=${lat},${lng}" target="_blank" rel="noopener noreferrer" title="Apple Maps" aria-label="Apple Maps" class="py-1.5 px-2 bg-slate-800 text-white hover:bg-slate-700 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 shadow-2xs">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" fill="#007AFF"/><path d="M12 4.5L15.5 12L12 10.8L8.5 12L12 4.5Z" fill="#FFFFFF"/><path d="M12 19.5L15.5 12L12 13.2L8.5 12L12 19.5Z" fill="#FF3B30"/></svg>
                Apple Maps
              </a>
            </div>
            <button id="popup-btn-${report.id}" class="w-full btn-primary-designer py-1.5 rounded-xl text-xs font-extrabold cursor-pointer">
              View Details →
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
      if (selected && isValidLatLng(selected.latitude, selected.longitude)) {
        map.flyTo([Number(selected.latitude), Number(selected.longitude)], 15, { duration: 0.8 });
      }
    }
  }, [reports, selectedReportId, isPinningLocation]);

  // Handle active pinning location marker for new reports modal
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isPinningLocation && pinnedLocation && isValidLatLng(pinnedLocation.lat, pinnedLocation.lng)) {
      const pLat = Number(pinnedLocation.lat);
      const pLng = Number(pinnedLocation.lng);

      if (pinMarkerRef.current && map.hasLayer(pinMarkerRef.current)) {
        pinMarkerRef.current.setLatLng([pLat, pLng]);
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

        const marker = L.marker([pLat, pLng], {
          icon: pinIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          if (onPinLocationChange && isValidLatLng(newPos.lat, newPos.lng)) {
            onPinLocationChange(newPos.lat, newPos.lng);
          }
        });

        pinMarkerRef.current = marker;
      }

      map.flyTo([pLat, pLng], 16, { duration: 0.5 });
    } else {
      if (pinMarkerRef.current && map.hasLayer(pinMarkerRef.current)) {
        pinMarkerRef.current.remove();
      }
      pinMarkerRef.current = null;
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
        if (!isValidLatLng(latitude, longitude)) {
          setIsLocating(false);
          return;
        }

        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 16, { duration: 1 });

          // Add user teal pulsing dot
          if (userLocMarkerRef.current && map.hasLayer(userLocMarkerRef.current)) {
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

      {/* Geotagged Status Badge Overlay */}
      {!isPinningLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-1.5 bg-[#0A2540]/90 backdrop-blur-md rounded-full shadow-lg border border-[#006D5B] text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-[#CCFF00]">
            GEO-TAGGED MAP ACTIVE
          </span>
          {userLocation ? (
            <span className="text-[10px] font-mono text-slate-300 border-l border-white/20 pl-2">
              {userLocation.lat.toFixed(4)}°N, {Math.abs(userLocation.lng).toFixed(4)}°W
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-300 border-l border-white/20 pl-2">
              GPS SENSOR READY
            </span>
          )}
        </div>
      )}

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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#0A2540] rounded-2xl px-5 py-3 shadow-xl flex items-center space-x-2.5 text-xs font-bold border-2 border-[#006D5B]">
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
          className="btn-soft-tactile p-3 text-[#006D5B] rounded-2xl cursor-pointer flex items-center justify-center active:scale-95 bg-white dark:bg-slate-800 shadow-md"
        >
          <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#006D5B]' : ''}`} />
        </button>

        <button
          onClick={handleResetView}
          title="Reset Map View"
          className="btn-soft-tactile p-3 text-[#006D5B] rounded-2xl cursor-pointer flex items-center justify-center active:scale-95 bg-white dark:bg-slate-800 shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      {!isPinningLocation && (
        <>
          {mapMode === 'heatmap' ? (
            <div className="absolute bottom-6 left-6 z-20 hidden md:block p-3.5 bg-[#0A2540] rounded-2xl border-2 border-[#006D5B] shadow-2xl w-64">
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
            <div className="absolute bottom-6 left-6 z-20 hidden md:block p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-lg w-60">
              <h4 className="text-[10px] font-['Montserrat'] font-black uppercase tracking-widest text-[#006D5B] mb-2.5">Status Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-[#111827] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-xs"></div>
                  <span>Open (Priority Hazard)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#111827] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-xs"></div>
                  <span>Work in Progress</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#111827] dark:text-slate-200 font-bold">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-xs"></div>
                  <span>Resolved / Fixed</span>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Floating Badge */}
          <div className="absolute bottom-6 right-6 z-20 bg-[#0A2540] p-4 flex items-center gap-5 border-2 border-[#006D5B] rounded-2xl shadow-xl">
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
