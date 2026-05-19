import { Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Stop } from "../types/stop.types";
import type { Place } from "../types/place.types";
import UpdateStop from "../pages/admin/stops/components/UpdateStop";
import DeleteStop from "../pages/admin/stops/components/DeleteStop";

interface StopsColumnsProps {
  t: TFunction;
  places: Place[];
}

const getCoordinatesText = (stop: Stop) => {
  const lon = stop.coordinates?.coordinates?.[0];
  const lat = stop.coordinates?.coordinates?.[1];

  if (lat === undefined || lon === undefined) {
    return "-";
  }

  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
};

export const getStopsTableColumns = ({
  t,
  places,
}: StopsColumnsProps): MRT_ColumnDef<Stop>[] => {
  return [
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 220,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{row.original.id}</Typography>
      ),
    },
    {
      accessorKey: "name",
      header: t("stops.table.name"),
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography noWrap sx={{ fontWeight: 800, minWidth: 140 }}>
          {row.original.name || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "placeId",
      header: t("stops.table.place"),
      filterVariant: "select",
      filterSelectOptions: places.map((place) => ({
        label: place.name,
        value: String(place.id),
      })),
      enableColumnFilter: true,
      enableSorting: false,
      Cell: ({ row }) => {
        const place = places.find((item) => item.id === row.original.placeId);

        return (
          <Typography component="span">
            {place?.name ?? row.original.placeId}
          </Typography>
        );
      },
    },
    {
      id: "coordinates",
      header: t("stops.table.coordinates"),
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {getCoordinatesText(row.original)}
        </Typography>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("stops.table.createdAt"),
      enableColumnFilter: false,
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
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <UpdateStop stop={row.original} />
          <DeleteStop stop={row.original} />
        </Stack>
      ),
    },
  ];
};