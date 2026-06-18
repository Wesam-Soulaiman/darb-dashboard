import { Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Bus, BusStatus } from "../types/bus.types";
import UpdateBus from "../pages/admin/buses/components/UpdateBus";
import DeleteBus from "../pages/admin/buses/components/DeleteBus";

interface BusesColumnsProps {
  t: TFunction;
}

const getStatusColor = (
  status: BusStatus,
): "success" | "info" | "warning" | "error" | "default" => {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "IN_SERVICE":
      return "info";
    case "MAINTENANCE":
      return "warning";
    case "OUT_OF_SERVICE":
      return "error";
    default:
      return "default";
  }
};

export const getBusesTableColumns = ({ t }: BusesColumnsProps): MRT_ColumnDef<Bus>[] => {
  return [
    {
      accessorKey: "busCode",
      header: t("buses.table.busCode"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Chip
          label={row.original.busCode}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 800 }}
        />
      ),
    },
    {
      accessorKey: "plateNumber",
      header: t("buses.table.plateNumber"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography sx={{ fontWeight: 800 }}>{row.original.plateNumber}</Typography>
      ),
    },
    {
      accessorKey: "type",
      header: t("buses.table.type"),
      filterVariant: "select",
      filterSelectOptions: [
        { label: t("buses.types.STANDARD"), value: "STANDARD" },
        { label: t("buses.types.MINIBUS"), value: "MINIBUS" },
        { label: t("buses.types.ARTICULATED"), value: "ARTICULATED" },
      ],
      Cell: ({ row }) => t(`buses.types.${row.original.type}`),
    },
    {
      accessorKey: "status",
      header: t("buses.table.status"),
      filterVariant: "select",
      filterSelectOptions: [
        { label: t("buses.statuses.AVAILABLE"), value: "AVAILABLE" },
        { label: t("buses.statuses.IN_SERVICE"), value: "IN_SERVICE" },
        { label: t("buses.statuses.MAINTENANCE"), value: "MAINTENANCE" },
        {
          label: t("buses.statuses.OUT_OF_SERVICE"),
          value: "OUT_OF_SERVICE",
        },
      ],
      Cell: ({ row }) => (
        <Chip
          label={t(`buses.statuses.${row.original.status}`)}
          color={getStatusColor(row.original.status)}
          size="small"
        />
      ),
    },
    {
      accessorKey: "capacity",
      header: t("buses.table.capacity"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "manufacturer",
      header: t("buses.table.manufacturer"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "model",
      header: t("buses.table.model"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "year",
      header: t("buses.table.year"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "registrationExpiry",
      header: t("buses.table.registrationExpiry"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.registrationExpiry
          ? new Date(row.original.registrationExpiry).toLocaleDateString("ar-SY")
          : "-",
    },
    {
      accessorKey: "createdAt",
      header: t("buses.table.createdAt"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("ar-SY")
          : "-",
    },
    {
      id: "actions",
      header: t("table.actions"),
      size: 160,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <UpdateBus bus={row.original} />
          <DeleteBus bus={row.original} />
        </Stack>
      ),
    },
  ];
};
