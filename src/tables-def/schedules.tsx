import { Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Schedule } from "../types/schedule.types";
import UpdateSchedule from "../pages/admin/schedules/components/UpdateSchedule";
import DeleteSchedule from "../pages/admin/schedules/components/DeleteSchedule";
import ScheduleExceptions from "../pages/admin/schedules/components/ScheduleExceptions";

interface SchedulesColumnsProps {
  t: TFunction;
}

const DAYS: Array<{
  key: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  labelKey: string;
}> = [
  { key: "monday", labelKey: "schedules.daysShort.monday" },
  { key: "tuesday", labelKey: "schedules.daysShort.tuesday" },
  { key: "wednesday", labelKey: "schedules.daysShort.wednesday" },
  { key: "thursday", labelKey: "schedules.daysShort.thursday" },
  { key: "friday", labelKey: "schedules.daysShort.friday" },
  { key: "saturday", labelKey: "schedules.daysShort.saturday" },
  { key: "sunday", labelKey: "schedules.daysShort.sunday" },
];

export const getSchedulesTableColumns = ({
  t,
}: SchedulesColumnsProps): MRT_ColumnDef<Schedule>[] => {
  return [
    {
      accessorKey: "name",
      header: t("schedules.table.name"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Stack spacing={0.25}>
          <Typography sx={{ fontWeight: 900 }}>{row.original.name}</Typography>
        </Stack>
      ),
    },
    {
      accessorKey: "serviceCode",
      header: t("schedules.table.serviceCode"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
    },
    {
      id: "operatingDays",
      header: t("schedules.table.operatingDays"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      size: 250,
      enableSorting: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
          {DAYS.filter((day) => Boolean(row.original[day.key])).map((day) => (
            <Chip
              key={day.key}
              size="small"
              label={t(day.labelKey)}
              variant="outlined"
              sx={{ mb: 0.5 }}
            />
          ))}
        </Stack>
      ),
    },
    {
      accessorKey: "startDate",
      header: t("schedules.table.startDate"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.startDate
          ? new Date(row.original.startDate).toLocaleDateString("ar-SY")
          : "-",
    },
    {
      accessorKey: "endDate",
      header: t("schedules.table.endDate"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString("ar-SY")
          : "-",
    },
    {
      accessorKey: "isActive",
      header: t("schedules.table.isActive"),
      filterVariant: "select",
      filterSelectOptions: [
        { label: t("common.active"), value: "true" },
        { label: t("common.inactive"), value: "false" },
      ],
      Cell: ({ row }) => (
        <Chip
          label={row.original.isActive ? t("common.active") : t("common.inactive")}
          color={row.original.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: t("schedules.table.updatedAt"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.updatedAt
          ? new Date(row.original.updatedAt).toLocaleDateString("ar-SY")
          : "-",
    },
    {
      id: "actions",
      header: t("table.actions"),
      size: 180,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <ScheduleExceptions schedule={row.original} />
          <UpdateSchedule schedule={row.original} />
          <DeleteSchedule schedule={row.original} />
        </Stack>
      ),
    },
  ];
};
