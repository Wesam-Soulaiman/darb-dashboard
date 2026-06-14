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

type TripFormProps = {
  defaultValues?: Partial<TripFormInputValues>;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
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
      defaultBusId: defaultValues?.defaultBusId ?? "",
      blockId: defaultValues?.blockId ?? "",
      isActive: defaultValues?.isActive ?? true,
    }),
    [
      defaultValues?.routeId,
      defaultValues?.scheduleId,
      defaultValues?.headsign,
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

  const content = (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {(noRoutes || noSchedules) && (
          <Alert severity="warning">
            <Typography sx={{ fontWeight: 900 }}>
              {t("trips.form.requirementsTitle")}
            </Typography>

            <Typography variant="body2">
              {noRoutes ? t("trips.form.requireRoutesMessage") : ""}

              {noRoutes && noSchedules ? " " : ""}

              {noSchedules ? t("trips.form.requireSchedulesMessage") : ""}
            </Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
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
                label={t("trips.form.route")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                error={Boolean(errors.routeId)}
                helperText={
                  getErrorMessage(errors.routeId?.message) ??
                  t("trips.form.routeHint")
                }
                disabled={loading || noRoutes}
              >
                {noRoutes ? (
                  <MenuItem value="" disabled>
                    {t("trips.form.noRoutes")}
                  </MenuItem>
                ) : (
                  orgRoutes.map((orgRoute) => (
                    <MenuItem
                      key={orgRoute.route.id}
                      value={orgRoute.route.id}
                    >
                      {orgRoute.route.name}
                    </MenuItem>
                  ))
                )}
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
                label={t("trips.form.schedule")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                error={Boolean(errors.scheduleId)}
                helperText={
                  getErrorMessage(errors.scheduleId?.message) ??
                  t("trips.form.scheduleHint")
                }
                disabled={loading || noSchedules}
              >
                {noSchedules ? (
                  <MenuItem value="" disabled>
                    {t("trips.form.noSchedules")}
                  </MenuItem>
                ) : (
                  schedules.map((schedule) => (
                    <MenuItem key={schedule.id} value={String(schedule.id)}>
                      <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 800 }}>
                          {schedule.name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))
                )}
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
            name="defaultBusId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label={t("trips.form.defaultBus")}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                error={Boolean(errors.defaultBusId)}
                helperText={
                  getErrorMessage(errors.defaultBusId?.message) ??
                  t("trips.form.defaultBusHint")
                }
                disabled={loading}
              >
                <MenuItem value="">
                  {t("trips.form.noDefaultBus")}
                </MenuItem>

                {buses.map((bus) => (
                  <MenuItem key={bus.id} value={String(bus.id)}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <DirectionsBusRoundedIcon fontSize="small" />

                      <span>
                        {bus.plateNumber} — {bus.busCode}
                      </span>
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
            "&::before": {
              display: "none",
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

        <Alert severity="info">
          {t("trips.form.setupAfterCreate")}
        </Alert>

        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
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
              noRoutes ||
              noSchedules ||
              (disableSubmitWhenPristine && !isDirty)
            }
            sx={{
              borderRadius: 2,
              minWidth: 170,
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
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {content}
      </CardContent>
    </Card>
  );
};

export default TripForm;