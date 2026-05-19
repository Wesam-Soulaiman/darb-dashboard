import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  MyLocationContext,
  type MyLocation,
  type MyLocationPermissionState,
} from "../contexts/MyLocationContext";

type MyLocationProviderProps = {
  children: ReactNode;
  autoRequest?: boolean;
  fallbackLocation?: MyLocation | null;
};

const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "location.errors.permissionDenied";
    case error.POSITION_UNAVAILABLE:
      return "location.errors.positionUnavailable";
    case error.TIMEOUT:
      return "location.errors.timeout";
    default:
      return "location.errors.unknown";
  }
};

const MyLocationProvider = ({
  children,
  autoRequest = false,
  fallbackLocation = null,
}: MyLocationProviderProps) => {
  const [location, setLocation] = useState<MyLocation | null>(fallbackLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<MyLocationPermissionState>("unknown");

  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const clearLocationError = useCallback(() => {
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setError("location.errors.notSupported");
      setPermissionState("unsupported");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        setIsLoading(false);
        setPermissionState("granted");
      },
      (geoError) => {
        setIsLoading(false);
        setError(getGeolocationErrorMessage(geoError));

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setPermissionState("denied");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) {
      setPermissionState("unsupported");
      return;
    }

    if (!("permissions" in navigator)) {
      setPermissionState("unknown");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        setPermissionState(permissionStatus.state);

        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state);
        };
      })
      .catch(() => {
        setPermissionState("unknown");
      });
  }, [isSupported]);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  const value = useMemo(
    () => ({
      location,
      isLoading,
      error,
      isSupported,
      permissionState,
      requestLocation,
      clearLocationError,
    }),
    [
      location,
      isLoading,
      error,
      isSupported,
      permissionState,
      requestLocation,
      clearLocationError,
    ],
  );

  return (
    <MyLocationContext.Provider value={value}>
      {children}
    </MyLocationContext.Provider>
  );
};

export default MyLocationProvider;