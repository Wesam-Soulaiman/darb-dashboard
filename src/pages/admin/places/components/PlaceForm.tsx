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
  placeSchema,
  type PlaceFormInputValues,
  type PlaceFormValues,
} from "../../../../schemas/locations/placeSchemas";
import { useCountries } from "../../../../hooks/locations/useCountries";
import { useGovernates } from "../../../../hooks/locations/useGovernates";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";
import SelectPlacePointMap from "./SelectPlacePointMap";
import type { Country } from "../../../../types/country.types";
import type { Governate } from "../../../../types/governate.types";

type PlaceFormProps = {
  defaultValues?: Partial<PlaceFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: PlaceFormValues) => Promise<void> | void;
};

const DEFAULT_CENTER: [number, number] = [33.5138, 36.2765];

const resolveResponseData = <T,>(
  response: T[] | { data: T[] } | undefined,
): T[] => {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  return response.data;
};

const PlaceForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: PlaceFormProps) => {
  const { t } = useTranslation();
  const { location, requestLocation } = useMyLocationContext();

  const countries = useCountries();

  const initialLat =
    defaultValues?.center?.coordinates?.[1] ??
    location?.lat ??
    DEFAULT_CENTER[0];

  const initialLon =
    defaultValues?.center?.coordinates?.[0] ??
    location?.lon ??
    DEFAULT_CENTER[1];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<PlaceFormInputValues, unknown, PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      countryId: defaultValues?.countryId ?? "",
      governateId: defaultValues?.governateId ?? "",
      center: defaultValues?.center ?? {
        type: "Point",
        coordinates: [initialLon, initialLat],
      },
    },
  });

  const countryId = useWatch({
    control,
    name: "countryId",
  });

  const center = useWatch({
    control,
    name: "center",
  });

  const governates = useGovernates({
    countryId: countryId ? Number(countryId) : undefined,
  });

  const countriesData = resolveResponseData<Country>(countries.data);
  const governatesData = resolveResponseData<Governate>(governates.data);

  const lat = center?.coordinates?.[1] ?? initialLat;
  const lon = center?.coordinates?.[0] ?? initialLon;

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
      "center",
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
        borderRadius: 4,
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
                  label={t("places.form.name")}
                  error={Boolean(errors.name)}
                  helperText={getErrorMessage(errors.name?.message)}
                />
              )}
            />

            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label={t("places.form.country")}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value || "");
                    setValue("governateId", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  disabled={countries.isLoading}
                >
                  <MenuItem value="">{t("places.form.selectCountry")}</MenuItem>

                  {countriesData.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="governateId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  required
                  label={t("places.form.governate")}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  error={Boolean(errors.governateId)}
                  helperText={getErrorMessage(errors.governateId?.message)}
                  disabled={governates.isLoading}
                >
                  <MenuItem value="">
                    {t("places.form.selectGovernate")}
                  </MenuItem>

                  {governatesData.map((governate) => (
                    <MenuItem key={governate.id} value={governate.id}>
                      {governate.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>
                {t("places.form.center")}
              </Typography>

              <TextField
                fullWidth
                disabled
                value={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
                label={t("places.form.mapLink")}
              />

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <SelectPlacePointMap
                  point={[lat, lon]}
                  onSelectPoint={(point) => {
                    setValue(
                      "center",
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

export default PlaceForm;