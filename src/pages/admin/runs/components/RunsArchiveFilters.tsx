import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";

import type { Bus } from "../../../../types/bus.types";
import type { Schedule } from "../../../../types/schedule.types";
import type { RunStatus } from "../../../../types/run.types";
import type { Trip } from "../../../../types/trip.types";
import type { UserListItem } from "../../../../types/user.types";

export type ArchiveDateMode = "exact" | "range";

export interface RunsArchiveFiltersValue {
  dateMode: ArchiveDateMode;
  date: string;
  fromDate: string;
  toDate: string;
  tripId: string;
  scheduleId: string;
  driverId: string;
  routeId: string;
  busId: string;
  status: "" | RunStatus;
  excludeFinished: boolean;
}

type RouteOption = {
  id: string;
  name: string;
};

type RunsArchiveFiltersProps = {
  value: RunsArchiveFiltersValue;
  routes: RouteOption[];
  trips: Trip[];
  schedules: Schedule[];
  drivers: UserListItem[];
  buses: Bus[];
  optionsLoading?: boolean;
  onChange: (value: RunsArchiveFiltersValue) => void;
  onApply: () => void;
  onReset: () => void;
};

const RUN_STATUSES: RunStatus[] = [
  "draft",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const RunsArchiveFilters = ({
  value,
  routes,
  trips,
  schedules,
  drivers,
  buses,
  optionsLoading = false,
  onChange,
  onApply,
  onReset,
}: RunsArchiveFiltersProps) => {
  const { t } = useTranslation();

  const yesterday = dayjs().subtract(1, "day").startOf("day");

  const availableTrips = value.routeId
    ? trips.filter((trip) => trip.route.id === value.routeId)
    : trips;

  const patch = (values: Partial<RunsArchiveFiltersValue>) => {
    onChange({
      ...value,
      ...values,
    });
  };

  const hasValidDate =
    value.dateMode === "exact"
      ? Boolean(value.date)
      : Boolean(value.fromDate && value.toDate && value.fromDate <= value.toDate);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2.5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
            }}
          >
            {t("runs.archive.filters.title")}
          </Typography>

          <ToggleButtonGroup
            value={value.dateMode}
            exclusive
            size="small"
            onChange={(_event, mode: ArchiveDateMode | null) => {
              if (!mode) {
                return;
              }

              patch({
                dateMode: mode,
              });
            }}
          >
            <ToggleButton value="exact">
              {t("runs.archive.filters.exactDate")}
            </ToggleButton>

            <ToggleButton value="range">
              {t("runs.archive.filters.dateRange")}
            </ToggleButton>
          </ToggleButtonGroup>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {value.dateMode === "exact" ? (
              <DatePicker
                label={t("runs.archive.filters.date")}
                value={value.date ? dayjs(value.date) : null}
                maxDate={yesterday}
                onChange={(date) => {
                  patch({
                    date: date?.isValid() ? date.format("YYYY-MM-DD") : "",
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            ) : (
              <>
                <DatePicker
                  label={t("runs.archive.filters.fromDate")}
                  value={value.fromDate ? dayjs(value.fromDate) : null}
                  maxDate={value.toDate ? dayjs(value.toDate) : yesterday}
                  onChange={(date) => {
                    patch({
                      fromDate: date?.isValid() ? date.format("YYYY-MM-DD") : "",
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />

                <DatePicker
                  label={t("runs.archive.filters.toDate")}
                  value={value.toDate ? dayjs(value.toDate) : null}
                  minDate={value.fromDate ? dayjs(value.fromDate) : undefined}
                  maxDate={yesterday}
                  onChange={(date) => {
                    patch({
                      toDate: date?.isValid() ? date.format("YYYY-MM-DD") : "",
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </>
            )}

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.route")}
              value={value.routeId}
              disabled={optionsLoading}
              onChange={(event) => {
                patch({
                  routeId: event.target.value,
                  tripId: "",
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allRoutes")}</MenuItem>

              {routes.map((route) => (
                <MenuItem key={route.id} value={route.id}>
                  {route.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.trip")}
              value={value.tripId}
              disabled={optionsLoading}
              onChange={(event) => {
                patch({
                  tripId: event.target.value,
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allTrips")}</MenuItem>

              {availableTrips.map((trip) => (
                <MenuItem key={trip.id} value={String(trip.id)}>
                  {trip.headsign} — {trip.route.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.schedule")}
              value={value.scheduleId}
              disabled={optionsLoading}
              onChange={(event) => {
                patch({
                  scheduleId: event.target.value,
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allSchedules")}</MenuItem>

              {schedules.map((schedule) => (
                <MenuItem key={schedule.id} value={String(schedule.id)}>
                  {schedule.name} — {schedule.serviceCode}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.driver")}
              value={value.driverId}
              disabled={optionsLoading}
              onChange={(event) => {
                patch({
                  driverId: event.target.value,
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allDrivers")}</MenuItem>

              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={String(driver.id)}>
                  {driver.firstName} {driver.lastName} — {driver.phone}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.bus")}
              value={value.busId}
              disabled={optionsLoading}
              onChange={(event) => {
                patch({
                  busId: event.target.value,
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allBuses")}</MenuItem>

              {buses.map((bus) => (
                <MenuItem key={bus.id} value={String(bus.id)}>
                  {bus.plateNumber} — {bus.busCode}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label={t("runs.archive.filters.status")}
              value={value.status}
              onChange={(event) => {
                patch({
                  status: event.target.value as "" | RunStatus,
                });
              }}
            >
              <MenuItem value="">{t("runs.archive.filters.allStatuses")}</MenuItem>

              {RUN_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`runs.status.${status}`)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={value.excludeFinished}
                onChange={(event) => {
                  patch({
                    excludeFinished: event.target.checked,
                  });
                }}
              />
            }
            label={t("runs.archive.filters.excludeFinished")}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onReset}
            >
              {t("runs.archive.filters.reset")}
            </Button>

            <Button
              variant="contained"
              startIcon={<FilterAltRoundedIcon />}
              disabled={!hasValidDate}
              onClick={onApply}
            >
              {t("runs.archive.filters.apply")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RunsArchiveFilters;
