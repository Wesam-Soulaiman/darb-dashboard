export type StopCoordinates = {
  type: "Point";
  coordinates?: [number, number]; // [lon, lat]
  bbox?: number[];
  geometry?: string;
  properties?: string;
  features?: string;
  geometries?: string;
  [key: string]: unknown;
};

export interface Stop {
  id: string;
  placeId: number;
  name: string;
  coordinates: StopCoordinates;
  createdAt: string;
  updatedAt: string;
}

export interface StopsPaginationMeta {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string | null;
}

export interface StopsPaginationLinks {
  next?: string | null;
}

export interface StopsResponse {
  data: Stop[];
  meta: StopsPaginationMeta;
  links?: StopsPaginationLinks;
}

export interface GetStopsParams {
  cursor?: string;
  limit?: number;
  placeId?: number;
  governateId?: number;
  search?: string;
  within?: string;
  withinRadius?: number;
  bbox?: string;
}

export interface CreateStopPayload {
  name: string;
  placeId: number;
  coordinates: StopCoordinates;
}

export interface UpdateStopPayload {
  name: string;
  placeId: number;
  coordinates: StopCoordinates;
}
