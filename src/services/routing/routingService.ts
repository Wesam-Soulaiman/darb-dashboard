import { apiClient } from "../../api/apiClient";
import { LARGE_JSON_GZIP_MIN_BYTES } from "../../utils/requestCompression";

import type {
  GenerateRouteOnRoadsPayload,
  GenerateRouteOnRoadsResult,
  GeoJsonCoordinate,
  MapPoint,
  RoutingProvider,
} from "../../types/routing.types";

type GeoJsonPoint = {
  type: "Point";
  coordinates: GeoJsonCoordinate;
};

type GeoJsonLineString = {
  type: "LineString";
  coordinates: GeoJsonCoordinate[];
  bbox?: number[];
};

const MAX_DIRECTIONS_WAYPOINTS = 70;

const mapPointToGeoJsonCoordinate = ([
  latitude,
  longitude,
]: MapPoint): GeoJsonCoordinate => [longitude, latitude];

const geoJsonCoordinateToMapPoint = ([
  longitude,
  latitude,
]: GeoJsonCoordinate): MapPoint => [latitude, longitude];

const limitWaypoints = (
  points: MapPoint[],
  maxWaypoints = MAX_DIRECTIONS_WAYPOINTS,
): MapPoint[] => {
  if (points.length <= maxWaypoints) {
    return points;
  }

  const lastIndex = points.length - 1;
  const step = lastIndex / (maxWaypoints - 1);

  return Array.from({ length: maxWaypoints }, (_, index) => {
    const pointIndex = index === maxWaypoints - 1 ? lastIndex : Math.round(index * step);

    return points[pointIndex];
  });
};

const getRoutingProvider = (): RoutingProvider => {
  const provider = import.meta.env.VITE_ROUTING_PROVIDER;

  if (provider === "ors") {
    return "ors";
  }

  return "backend";
};

const generateRouteWithBackend = async ({
  points,
}: GenerateRouteOnRoadsPayload): Promise<GenerateRouteOnRoadsResult> => {
  if (points.length < 2) {
    throw new Error("At least two points are required.");
  }

  const waypoints = limitWaypoints(points);

  const payload: GeoJsonPoint[] = waypoints.map((point) => ({
    type: "Point",
    coordinates: mapPointToGeoJsonCoordinate(point),
  }));

  const response = await apiClient.post<GeoJsonLineString | null>(
    "/directions",
    payload,
    {
      compress: true,
      compressionMinSizeBytes: LARGE_JSON_GZIP_MIN_BYTES,
    },
  );

  const lineString = response.data;

  if (
    !lineString ||
    lineString.type !== "LineString" ||
    !Array.isArray(lineString.coordinates) ||
    lineString.coordinates.length < 2
  ) {
    throw new Error("Routing provider did not return a valid route.");
  }

  return {
    provider: "backend",
    rawCoordinates: lineString.coordinates,
    points: lineString.coordinates.map(geoJsonCoordinateToMapPoint),
  };
};

const generateRouteWithOpenRouteService = async (
  payload: GenerateRouteOnRoadsPayload,
): Promise<GenerateRouteOnRoadsResult> => {
  void payload;

  throw new Error(
    "Direct OpenRouteService routing is disabled. Use VITE_ROUTING_PROVIDER=backend.",
  );
};

export const routingService = {
  generateRouteOnRoads: async (
    payload: GenerateRouteOnRoadsPayload,
  ): Promise<GenerateRouteOnRoadsResult> => {
    const provider = getRoutingProvider();

    if (provider === "ors") {
      return generateRouteWithOpenRouteService(payload);
    }

    return generateRouteWithBackend(payload);
  },
};
