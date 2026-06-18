import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";

import type { Schedule } from "../types/schedule.types";
import UpdateSchedule from "../pages/admin/schedules/components/UpdateSchedule";
import DeleteSchedule from "../pages/admin/schedules/components/DeleteSchedule";
import ScheduleExceptions from "../pages/admin/schedules/components/ScheduleExceptions";

type GetSchedulesCardProps = {
  t: TFunction;
};

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

export const getSchedulesCard = ({ t }: GetSchedulesCardProps) => {
  return (schedule: Schedule) => (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 900 }}>{schedule.name}</Typography>

              <Typography variant="body2" color="text.secondary">
                {schedule.serviceCode}
              </Typography>
            </Stack>

            <Chip
              label={schedule.isActive ? t("common.active") : t("common.inactive")}
              color={schedule.isActive ? "success" : "default"}
              size="small"
            />
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
            {DAYS.filter((day) => Boolean(schedule[day.key])).map((day) => (
              <Chip
                key={day.key}
                size="small"
                label={t(day.labelKey)}
                variant="outlined"
                sx={{ mb: 0.5 }}
              />
            ))}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t("schedules.table.validity")}:{" "}
            {schedule.startDate
              ? new Date(schedule.startDate).toLocaleDateString("ar-SY")
              : "-"}{" "}
            -{" "}
            {schedule.endDate
              ? new Date(schedule.endDate).toLocaleDateString("ar-SY")
              : "-"}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ScheduleExceptions schedule={schedule} />
            <UpdateSchedule schedule={schedule} />
            <DeleteSchedule schedule={schedule} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
