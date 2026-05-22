import type { Stop } from "./stop.types";

export type TransitMode =
  | "air"
  | "bus"
  | "cableway"
  | "coach"
  | "lift"
  | "metro"
  | "monorail"
  | "rail"
  | "tram";

export type RouteLine = {
  type: "LineString";
  coordinates?: [number, number][];
  bbox?: number[];
  geometry?: string;
  properties?: string;
  features?: string;
  geometries?: string;
  [key: string]: unknown;
};

export type RoutePrice = {
  amount: string;
  currency: "SYP";
};

export type RouteNode = {
  id: number;
  ordering: number;
  node: Stop;
};

export interface TransitRoute {
  id: string;
  name: string;
  originPlaceId: number;
  destinationPlaceId: number;
  routeNodes?: RouteNode[];
  mode: TransitMode;
  line: RouteLine;
  price: RoutePrice;
  length: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutesPaginationMeta {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string | null;
}

export interface RoutesPaginationLinks {
  next?: string | null;
}

export interface RoutesResponse {
  data: TransitRoute[];
  meta: RoutesPaginationMeta;
  links?: RoutesPaginationLinks;
}

export interface GetRoutesParams {
  cursor?: string;
  limit?: number;
  originPlaceId?: number;
  destinationPlaceId?: number;
  mode?: TransitMode;
  search?: string;
}

export interface CreateRoutePayload {
  name: string;
  originPlaceId: number;
  destinationPlaceId: number;
  price: RoutePrice;
  mode: TransitMode;
  line: RouteLine;
}

export interface UpdateRoutePayload {
  name: string;
  originPlaceId: number;
  destinationPlaceId: number;
  price: RoutePrice;
  mode: TransitMode;
  line: RouteLine;
}

export type RouteStopPayloadItem = {
  stopId: string;
  ordering: number;
};

export interface UpdateRouteStopsPayload {
  stops: RouteStopPayloadItem[];
}
