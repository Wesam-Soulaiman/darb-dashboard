import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  routeSchema,
  transitModes,
  type RouteFormInputValues,
  type RouteFormValues,
} from "../../../../schemas/locations/routeSchemas";
import { usePlaces } from "../../../../hooks/locations/usePlaces";
import type { Place } from "../../../../types/place.types";
import SelectRouteLineMap from "./SelectRouteLineMap";

type RouteFormProps = {
  defaultValues?: Partial<RouteFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: RouteFormValues) => Promise<void> | void;
};

type MapPoint = [number, number]; // [lat, lon]

const toMapPoints = (coordinates?: [number, number][]): MapPoint[] => {
  return (coordinates ?? []).map((point) => [point[1], point[0]]);
};

const toLineCoordinates = (points: MapPoint[]): [number, number][] => {
  return points.map((point) => [point[1], point[0]]);
};

const RouteForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: RouteFormProps) => {
  const { t } = useTranslation();

  const places = usePlaces({
    limit: 100,
  });

  const placesData: Place[] = places.data?.data ?? [];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<RouteFormInputValues, unknown, RouteFormValues>({
    resolver: zodResolver(routeSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      originPlaceId: defaultValues?.originPlaceId ?? "",
      destinationPlaceId: defaultValues?.destinationPlaceId ?? "",
      mode: defaultValues?.mode ?? "bus",
      price: defaultValues?.price ?? {
        amount: "",
        currency: "SYP",
      },
      line: defaultValues?.line ?? {
        type: "LineString",
        coordinates: [],
      },
    },
  });

  const line = useWatch({
    control,
    name: "line",
  });

  const linePoints = toMapPoints(line?.coordinates);

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("routes.form.name")}
                  error={Boolean(errors.name)}
                  helperText={getErrorMessage(errors.name?.message)}
                />
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="originPlaceId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label={t("routes.form.originPlace")}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    error={Boolean(errors.originPlaceId)}
                    helperText={getErrorMessage(errors.originPlaceId?.message)}
                    disabled={places.isLoading}
                  >
                    <MenuItem value="">{t("routes.form.selectOriginPlace")}</MenuItem>

                    {placesData.map((place) => (
                      <MenuItem key={place.id} value={place.id}>
                        {place.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="destinationPlaceId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label={t("routes.form.destinationPlace")}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    error={Boolean(errors.destinationPlaceId)}
                    helperText={getErrorMessage(errors.destinationPlaceId?.message)}
                    disabled={places.isLoading}
                  >
                    <MenuItem value="">
                      {t("routes.form.selectDestinationPlace")}
                    </MenuItem>

                    {placesData.map((place) => (
                      <MenuItem key={place.id} value={place.id}>
                        {place.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label={t("routes.form.mode")}
                    value={field.value ?? "bus"}
                    onChange={(event) => field.onChange(event.target.value)}
                    error={Boolean(errors.mode)}
                    helperText={getErrorMessage(errors.mode?.message)}
                  >
                    {transitModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {t(`routes.modes.${mode}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="price.amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label={t("routes.form.price")}
                    error={Boolean(errors.price?.amount)}
                    helperText={getErrorMessage(errors.price?.amount?.message)}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>{t("routes.form.line")}</Typography>

              <TextField
                fullWidth
                disabled
                value={t("routes.form.pointsCount", {
                  count: linePoints.length,
                })}
                error={Boolean(errors.line)}
                helperText={getErrorMessage(
                  errors.line?.coordinates?.message ?? errors.line?.message,
                )}
              />

              <SelectRouteLineMap
                points={linePoints}
                onSelectLine={(points: MapPoint[]) => {
                  setValue(
                    "line",
                    {
                      type: "LineString",
                      coordinates: toLineCoordinates(points),
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                disabled={!isValid || loading || !isDirty}
              >
                {loading ? t("common.saving") : submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
