import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  tripSchema,
  type TripFormInputValues,
  type TripFormValues,
} from "../../../../schemas/organizations/tripSchemas";
import type { Bus } from "../../../../types/bus.types";
import type { OrganizationRoute } from "../../../../types/organization.types";
import type { Schedule } from "../../../../types/schedule.types";
import type { TripDriverRef } from "../../../../types/trip.types";

type TripFormProps = {
  defaultValues?: Partial<TripFormInputValues>;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
  drivers: TripDriverRef[];
  loading?: boolean;
  submitLabel: string;
  showCard?: boolean;
  disableSubmitWhenPristine?: boolean;
  onSubmit: (values: TripFormValues) => Promise<void> | void;
};

const TripForm = ({
  defaultValues,
  orgRoutes,
  schedules,
  buses,
  drivers,
  loading = false,
  submitLabel,
  showCard = false,
  disableSubmitWhenPristine = true,
  onSubmit,
}: TripFormProps) => {
  const { t } = useTranslation();

  const normalizedDefaults = useMemo<TripFormInputValues>(
    () => ({
      routeId: defaultValues?.routeId ?? "",
      scheduleId: defaultValues?.scheduleId ?? "",
      headsign: defaultValues?.headsign ?? "",
      defaultDriverId: defaultValues?.defaultDriverId ?? "",
      defaultBusId: defaultValues?.defaultBusId ?? "",
      blockId: defaultValues?.blockId ?? "",
      isActive: defaultValues?.isActive ?? true,
    }),
    [
      defaultValues?.routeId,
      defaultValues?.scheduleId,
      defaultValues?.headsign,
      defaultValues?.defaultDriverId,
      defaultValues?.defaultBusId,
      defaultValues?.blockId,
      defaultValues?.isActive,
    ],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<TripFormInputValues, unknown, TripFormValues>({
    resolver: zodResolver(tripSchema),
    mode: "onChange",
    defaultValues: normalizedDefaults,
  });

  useEffect(() => {
    reset(normalizedDefaults);
  }, [normalizedDefaults, reset]);

  const getErrorMessage = (message: unknown) => {
    return typeof message === "string" ? t(message) : undefined;
  };

  const noRoutes = orgRoutes.length === 0;
  const noSchedules = schedules.length === 0;
  const noDrivers = drivers.length === 0;
  const noBuses = buses.length === 0;

  const hasMissingRequirements = noRoutes || noSchedules || noDrivers || noBuses;

  const missingRequirementsMessage = [
    noRoutes ? t("trips.form.requireRoutesMessage") : null,
    noSchedules ? t("trips.form.requireSchedulesMessage") : null,
    noDrivers ? t("trips.form.requireDriversMessage") : null,
    noBuses ? t("trips.form.requireBusesMessage") : null,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {hasMissingRequirements && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 900 }}>
              {t("trips.form.requirementsTitle")}
            </Typography>

            <Typography variant="body2">{missingRequirementsMessage}</Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "start",

            "& .MuiFormControl-root": {
              m: 0,
            },
          }}
        >
          <Controller
            name="routeId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                required
                name={field.name}
                inputRef={field.ref}
                label={t("trips.form.route")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                error={Boolean(errors.routeId)}
                helperText={
                  getErrorMessage(errors.routeId?.message) ?? t("trips.form.routeHint")
                }
                disabled={loading || noRoutes}
              >
                <MenuItem value="" disabled>
                  {noRoutes ? t("trips.form.noRoutes") : t("trips.form.selectRoute")}
                </MenuItem>

                {orgRoutes.map((orgRoute) => (
                  <MenuItem key={orgRoute.route.id} value={orgRoute.route.id}>
                    {orgRoute.route.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="scheduleId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                required
                name={field.name}
                inputRef={field.ref}
                label={t("trips.form.schedule")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                error={Boolean(errors.scheduleId)}
                helperText={
                  getErrorMessage(errors.scheduleId?.message) ??
                  t("trips.form.scheduleHint")
                }
                disabled={loading || noSchedules}
              >
                <MenuItem value="" disabled>
                  {noSchedules
                    ? t("trips.form.noSchedules")
                    : t("trips.form.selectSchedule")}
                </MenuItem>

                {schedules.map((schedule) => (
                  <MenuItem key={schedule.id} value={String(schedule.id)}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {schedule.name}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="headsign"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label={t("trips.form.headsign")}
                placeholder={t("trips.form.headsignPlaceholder")}
                error={Boolean(errors.headsign)}
                helperText={
                  getErrorMessage(errors.headsign?.message) ??
                  t("trips.form.headsignHint")
                }
                disabled={loading}
              />
            )}
          />

          <Controller
            name="defaultDriverId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                required
                name={field.name}
                inputRef={field.ref}
                label={t("trips.form.defaultDriver")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                error={Boolean(errors.defaultDriverId)}
                helperText={
                  getErrorMessage(errors.defaultDriverId?.message) ??
                  t("trips.form.defaultDriverHint")
                }
                disabled={loading || noDrivers}
              >
                <MenuItem value="" disabled>
                  {noDrivers
                    ? t("trips.form.noDrivers")
                    : t("trips.form.selectDefaultDriver")}
                </MenuItem>

                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={String(driver.id)}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        minWidth: 0,
                        alignItems: "center",
                      }}
                    >
                      <PersonRoundedIcon fontSize="small" color="action" />

                      <Typography
                        sx={{
                          fontWeight: 800,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {driver.firstName} {driver.lastName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="defaultBusId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                required
                name={field.name}
                inputRef={field.ref}
                label={t("trips.form.defaultBus")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                error={Boolean(errors.defaultBusId)}
                helperText={
                  getErrorMessage(errors.defaultBusId?.message) ??
                  t("trips.form.defaultBusHint")
                }
                disabled={loading || noBuses}
              >
                <MenuItem value="" disabled>
                  {noBuses ? t("trips.form.noBuses") : t("trips.form.selectDefaultBus")}
                </MenuItem>

                {buses.map((bus) => (
                  <MenuItem key={bus.id} value={String(bus.id)}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        minWidth: 0,
                        alignItems: "center",
                      }}
                    >
                      <DirectionsBusRoundedIcon fontSize="small" color="action" />
                      <Typography
                        sx={{
                          fontWeight: 800,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bus.plateNumber}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{
                  m: 0,
                  px: 2,
                  minHeight: 56,
                }}
                control={
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(event) => field.onChange(event.target.checked)}
                    onBlur={field.onBlur}
                    disabled={loading}
                  />
                }
                label={t("trips.form.isActive")}
              />
            )}
          />
        </Box>

        <Accordion
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",

            "&::before": {
              display: "none",
            },

            "&.Mui-expanded": {
              m: 0,
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                {t("trips.form.advancedTitle")}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {t("trips.form.advancedDescription")}
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Controller
              name="blockId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("trips.form.blockId")}
                  placeholder={t("trips.form.blockIdPlaceholder")}
                  error={Boolean(errors.blockId)}
                  helperText={
                    getErrorMessage(errors.blockId?.message) ??
                    t("trips.form.blockIdHint")
                  }
                  disabled={loading}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>

        <Alert severity="info" sx={{ borderRadius: 2 }}>
          {t("trips.form.setupAfterCreate")}
        </Alert>

        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveRoundedIcon />
              )
            }
            disabled={
              loading ||
              !isValid ||
              hasMissingRequirements ||
              (disableSubmitWhenPristine && !isDirty)
            }
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 170,
              },
              minHeight: 44,
              borderRadius: 2,
            }}
          >
            {loading ? t("common.saving") : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 3 },

          "&:last-child": {
            pb: { xs: 2, md: 3 },
          },
        }}
      >
        {content}
      </CardContent>
    </Card>
  );
};

export default TripForm;
