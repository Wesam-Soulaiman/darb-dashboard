import { createContext, useContext } from "react";

export type MyLocation = {
  lat: number;
  lon: number;
};

export type MyLocationPermissionState = PermissionState | "unsupported" | "unknown";

export type MyLocationContextValue = {
  location: MyLocation | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  permissionState: MyLocationPermissionState;
  requestLocation: () => void;
  clearLocationError: () => void;
};

export const MyLocationContext = createContext<MyLocationContextValue | null>(null);

export const useMyLocationContext = () => {
  const context = useContext(MyLocationContext);

  if (!context) {
    throw new Error("useMyLocationContext must be used within MyLocationProvider");
  }

  return context;
};
