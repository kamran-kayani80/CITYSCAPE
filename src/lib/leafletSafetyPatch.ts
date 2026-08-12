import L from 'leaflet';

/**
 * Global safety patch for Leaflet LatLng constructor and factory.
 * Prevents "Uncaught Error: Invalid LatLng object: (NaN, NaN)" from ever crashing the application.
 */
if (typeof window !== 'undefined' && typeof L !== 'undefined') {
  const OriginalLatLng = L.LatLng;

  // Safe LatLng constructor function that guarantees valid numbers without throwing
  function SafeLatLng(this: any, a: any, b?: any, c?: any) {
    let lat: number = 37.7749;
    let lng: number = -122.4194;
    let alt: number | undefined = undefined;

    if (a !== null && a !== undefined) {
      if (typeof a === 'number' || typeof a === 'string') {
        const pLat = Number(a);
        const pLng = Number(b);
        if (!isNaN(pLat) && isFinite(pLat)) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng)) lng = pLng;
        if (c !== undefined && !isNaN(Number(c))) alt = Number(c);
      } else if (Array.isArray(a)) {
        const pLat = Number(a[0]);
        const pLng = Number(a[1]);
        if (!isNaN(pLat) && isFinite(pLat)) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng)) lng = pLng;
        if (a[2] !== undefined && !isNaN(Number(a[2]))) alt = Number(a[2]);
      } else if (typeof a === 'object') {
        const rawLat = a.lat ?? a.latitude;
        const rawLng = a.lng ?? a.lon ?? a.longitude;
        const pLat = Number(rawLat);
        const pLng = Number(rawLng);
        if (!isNaN(pLat) && isFinite(pLat)) lat = pLat;
        if (!isNaN(pLng) && isFinite(pLng)) lng = pLng;
        if (a.alt !== undefined && !isNaN(Number(a.alt))) alt = Number(a.alt);
      }
    }

    // Safety fallback bounds validation
    if (isNaN(lat) || !isFinite(lat) || Math.abs(lat) > 90) lat = 37.7749;
    if (isNaN(lng) || !isFinite(lng) || Math.abs(lng) > 180) lng = -122.4194;

    this.lat = lat;
    this.lng = lng;
    if (alt !== undefined) {
      this.alt = alt;
    }
    return this;
  }

  // Preserve prototype chain and methods (distanceTo, equals, wrap, toBounds, etc.)
  if (OriginalLatLng && OriginalLatLng.prototype) {
    SafeLatLng.prototype = OriginalLatLng.prototype;
  }
  (L as any).LatLng = SafeLatLng;

  // Safe L.latLng factory function
  (L as any).latLng = function (a: any, b?: any, c?: any) {
    if (a && typeof a === 'object' && ('lat' in a || 'latitude' in a)) {
      if (a instanceof SafeLatLng || (OriginalLatLng && a instanceof OriginalLatLng)) {
        const obj = a as any;
        if (isNaN(obj.lat) || isNaN(obj.lng) || !isFinite(obj.lat) || !isFinite(obj.lng)) {
          obj.lat = isNaN(obj.lat) || !isFinite(obj.lat) ? 37.7749 : obj.lat;
          obj.lng = isNaN(obj.lng) || !isFinite(obj.lng) ? -122.4194 : obj.lng;
        }
        return obj;
      }
    }
    return new (SafeLatLng as any)(a, b, c);
  };
}

export default L;
