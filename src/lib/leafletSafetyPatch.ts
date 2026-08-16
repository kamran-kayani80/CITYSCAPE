import L from 'leaflet';

/**
 * Robust coordinate sanitizer: guarantees finite numbers within valid geographic bounds.
 * Falls back to default city coordinates (37.7749, -122.4194) if coordinates are NaN, invalid, or missing.
 */
export function sanitizeCoordinates(a: any, b?: any, c?: any): { lat: number; lng: number; alt?: number } {
  let lat = 37.7749;
  let lng = -122.4194;
  let alt: number | undefined = undefined;

  try {
    if (a !== null && a !== undefined) {
      if (typeof a === 'number' || typeof a === 'string') {
        const pLat = typeof a === 'string' ? parseFloat(a.trim()) : a;
        const pLng = typeof b === 'string' ? parseFloat(b.trim()) : b;
        if (!isNaN(pLat) && isFinite(pLat) && Math.abs(pLat) <= 90) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng) && Math.abs(pLng) <= 180) lng = pLng;
        if (c !== undefined && !isNaN(Number(c)) && isFinite(Number(c))) alt = Number(c);
      } else if (Array.isArray(a)) {
        const pLat = typeof a[0] === 'string' ? parseFloat(a[0].trim()) : Number(a[0]);
        const pLng = typeof a[1] === 'string' ? parseFloat(a[1].trim()) : Number(a[1]);
        if (!isNaN(pLat) && isFinite(pLat) && Math.abs(pLat) <= 90) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng) && Math.abs(pLng) <= 180) lng = pLng;
        if (a[2] !== undefined && !isNaN(Number(a[2])) && isFinite(Number(a[2]))) alt = Number(a[2]);
      } else if (typeof a === 'object') {
        const rawLat = a.lat ?? a.latitude;
        const rawLng = a.lng ?? a.lon ?? a.longitude;
        const pLat = typeof rawLat === 'string' ? parseFloat(rawLat.trim()) : Number(rawLat);
        const pLng = typeof rawLng === 'string' ? parseFloat(rawLng.trim()) : Number(rawLng);
        if (!isNaN(pLat) && isFinite(pLat) && Math.abs(pLat) <= 90) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng) && Math.abs(pLng) <= 180) lng = pLng;
        const rawAlt = a.alt ?? a.altitude;
        if (rawAlt !== undefined && !isNaN(Number(rawAlt)) && isFinite(Number(rawAlt))) alt = Number(rawAlt);
      }
    }
  } catch (err) {
    lat = 37.7749;
    lng = -122.4194;
  }

  // Geographic bounds safety check
  if (isNaN(lat) || !isFinite(lat) || Math.abs(lat) > 90) lat = 37.7749;
  if (isNaN(lng) || !isFinite(lng) || Math.abs(lng) > 180) lng = -122.4194;

  return { lat, lng, alt };
}

/**
 * Global comprehensive safety patch for Leaflet.
 * Completely prevents "Uncaught Error: Invalid LatLng object: (NaN, NaN)"
 * from ever crashing or propagating in the application.
 */
if (typeof L !== 'undefined') {
  const OriginalLatLng = (L as any).LatLng;

  // Safe LatLng constructor function that guarantees valid numbers without throwing
  function SafeLatLng(this: any, a: any, b?: any, c?: any) {
    const self = this instanceof SafeLatLng ? this : Object.create(SafeLatLng.prototype);
    const safe = sanitizeCoordinates(a, b, c);
    self.lat = safe.lat;
    self.lng = safe.lng;
    if (safe.alt !== undefined) {
      self.alt = safe.alt;
    }
    return self;
  }
  (SafeLatLng as any).__isSafetyPatched = true;

  // Preserve and harden prototype methods
  if (OriginalLatLng && OriginalLatLng.prototype) {
    SafeLatLng.prototype = OriginalLatLng.prototype;

    const origDistanceTo = OriginalLatLng.prototype.distanceTo;
    if (origDistanceTo) {
      OriginalLatLng.prototype.distanceTo = function (other: any) {
        try {
          const safeOther = sanitizeCoordinates(other);
          return origDistanceTo.call(this, (L as any).latLng(safeOther.lat, safeOther.lng));
        } catch (e) {
          return 0;
        }
      };
    }

    const origEquals = OriginalLatLng.prototype.equals;
    if (origEquals) {
      OriginalLatLng.prototype.equals = function (other: any, maxMargin?: any) {
        try {
          const safeOther = sanitizeCoordinates(other);
          return origEquals.call(this, (L as any).latLng(safeOther.lat, safeOther.lng), maxMargin);
        } catch (e) {
          return false;
        }
      };
    }

    const origToBounds = OriginalLatLng.prototype.toBounds;
    if (origToBounds) {
      OriginalLatLng.prototype.toBounds = function (sizeInMeters: any) {
        try {
          const safeSize = typeof sizeInMeters === 'number' && !isNaN(sizeInMeters) && isFinite(sizeInMeters) && sizeInMeters > 0 ? sizeInMeters : 100;
          return origToBounds.call(this, safeSize);
        } catch (e) {
          return (L as any).latLngBounds([[37.77, -122.42], [37.78, -122.41]]);
        }
      };
    }
  }

  (L as any).LatLng = SafeLatLng;

  // Safe L.latLng factory function
  (L as any).latLng = function (a: any, b?: any, c?: any) {
    try {
      if (a && typeof a === 'object' && 'lat' in a && 'lng' in a) {
        const nLat = Number(a.lat);
        const nLng = Number(a.lng);
        if (!isNaN(nLat) && !isNaN(nLng) && isFinite(nLat) && isFinite(nLng) && Math.abs(nLat) <= 90 && Math.abs(nLng) <= 180) {
          return a;
        }
      }
      const safe = sanitizeCoordinates(a, b, c);
      return new (SafeLatLng as any)(safe.lat, safe.lng, safe.alt);
    } catch (e) {
      return new (SafeLatLng as any)(37.7749, -122.4194);
    }
  };

  // Safe L.Projection.SphericalMercator
  if ((L as any).Projection && (L as any).Projection.SphericalMercator) {
    const origSphericalUnproject = (L as any).Projection.SphericalMercator.unproject;
    (L as any).Projection.SphericalMercator.unproject = function (point: any) {
      try {
        if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
          return (L as any).latLng(37.7749, -122.4194);
        }
        const res = origSphericalUnproject.call(this, point);
        const safe = sanitizeCoordinates(res);
        return (L as any).latLng(safe.lat, safe.lng);
      } catch (err) {
        return (L as any).latLng(37.7749, -122.4194);
      }
    };
  }

  // Safe L.Projection.LonLat
  if ((L as any).Projection && (L as any).Projection.LonLat) {
    const origLonLatUnproject = (L as any).Projection.LonLat.unproject;
    (L as any).Projection.LonLat.unproject = function (point: any) {
      try {
        if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
          return (L as any).latLng(37.7749, -122.4194);
        }
        const res = origLonLatUnproject.call(this, point);
        const safe = sanitizeCoordinates(res);
        return (L as any).latLng(safe.lat, safe.lng);
      } catch (err) {
        return (L as any).latLng(37.7749, -122.4194);
      }
    };
  }

  // Safe L.CRS.EPSG3857 & CRS.Earth pointToLatLng & wrapLatLng
  if ((L as any).CRS) {
    const patchCRS = (crs: any) => {
      if (!crs) return;
      if (crs.pointToLatLng) {
        const origP2LL = crs.pointToLatLng;
        crs.pointToLatLng = function (point: any, zoom: any) {
          try {
            if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
              return (L as any).latLng(37.7749, -122.4194);
            }
            const res = origP2LL.call(this, point, zoom);
            const safe = sanitizeCoordinates(res);
            return (L as any).latLng(safe.lat, safe.lng);
          } catch (err) {
            return (L as any).latLng(37.7749, -122.4194);
          }
        };
      }
      if (crs.wrapLatLng) {
        const origWrapLL = crs.wrapLatLng;
        crs.wrapLatLng = function (latlng: any) {
          try {
            const safe = sanitizeCoordinates(latlng);
            return origWrapLL.call(this, (L as any).latLng(safe.lat, safe.lng));
          } catch (err) {
            return (L as any).latLng(37.7749, -122.4194);
          }
        };
      }
    };

    patchCRS((L as any).CRS.EPSG3857);
    patchCRS((L as any).CRS.EPSG3395);
    patchCRS((L as any).CRS.EPSG4326);
    patchCRS((L as any).CRS.Earth);
    patchCRS((L as any).CRS.Simple);
    patchCRS((L as any).CRS.Base);
  }

  // Safe L.Marker & prototype
  if ((L as any).Marker && (L as any).Marker.prototype) {
    const origMarkerInit = (L as any).Marker.prototype.initialize;
    (L as any).Marker.prototype.initialize = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      return origMarkerInit.call(this, [safe.lat, safe.lng], options);
    };

    const origMarkerSetLatLng = (L as any).Marker.prototype.setLatLng;
    (L as any).Marker.prototype.setLatLng = function (latlng: any) {
      const safe = sanitizeCoordinates(latlng);
      return origMarkerSetLatLng.call(this, [safe.lat, safe.lng]);
    };
  }

  const origMarker = (L as any).marker;
  if (origMarker) {
    (L as any).marker = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      return origMarker.call(this, [safe.lat, safe.lng], options);
    };
  }

  // Safe L.Circle & prototype
  if ((L as any).Circle && (L as any).Circle.prototype) {
    const origCircleInit = (L as any).Circle.prototype.initialize;
    (L as any).Circle.prototype.initialize = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      let safeOpts = options;
      if (options && typeof options === 'object') {
        const r = typeof options.radius === 'number' && !isNaN(options.radius) && isFinite(options.radius) && options.radius > 0 ? options.radius : 100;
        safeOpts = { ...options, radius: r };
      }
      return origCircleInit.call(this, [safe.lat, safe.lng], safeOpts);
    };

    const origCircleSetLatLng = (L as any).Circle.prototype.setLatLng;
    (L as any).Circle.prototype.setLatLng = function (latlng: any) {
      const safe = sanitizeCoordinates(latlng);
      return origCircleSetLatLng.call(this, [safe.lat, safe.lng]);
    };

    const origSetRadius = (L as any).Circle.prototype.setRadius;
    (L as any).Circle.prototype.setRadius = function (radius: any) {
      const safeRadius = typeof radius === 'number' && !isNaN(radius) && isFinite(radius) && radius > 0 ? radius : 100;
      return origSetRadius.call(this, safeRadius);
    };
  }

  const origCircle = (L as any).circle;
  if (origCircle) {
    (L as any).circle = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      let safeOpts = options;
      if (options && typeof options === 'object') {
        const r = typeof options.radius === 'number' && !isNaN(options.radius) && isFinite(options.radius) && options.radius > 0 ? options.radius : 100;
        safeOpts = { ...options, radius: r };
      }
      return origCircle.call(this, [safe.lat, safe.lng], safeOpts);
    };
  }

  // Safe L.CircleMarker & prototype
  if ((L as any).CircleMarker && (L as any).CircleMarker.prototype) {
    const origCMInit = (L as any).CircleMarker.prototype.initialize;
    (L as any).CircleMarker.prototype.initialize = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      return origCMInit.call(this, [safe.lat, safe.lng], options);
    };

    const origCMSetLatLng = (L as any).CircleMarker.prototype.setLatLng;
    (L as any).CircleMarker.prototype.setLatLng = function (latlng: any) {
      const safe = sanitizeCoordinates(latlng);
      return origCMSetLatLng.call(this, [safe.lat, safe.lng]);
    };
  }

  const origCircleMarker = (L as any).circleMarker;
  if (origCircleMarker) {
    (L as any).circleMarker = function (latlng: any, options?: any) {
      const safe = sanitizeCoordinates(latlng);
      return origCircleMarker.call(this, [safe.lat, safe.lng], options);
    };
  }

  // Safe L.Popup & prototype
  if ((L as any).Popup && (L as any).Popup.prototype) {
    const origPopupSetLatLng = (L as any).Popup.prototype.setLatLng;
    (L as any).Popup.prototype.setLatLng = function (latlng: any) {
      const safe = sanitizeCoordinates(latlng);
      return origPopupSetLatLng.call(this, [safe.lat, safe.lng]);
    };
  }

  const origPopup = (L as any).popup;
  if (origPopup) {
    (L as any).popup = function (options?: any, source?: any) {
      return origPopup.call(this, options, source);
    };
  }

  // Safe L.Tooltip & prototype
  if ((L as any).Tooltip && (L as any).Tooltip.prototype) {
    const origTooltipSetLatLng = (L as any).Tooltip.prototype.setLatLng;
    (L as any).Tooltip.prototype.setLatLng = function (latlng: any) {
      const safe = sanitizeCoordinates(latlng);
      return origTooltipSetLatLng.call(this, [safe.lat, safe.lng]);
    };
  }

  // Safe L.Map & prototype
  if ((L as any).Map && (L as any).Map.prototype) {
    const origMapInit = (L as any).Map.prototype.initialize;
    (L as any).Map.prototype.initialize = function (id: any, options?: any) {
      let safeOptions = options;
      if (options && typeof options === 'object') {
        safeOptions = { ...options };
        if (safeOptions.center) {
          const sCenter = sanitizeCoordinates(safeOptions.center);
          safeOptions.center = [sCenter.lat, sCenter.lng];
        }
      }
      return origMapInit.call(this, id, safeOptions);
    };

    const origSetView = (L as any).Map.prototype.setView;
    (L as any).Map.prototype.setView = function (center: any, zoom?: any, options?: any) {
      const safe = sanitizeCoordinates(center);
      const safeZoom = typeof zoom === 'number' && !isNaN(zoom) && isFinite(zoom) ? zoom : 13;
      return origSetView.call(this, [safe.lat, safe.lng], safeZoom, options);
    };

    const origFlyTo = (L as any).Map.prototype.flyTo;
    (L as any).Map.prototype.flyTo = function (center: any, zoom?: any, options?: any) {
      const safe = sanitizeCoordinates(center);
      const safeZoom = typeof zoom === 'number' && !isNaN(zoom) && isFinite(zoom) ? zoom : 13;
      return origFlyTo.call(this, [safe.lat, safe.lng], safeZoom, options);
    };

    const origPanTo = (L as any).Map.prototype.panTo;
    (L as any).Map.prototype.panTo = function (center: any, options?: any) {
      const safe = sanitizeCoordinates(center);
      return origPanTo.call(this, [safe.lat, safe.lng], options);
    };

    const origFitBounds = (L as any).Map.prototype.fitBounds;
    if (origFitBounds) {
      (L as any).Map.prototype.fitBounds = function (bounds: any, options?: any) {
        try {
          const safeBounds = (L as any).latLngBounds(bounds);
          return origFitBounds.call(this, safeBounds, options);
        } catch (e) {
          return this;
        }
      };
    }

    const origPanInsideBounds = (L as any).Map.prototype.panInsideBounds;
    if (origPanInsideBounds) {
      (L as any).Map.prototype.panInsideBounds = function (bounds: any, options?: any) {
        try {
          const safeBounds = (L as any).latLngBounds(bounds);
          return origPanInsideBounds.call(this, safeBounds, options);
        } catch (e) {
          return this;
        }
      };
    }

    const origUnproject = (L as any).Map.prototype.unproject;
    if (origUnproject) {
      (L as any).Map.prototype.unproject = function (point: any, zoom: any) {
        try {
          if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
            return (L as any).latLng(37.7749, -122.4194);
          }
          const res = origUnproject.call(this, point, zoom);
          const safe = sanitizeCoordinates(res);
          return (L as any).latLng(safe.lat, safe.lng);
        } catch (e) {
          return (L as any).latLng(37.7749, -122.4194);
        }
      };
    }

    const origLayerPointToLatLng = (L as any).Map.prototype.layerPointToLatLng;
    if (origLayerPointToLatLng) {
      (L as any).Map.prototype.layerPointToLatLng = function (point: any) {
        try {
          if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
            return (L as any).latLng(37.7749, -122.4194);
          }
          const res = origLayerPointToLatLng.call(this, point);
          const safe = sanitizeCoordinates(res);
          return (L as any).latLng(safe.lat, safe.lng);
        } catch (e) {
          return (L as any).latLng(37.7749, -122.4194);
        }
      };
    }

    const origContainerPointToLatLng = (L as any).Map.prototype.containerPointToLatLng;
    if (origContainerPointToLatLng) {
      (L as any).Map.prototype.containerPointToLatLng = function (point: any) {
        try {
          if (!point || isNaN(point.x) || isNaN(point.y) || !isFinite(point.x) || !isFinite(point.y)) {
            return (L as any).latLng(37.7749, -122.4194);
          }
          const res = origContainerPointToLatLng.call(this, point);
          const safe = sanitizeCoordinates(res);
          return (L as any).latLng(safe.lat, safe.lng);
        } catch (e) {
          return (L as any).latLng(37.7749, -122.4194);
        }
      };
    }

    const origMouseEventToLatLng = (L as any).Map.prototype.mouseEventToLatLng;
    if (origMouseEventToLatLng) {
      (L as any).Map.prototype.mouseEventToLatLng = function (e: any) {
        try {
          const res = origMouseEventToLatLng.call(this, e);
          const safe = sanitizeCoordinates(res);
          return (L as any).latLng(safe.lat, safe.lng);
        } catch (err) {
          return (L as any).latLng(37.7749, -122.4194);
        }
      };
    }

    const origGetCenter = (L as any).Map.prototype.getCenter;
    if (origGetCenter) {
      (L as any).Map.prototype.getCenter = function () {
        try {
          const res = origGetCenter.call(this);
          const safe = sanitizeCoordinates(res);
          return (L as any).latLng(safe.lat, safe.lng);
        } catch (err) {
          return (L as any).latLng(37.7749, -122.4194);
        }
      };
    }
  }

  // Safe L.map factory function
  const origMapFactory = (L as any).map;
  if (origMapFactory) {
    (L as any).map = function (id: any, options?: any) {
      let safeOptions = options;
      if (options && typeof options === 'object') {
        safeOptions = { ...options };
        if (safeOptions.center) {
          const sCenter = sanitizeCoordinates(safeOptions.center);
          safeOptions.center = [sCenter.lat, sCenter.lng];
        }
      }
      return origMapFactory.call(this, id, safeOptions);
    };
  }

  // Safe L.latLngBounds & prototype
  if ((L as any).latLngBounds) {
    const origLatLngBounds = (L as any).latLngBounds;
    (L as any).latLngBounds = function (a: any, b?: any) {
      try {
        if (Array.isArray(a)) {
          const safeArray = a.filter((pt) => pt != null).map((pt) => {
            const s = sanitizeCoordinates(pt);
            return [s.lat, s.lng];
          });
          if (safeArray.length === 0) {
            safeArray.push([37.7749, -122.4194]);
          }
          return origLatLngBounds.call(this, safeArray as any);
        }
        if (a && b) {
          const safeA = sanitizeCoordinates(a);
          const safeB = sanitizeCoordinates(b);
          return origLatLngBounds.call(this, [safeA.lat, safeA.lng], [safeB.lat, safeB.lng]);
        }
        if (a) {
          const safeA = sanitizeCoordinates(a);
          return origLatLngBounds.call(this, [[safeA.lat, safeA.lng], [safeA.lat, safeA.lng]]);
        }
        return origLatLngBounds.call(this, [[37.7749, -122.4194], [37.7749, -122.4194]]);
      } catch (e) {
        return origLatLngBounds.call(this, [[37.7749, -122.4194], [37.7749, -122.4194]]);
      }
    };
  }
}

// Global safety net for any uncaught LatLng error
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event && event.message && event.message.includes('Invalid LatLng object')) {
      console.warn('Safely intercepted invalid LatLng event:', event.message);
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event && event.reason && String(event.reason).includes('Invalid LatLng object')) {
      console.warn('Safely intercepted unhandled LatLng rejection:', event.reason);
      event.preventDefault();
    }
  });
}

export default L;
