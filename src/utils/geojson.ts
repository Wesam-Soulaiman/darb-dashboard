export type GeoJsonPoint = {
  type: "Point";
  coordinates: [number, number]; // [lon, lat]
};

export const encodeBase64Url = (value: string) => {
  return window.btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const encodeGeoJsonPoint = (lat: number, lon: number) => {
  const point: GeoJsonPoint = {
    type: "Point",
    coordinates: [lon, lat],
  };

  return encodeBase64Url(JSON.stringify(point));
};
