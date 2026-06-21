import type { RouteLine } from "../types/route.types";

export type RecordedRoutePoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: string;
};

export type RouteRecorderStatus = "idle" | "recording" | "paused" | "finished" | "error";

export type RouteRecorderOptions = {
  accuracyThresholdMeters: number;
  minDistanceMeters: number;
  simplifyToleranceMeters: number;
};

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const createRecordedRoutePoint = (
  position: GeolocationPosition,
): RecordedRoutePoint => {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? null,
    speed: position.coords.speed ?? null,
    heading: position.coords.heading ?? null,
    altitude: position.coords.altitude ?? null,
    timestamp: new Date(position.timestamp).toISOString(),
  };
};

export const getDistanceMeters = (
  first: Pick<RecordedRoutePoint, "latitude" | "longitude">,
  second: Pick<RecordedRoutePoint, "latitude" | "longitude">,
): number => {
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);

  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

export const getRecordedRouteDistanceMeters = (points: RecordedRoutePoint[]): number => {
  if (points.length < 2) {
    return 0;
  }

  return points.reduce((total, point, index) => {
    if (index === 0) {
      return total;
    }

    return total + getDistanceMeters(points[index - 1], point);
  }, 0);
};

const projectPoint = (
  point: Pick<RecordedRoutePoint, "latitude" | "longitude">,
  origin: Pick<RecordedRoutePoint, "latitude" | "longitude">,
) => {
  const x =
    EARTH_RADIUS_METERS *
    toRadians(point.longitude - origin.longitude) *
    Math.cos(toRadians(origin.latitude));

  const y = EARTH_RADIUS_METERS * toRadians(point.latitude - origin.latitude);

  return {
    x,
    y,
  };
};

const getPerpendicularDistanceMeters = (
  point: RecordedRoutePoint,
  lineStart: RecordedRoutePoint,
  lineEnd: RecordedRoutePoint,
): number => {
  const start = projectPoint(lineStart, lineStart);
  const end = projectPoint(lineEnd, lineStart);
  const current = projectPoint(point, lineStart);

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (deltaX === 0 && deltaY === 0) {
    return getDistanceMeters(point, lineStart);
  }

  const projection =
    ((current.x - start.x) * deltaX + (current.y - start.y) * deltaY) /
    (deltaX * deltaX + deltaY * deltaY);

  const clampedProjection = Math.max(0, Math.min(1, projection));

  const closestX = start.x + clampedProjection * deltaX;
  const closestY = start.y + clampedProjection * deltaY;

  return Math.hypot(current.x - closestX, current.y - closestY);
};

const simplifyRange = (
  points: RecordedRoutePoint[],
  startIndex: number,
  endIndex: number,
  toleranceMeters: number,
  keptIndexes: boolean[],
) => {
  if (endIndex <= startIndex + 1) {
    return;
  }

  let maxDistance = 0;
  let farthestIndex = startIndex;

  for (let index = startIndex + 1; index < endIndex; index += 1) {
    const distance = getPerpendicularDistanceMeters(
      points[index],
      points[startIndex],
      points[endIndex],
    );

    if (distance > maxDistance) {
      maxDistance = distance;
      farthestIndex = index;
    }
  }

  if (maxDistance > toleranceMeters) {
    keptIndexes[farthestIndex] = true;

    simplifyRange(points, startIndex, farthestIndex, toleranceMeters, keptIndexes);
    simplifyRange(points, farthestIndex, endIndex, toleranceMeters, keptIndexes);
  }
};

export const simplifyRecordedPoints = (
  points: RecordedRoutePoint[],
  toleranceMeters: number,
): RecordedRoutePoint[] => {
  if (points.length <= 2 || toleranceMeters <= 0) {
    return points;
  }

  const keptIndexes = Array(points.length).fill(false) as boolean[];

  keptIndexes[0] = true;
  keptIndexes[points.length - 1] = true;

  simplifyRange(points, 0, points.length - 1, toleranceMeters, keptIndexes);

  return points.filter((_, index) => keptIndexes[index]);
};

export const recordedPointsToGeoJsonLine = (points: RecordedRoutePoint[]): RouteLine => {
  return {
    type: "LineString",
    coordinates: points.map((point) => [point.longitude, point.latitude]),
  };
};

export const geoJsonLineToMapPoints = (
  coordinates?: [number, number][],
): [number, number][] => {
  return (coordinates ?? [])
    .map(([longitude, latitude]) => {
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        return null;
      }

      return [latitude, longitude] as [number, number];
    })
    .filter((point): point is [number, number] => point !== null);
};

export const recordedPointsToMapPoints = (
  points: RecordedRoutePoint[],
): [number, number][] => {
  return points.map((point) => [point.latitude, point.longitude]);
};

export const getSpeedKmh = (speedMetersPerSecond?: number | null): number | null => {
  if (speedMetersPerSecond === null || speedMetersPerSecond === undefined) {
    return null;
  }

  return Math.max(0, speedMetersPerSecond * 3.6);
};
