import type {
  GenerateRouteOnRoadsPayload,
  GenerateRouteOnRoadsResult,
  GeoJsonCoordinate,
  MapPoint,
  RoutingProvider,
} from "../../types/routing.types";

type OrsGeoJsonResponse = {
  features?: Array<{
    geometry?: {
      type?: string;
      coordinates?: GeoJsonCoordinate[];
    };
  }>;
  error?: {
    code?: number;
    message?: string;
  };
};

const MAX_ORS_WAYPOINTS = 70;

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
  maxWaypoints = MAX_ORS_WAYPOINTS,
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

  if (provider === "backend") {
    return "backend";
  }

  return "ors";
};

const generateRouteWithOpenRouteService = async ({
  points,
}: GenerateRouteOnRoadsPayload): Promise<GenerateRouteOnRoadsResult> => {
  const apiKey = String(import.meta.env.VITE_ORS_API_KEY ?? "").trim();

  const baseUrl = String(
    import.meta.env.VITE_ORS_BASE_URL ?? "https://api.openrouteservice.org",
  ).trim();

  const profile = String(import.meta.env.VITE_ORS_PROFILE ?? "driving-car").trim();

  if (!apiKey) {
    throw new Error("Missing VITE_ORS_API_KEY.");
  }

  if (points.length < 2) {
    throw new Error("At least two points are required.");
  }

  const waypoints = limitWaypoints(points);

  const response = await fetch(`${baseUrl}/v2/directions/${profile}/geojson`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/json, application/geo+json",
    },
    body: JSON.stringify({
      coordinates: waypoints.map(mapPointToGeoJsonCoordinate),
      instructions: false,
      elevation: false,
    }),
  });

  const data = (await response.json()) as OrsGeoJsonResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message || `Routing request failed with status ${response.status}.`,
    );
  }

  const coordinates = data.features?.[0]?.geometry?.coordinates;

  if (!coordinates || coordinates.length < 2) {
    throw new Error("Routing provider did not return a valid route.");
  }

  return {
    provider: "ors",
    rawCoordinates: coordinates,
    points: coordinates.map(geoJsonCoordinateToMapPoint),
  };
};

const generateRouteWithBackend = async (
  payload: GenerateRouteOnRoadsPayload,
): Promise<GenerateRouteOnRoadsResult> => {
  /*
   * لاحقًا في production نغيّر هذا فقط.
   * مثال مستقبلي:
   *
   * const response = await apiClient.post<GenerateRouteOnRoadsResult>(
   *   "/routes/generate-line",
   *   payload,
   * );
   *
   * return response.data;
   */

  void payload;

  throw new Error("Backend routing provider is not implemented yet.");
};

export const routingService = {
  generateRouteOnRoads: async (
    payload: GenerateRouteOnRoadsPayload,
  ): Promise<GenerateRouteOnRoadsResult> => {
    const provider = getRoutingProvider();

    if (provider === "backend") {
      return generateRouteWithBackend(payload);
    }

    return generateRouteWithOpenRouteService(payload);
  },
};
