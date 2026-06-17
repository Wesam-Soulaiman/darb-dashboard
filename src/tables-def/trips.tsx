import { Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import DeleteTrip from "../pages/admin/trips/components/DeleteTrip";
import ManageTripOperations from "../pages/admin/trips/components/ManageTripOperations";
import UpdateTrip from "../pages/admin/trips/components/UpdateTrip";
import type { Bus } from "../types/bus.types";
import type { OrganizationRoute } from "../types/organization.types";
import type { Schedule } from "../types/schedule.types";
import type { Trip, TripDriverRef } from "../types/trip.types";

type TripsColumnsProps = {
  t: TFunction;
  locale: string;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
  drivers: TripDriverRef[];
};

export const getTripsTableColumns = ({
  t,
  locale,
  orgRoutes,
  schedules,
  buses,
  drivers,
}: TripsColumnsProps): MRT_ColumnDef<Trip>[] => [
  {
    accessorKey: "headsign",
    header: t("trips.table.headsign"),
    enableColumnFilter: false,

    Cell: ({ row }) => (
      <Stack spacing={0.25}>
        <Typography sx={{ fontWeight: 900 }}>{row.original.headsign}</Typography>

        {row.original.blockId && (
          <Typography variant="caption" color="text.secondary">
            {t("trips.table.blockId")}: {row.original.blockId}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    id: "routeId",
    accessorFn: (row) => row.route.id,
    header: t("trips.table.route"),
    filterVariant: "select",

    filterSelectOptions: orgRoutes.map((orgRoute) => ({
      label: orgRoute.route.name,
      value: orgRoute.route.id,
    })),

    Cell: ({ row }) => (
      <Typography sx={{ fontWeight: 800 }}>{row.original.route.name}</Typography>
    ),
  },
  {
    id: "scheduleId",
    accessorFn: (row) => String(row.schedule.id),
    header: t("trips.table.schedule"),
    filterVariant: "select",

    filterSelectOptions: schedules.map((schedule) => ({
      label: `${schedule.name} (${schedule.serviceCode})`,
      value: String(schedule.id),
    })),

    Cell: ({ row }) => (
      <Stack spacing={0.25}>
        <Typography sx={{ fontWeight: 800 }}>{row.original.schedule.name}</Typography>

        <Typography variant="caption" color="text.secondary">
          {row.original.schedule.serviceCode}
        </Typography>
      </Stack>
    ),
  },
  {
    id: "defaultDriver",
    header: t("trips.table.defaultDriver"),
    enableColumnFilter: false,
    enableSorting: false,

    Cell: ({ row }) =>
      row.original.defaultDriver ? (
        <Stack spacing={0.25}>
          <Typography sx={{ fontWeight: 800 }}>
            {row.original.defaultDriver.firstName} {row.original.defaultDriver.lastName}
          </Typography>

          {row.original.defaultDriver.phone && (
            <Typography variant="caption" color="text.secondary">
              {row.original.defaultDriver.phone}
            </Typography>
          )}
        </Stack>
      ) : (
        <Chip
          size="small"
          color="error"
          variant="outlined"
          label={t("trips.table.noDefaultDriver")}
        />
      ),
  },
  {
    id: "defaultBus",
    header: t("trips.table.defaultBus"),
    enableColumnFilter: false,
    enableSorting: false,

    Cell: ({ row }) =>
      row.original.defaultBus ? (
        <Stack spacing={0.25}>
          <Typography sx={{ fontWeight: 800 }}>
            {row.original.defaultBus.plateNumber}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {row.original.defaultBus.busCode}
          </Typography>
        </Stack>
      ) : (
        <Chip
          size="small"
          color="error"
          variant="outlined"
          label={t("trips.table.noDefaultBus")}
        />
      ),
  },
  {
    accessorKey: "isActive",
    header: t("trips.table.isActive"),
    filterVariant: "select",

    filterSelectOptions: [
      {
        label: t("common.active"),
        value: "true",
      },
      {
        label: t("common.inactive"),
        value: "false",
      },
    ],

    Cell: ({ row }) => (
      <Chip
        size="small"
        color={row.original.isActive ? "success" : "default"}
        label={row.original.isActive ? t("common.active") : t("common.inactive")}
      />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: t("trips.table.updatedAt"),
    enableColumnFilter: false,

    Cell: ({ row }) =>
      row.original.updatedAt
        ? new Date(row.original.updatedAt).toLocaleDateString(locale)
        : "-",
  },
  {
    id: "actions",
    header: t("table.actions"),
    size: 190,
    enableColumnFilter: false,
    enableSorting: false,
    enableColumnActions: false,

    Cell: ({ row }) => (
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <ManageTripOperations trip={row.original} />

        <UpdateTrip
          trip={row.original}
          orgRoutes={orgRoutes}
          schedules={schedules}
          buses={buses}
          drivers={drivers}
        />

        <DeleteTrip trip={row.original} />
      </Stack>
    ),
  },
];
