export type PlaceCenter = {
  type: "Point";
  coordinates: [number, number];
  bbox?: number[];
  geometry?: string;
  properties?: string;
  features?: string;
  geometries?: string;
  [key: string]: unknown;
};

export interface Place {
  id: number;
  name: string;
  governateId: number;
  center: PlaceCenter;
  createdAt: string;
  updatedAt: string;
}

export interface PlacesPaginationMeta {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string | null;
}

export interface PlacesPaginationLinks {
  next?: string | null;
}

export interface PlacesResponse {
  data: Place[];
  meta: PlacesPaginationMeta;
  links?: PlacesPaginationLinks;
}

export interface GetPlacesParams {
  cursor?: string;
  limit?: number;
  governateId?: number;
  countryId?: number;
  search?: string;
}

export interface CreatePlacePayload {
  name: string;
  governateId: number;
  center: PlaceCenter;
}

export interface UpdatePlacePayload {
  name: string;
  governateId: number;
  center: PlaceCenter;
}
