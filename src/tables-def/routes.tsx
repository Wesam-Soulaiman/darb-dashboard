import { Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Place } from "../types/place.types";
import type { TransitRoute } from "../types/route.types";
import { transitModes } from "../schemas/locations/routeSchemas";
import UpdateRoute from "../pages/admin/routes/components/UpdateRoute";
import DeleteRoute from "../pages/admin/routes/components/DeleteRoute";
import ManageRouteStops from "../pages/admin/routes/components/ManageRouteStops";

interface RoutesColumnsProps {
  t: TFunction;
  places: Place[];
}

const getPlaceName = (places: Place[], id: number) => {
  return places.find((place) => place.id === id)?.name ?? String(id);
};

export const getRoutesTableColumns = ({
  t,
  places,
}: RoutesColumnsProps): MRT_ColumnDef<TransitRoute>[] => {
  return [
    {
      accessorKey: "name",
      header: t("routes.table.name"),
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography noWrap sx={{ fontWeight: 800, minWidth: 140 }}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "originPlaceId",
      header: t("routes.table.originPlace"),
      filterVariant: "select",
      filterSelectOptions: places.map((place) => ({
        label: place.name,
        value: String(place.id),
      })),
      enableSorting: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {getPlaceName(places, row.original.originPlaceId)}
        </Typography>
      ),
    },
    {
      accessorKey: "destinationPlaceId",
      header: t("routes.table.destinationPlace"),
      filterVariant: "select",
      filterSelectOptions: places.map((place) => ({
        label: place.name,
        value: String(place.id),
      })),
      enableSorting: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {getPlaceName(places, row.original.destinationPlaceId)}
        </Typography>
      ),
    },
    {
      accessorKey: "mode",
      header: t("routes.table.mode"),
      filterVariant: "select",
      filterSelectOptions: transitModes.map((mode) => ({
        label: t(`routes.modes.${mode}`),
        value: mode,
      })),
      enableSorting: false,
      Cell: ({ row }) => (
        <Typography component="span">{t(`routes.modes.${row.original.mode}`)}</Typography>
      ),
    },
    {
      accessorKey: "price.amount",
      header: t("routes.table.price"),
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {row.original.price?.amount} {row.original.price?.currency}
        </Typography>
      ),
    },
    {
      accessorKey: "length",
      header: t("routes.table.length"),
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{row.original.length ?? 0}</Typography>
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
          <ManageRouteStops route={row.original} />
          <UpdateRoute route={row.original} />
          <DeleteRoute route={row.original} />
        </Stack>
      ),
    },
  ];
};
