export function formatTimeAgo(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatFullDate(isoString: string): string {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Convert image file to compressed base64 string using HTML5 Canvas scaling
export function readFileAsBase64(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, use standard FileReader
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = error => reject(error);

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      } catch (err) {
        // Fallback to original image data URL if canvas fails
        resolve(img.src);
      }
    };

    img.onerror = () => {
      // Fallback
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = err => reject(err);
      fallbackReader.readAsDataURL(file);
    };

    reader.readAsDataURL(file);
  });
}

// In-memory and sessionStorage cache for reverse geocoding to prevent Nominatim 429 Rate Limits
const geocodeCache = new Map<string, { address: string; timestamp: number }>();
let lastNominatimRequestTime = 0;
const MIN_NOMINATIM_INTERVAL_MS = 1100; // Nominatim strictly enforces 1 req/sec max

// Queue mechanism for rate-limiting consecutive reverse geocode requests
let geocodeQueue: Promise<void> = Promise.resolve();

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
    return 'San Francisco, CA';
  }

  // Quantize coordinates to 3 decimal places (~110m resolution) for aggressive caching
  const quantKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;

  // 1. Check in-memory cache
  const cached = geocodeCache.get(quantKey);
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour memory TTL
    return cached.address;
  }

  // 2. Check browser sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`cityscape_geo_${quantKey}`);
      if (stored) {
        geocodeCache.set(quantKey, { address: stored, timestamp: Date.now() });
        return stored;
      }
    } catch {
      // Ignore storage errors
    }
  }

  // Helper to store in cache
  const setCache = (addr: string) => {
    geocodeCache.set(quantKey, { address: addr, timestamp: Date.now() });
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(`cityscape_geo_${quantKey}`, addr);
      }
    } catch {
      // Ignore storage quota
    }
    return addr;
  };

  // 3. Queue the request so we never violate the 1 request/second rule
  return new Promise<string>((resolve) => {
    geocodeQueue = geocodeQueue.then(async () => {
      const now = Date.now();
      const elapsed = now - lastNominatimRequestTime;
      if (elapsed < MIN_NOMINATIM_INTERVAL_MS) {
        await new Promise((r) => setTimeout(r, MIN_NOMINATIM_INTERVAL_MS - elapsed));
      }
      lastNominatimRequestTime = Date.now();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CITYSCAPE-CommunityCivicPlatform/1.0',
              'Accept-Language': 'en',
            },
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (res.status === 429 || res.status === 403) {
          console.warn('[Geocoding] Nominatim rate limit (429/403). Using coordinate fallback.');
          resolve(setCache(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`));
          return;
        }

        if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
        const data = await res.json();
        if (data && data.display_name) {
          const addr = data.address;
          if (addr) {
            const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
            const houseNumber = addr.house_number || '';
            const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
            const state = addr.state || '';
            const parts = [houseNumber, road, city, state].filter(Boolean);
            if (parts.length > 0) {
              resolve(setCache(parts.join(', ')));
              return;
            }
          }
          const shortDisplay = data.display_name.split(',').slice(0, 3).join(', ');
          resolve(setCache(shortDisplay));
          return;
        }
      } catch (err) {
        // Fallback gracefully on rate limit, timeout, or offline
      }

      resolve(setCache(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`));
    });
  });
}
