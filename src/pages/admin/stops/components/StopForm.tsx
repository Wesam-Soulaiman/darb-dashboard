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
  stopSchema,
  type StopFormInputValues,
  type StopFormValues,
} from "../../../../schemas/locations/stopSchemas";
import { usePlaces } from "../../../../hooks/locations/usePlaces";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";
import SelectStopPointMap from "./SelectStopPointMap";
import type { Place } from "../../../../types/place.types";

type StopFormProps = {
  defaultValues?: Partial<StopFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: StopFormValues) => Promise<void> | void;
};

type MapPoint = [number, number]; // [lat, lon]

const DEFAULT_CENTER: MapPoint = [33.5138, 36.2765];

const StopForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: StopFormProps) => {
  const { t } = useTranslation();
  const { location, requestLocation } = useMyLocationContext();

  const places = usePlaces({
    limit: 100,
  });

  const placesData: Place[] = places.data?.data ?? [];

  const initialLat =
    defaultValues?.coordinates?.coordinates?.[1] ?? location?.lat ?? DEFAULT_CENTER[0];

  const initialLon =
    defaultValues?.coordinates?.coordinates?.[0] ?? location?.lon ?? DEFAULT_CENTER[1];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<StopFormInputValues, unknown, StopFormValues>({
    resolver: zodResolver(stopSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      placeId: defaultValues?.placeId ?? "",
      coordinates: defaultValues?.coordinates ?? {
        type: "Point",
        coordinates: [initialLon, initialLat],
      },
    },
  });

  const coordinates = useWatch({
    control,
    name: "coordinates",
  });

  const lat = coordinates?.coordinates?.[1] ?? initialLat;
  const lon = coordinates?.coordinates?.[0] ?? initialLon;

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  const handleUseMyLocation = () => {
    if (!location) {
      requestLocation();
      return;
    }

    setValue(
      "coordinates",
      {
        type: "Point",
        coordinates: [location.lon, location.lat],
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
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
                  label={t("stops.form.name")}
                  error={Boolean(errors.name)}
                  helperText={getErrorMessage(errors.name?.message)}
                />
              )}
            />

            <Controller
              name="placeId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  required
                  label={t("stops.form.place")}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  error={Boolean(errors.placeId)}
                  helperText={getErrorMessage(errors.placeId?.message)}
                  disabled={places.isLoading}
                >
                  <MenuItem value="">{t("stops.form.selectPlace")}</MenuItem>

                  {placesData.map((place) => (
                    <MenuItem key={place.id} value={place.id}>
                      {place.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>
                {t("stops.form.coordinates")}
              </Typography>

              <TextField
                fullWidth
                disabled
                value={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
                label={t("stops.form.mapLink")}
              />

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <SelectStopPointMap
                  point={[lat, lon]}
                  onSelectPoint={(point: MapPoint) => {
                    setValue(
                      "coordinates",
                      {
                        type: "Point",
                        coordinates: [point[1], point[0]],
                      },
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }}
                />

                <Button variant="outlined" onClick={handleUseMyLocation}>
                  {t("location.actions.useMyLocation")}
                </Button>
              </Stack>
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

export default StopForm;
