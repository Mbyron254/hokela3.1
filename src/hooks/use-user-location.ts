import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { MAPBOX_API } from 'src/config-global';

const MAX_ACCURACY = 40000;

const ACCEPTED_ACCURACY = 500;

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  refetch: () => void; // Add refetch to the state
}

export const fetchPlaceName = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
      { params: { access_token: MAPBOX_API } }
    );
    return response.data.features[0]?.place_name || 'Unknown location';
  } catch (error) {
    console.error('Error fetching place name:', error);
    return 'Unknown location';
  }
};

const useUserLocation = (): LocationState => {
  const [location, setLocation] = useState<Omit<LocationState, 'refetch'>>({
    latitude: null,
    longitude: null,
    placeName: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchLocation = useCallback(() => {
    if (!navigator.onLine) {
      setLocation({
        latitude: null,
        longitude: null,
        placeName: null,
        accuracy: null,
        error: 'Device is offline',
        loading: false,
      });
      enqueueSnackbar('Device is offline. Cannot fetch location.', { variant: 'warning' });
      return;
    }

    const geo = navigator.geolocation;
    if (!geo) {
      setLocation((prevState) => ({
        ...prevState,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      enqueueSnackbar('Geolocation is not supported by this browser.', { variant: 'error' });
      return;
    }

    const successCallback = async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      // const accuracyPercentage =
      //   accuracy > ACCEPTED_ACCURACY ? 0 : (accuracy / ACCEPTED_ACCURACY) * 100;
      // if (accuracy <= MAX_ACCURACY) {
        const placeName = await fetchPlaceName(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          placeName,
          accuracy: 40,
          error: null,
          loading: false,
        });
        enqueueSnackbar(`Location fetched successfully: ${placeName}`, { variant: 'success' });
      // } else {
      //   setLocation((prevState) => ({
      //     ...prevState,
      //     accuracy: accuracyPercentage,
      //     error: 'Location accuracy is too low',
      //     loading: false,
      //   }));
      //   enqueueSnackbar('Location accuracy is too low.', { variant: 'warning' });
      // }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = 'Failed to get user location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Enable location services on your device and try again.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred.';
          break;
      }
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setLocation((prevState) => ({ ...prevState, error: errorMessage, loading: false }));
    };

    geo.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 120000,
      maximumAge: 0,
    });
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { ...location, refetch: fetchLocation };
};

export default useUserLocation;
