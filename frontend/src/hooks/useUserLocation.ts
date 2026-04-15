import { useEffect, useState } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const FAKE_LOCATION: UserLocation = {
  lat: 9.0225,
  lng: 38.7475,
};

const USE_FAKE_LOCATION = true;

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (USE_FAKE_LOCATION) {
      setLocation(FAKE_LOCATION);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refresh: fetchLocation,
  };
}
