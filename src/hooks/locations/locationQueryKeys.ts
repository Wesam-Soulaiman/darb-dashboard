import type { GetGovernatesParams } from "../../types/governate.types";

export const locationQueryKeys = {
  all: ["locations"] as const,

  countries: () => [...locationQueryKeys.all, "countries"] as const,
  country: (id: number) => [...locationQueryKeys.countries(), id] as const,

  governates: (params?: GetGovernatesParams) =>
    [...locationQueryKeys.all, "governates", params ?? {}] as const,
  governate: (id: number) =>
    [...locationQueryKeys.all, "governates", id] as const,
};
