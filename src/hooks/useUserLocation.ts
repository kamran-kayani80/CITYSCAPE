import { useState, useEffect } from 'react';
import { UserCoordinates } from '../lib/geoUtils';

export function useUserLocation() {
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude);
        const lng = Number(pos.coords.longitude);
        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
          setUserCoords({
            latitude: lat,
            longitude: lng,
          });
          setHasPermission(true);
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation acquisition error:', err.message);
        if (err.code === err.PERMISSION_DENIED) {
          setHasPermission(false);
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setHasPermission(false);
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            setHasPermission(true);
            requestLocation();
          } else if (permissionStatus.state === 'prompt') {
            // Attempt request if prompt
            requestLocation();
          } else {
            setHasPermission(false);
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setHasPermission(true);
              requestLocation();
            } else if (permissionStatus.state === 'denied') {
              setHasPermission(false);
              setUserCoords(null);
            }
          };
        })
        .catch(() => {
          requestLocation();
        });
    } else {
      requestLocation();
    }
  }, []);

  return { userCoords, isLocating, hasPermission, requestLocation };
}
