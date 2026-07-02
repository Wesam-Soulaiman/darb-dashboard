export type MapPoint = [number, number]; // [latitude, longitude]

export type GeoJsonCoordinate = [number, number]; // [longitude, latitude]

export type RoutingProvider = "ors" | "backend";

export type GenerateRouteOnRoadsPayload = {
  points: MapPoint[];
};

export type GenerateRouteOnRoadsResult = {
  points: MapPoint[];
  rawCoordinates: GeoJsonCoordinate[];
  provider: RoutingProvider;
};
