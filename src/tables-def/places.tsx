import { Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Place } from "../types/place.types";
import type { Country } from "../types/country.types";
import type { Governate } from "../types/governate.types";
import UpdatePlace from "../pages/admin/places/components/UpdatePlace";
import DeletePlace from "../pages/admin/places/components/DeletePlace";

export type PlaceTableRow = Place & {
  countryId?: number | null;
};

interface PlacesColumnsProps {
  t: TFunction;
  countries: Country[];
  governates: Governate[];
}

const getCenterText = (place: Place) => {
  const lon = place.center?.coordinates?.[0];
  const lat = place.center?.coordinates?.[1];

  if (lat === undefined || lon === undefined) {
    return "-";
  }

  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
};

export const getPlacesTableColumns = ({
  t,
  countries,
  governates,
}: PlacesColumnsProps): MRT_ColumnDef<PlaceTableRow>[] => {
  return [
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 80,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{row.original.id}</Typography>
      ),
    },
    {
      accessorKey: "name",
      header: t("places.table.name"),
      enableColumnFilter: false,
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Typography noWrap sx={{ fontWeight: 800, minWidth: 140 }}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "countryId",
      header: t("places.filters.country"),
      filterVariant: "select",
      filterSelectOptions: countries.map((country) => ({
        label: country.name,
        value: String(country.id),
      })),
      enableColumnFilter: true,
      enableSorting: false,
      Cell: ({ row }) => {
        const country = countries.find(
          (item) => item.id === row.original.countryId,
        );

        return (
          <Typography component="span">
            {country?.name ?? "-"}
          </Typography>
        );
      },
    },
    {
      accessorKey: "governateId",
      header: t("places.table.governateId"),
      filterVariant: "select",
      filterSelectOptions: governates.map((governate) => ({
        label: governate.name,
        value: String(governate.id),
      })),
      enableColumnFilter: true,
      enableSorting: false,
      Cell: ({ row }) => {
        const governate = governates.find(
          (item) => item.id === row.original.governateId,
        );

        return (
          <Typography component="span">
            {governate?.name ?? row.original.governateId}
          </Typography>
        );
      },
    },
    {
      id: "center",
      header: t("places.table.center"),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{getCenterText(row.original)}</Typography>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("places.table.createdAt"),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("ar-SY")
            : "-"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: t("table.actions"),
      size: 140,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <UpdatePlace place={row.original} />
          <DeletePlace place={row.original} />
        </Stack>
      ),
    },
  ];
};