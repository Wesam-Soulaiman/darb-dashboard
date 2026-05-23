import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SignpostRoundedIcon from "@mui/icons-material/SignpostRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnFiltersState } from "material-react-table";

import Table from "../../../components/Table";
import { getStopsTableColumns } from "../../../tables-def/stops";
import { getStopsCard } from "../../../card-def/stops";
import { useStops } from "../../../hooks/locations/useStops";
import { usePlaces } from "../../../hooks/locations/usePlaces";
import { useCursorPagination } from "../../../hooks/common/useCursorPagination";
import { useMyLocationContext } from "../../../contexts/MyLocationContext";
import { encodeGeoJsonPoint } from "../../../utils/geojson";
import type { Stop } from "../../../types/stop.types";
import type { Place } from "../../../types/place.types";
import CreateStop from "./components/CreateStop";
import StopsMapDialog from "./components/StopsMapDialog";

const DEFAULT_STOPS_LIMIT = 20;
const DEFAULT_WITHIN_RADIUS = 1000;

const getFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
};

const StopsPage = () => {
  const { t } = useTranslation();

  const {
    location,
    requestLocation,
    isLoading: isLocationLoading,
  } = useMyLocationContext();

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>([]);

  const [within, setWithin] = useState<string | undefined>(undefined);
  const [withinRadius, setWithinRadius] = useState(DEFAULT_WITHIN_RADIUS);
  const [waitingForLocationSearch, setWaitingForLocationSearch] =
    useState(false);

  const cursorPagination = useCursorPagination({
    initialPageSize: DEFAULT_STOPS_LIMIT,
  });

  const places = usePlaces({
    limit: 100,
  });

  const placesData = useMemo<Place[]>(() => {
    return places.data?.data ?? [];
  }, [places.data?.data]);

  const selectedPlaceIdValue = getFilterValue(columnFilters, "placeId");

  const placeId = selectedPlaceIdValue
    ? Number(selectedPlaceIdValue)
    : undefined;

  const stops = useStops({
    cursor: cursorPagination.cursor,
    limit: cursorPagination.limit,
    search: search.trim() || undefined,
    placeId,
    within,
    withinRadius: within ? withinRadius : undefined,
  });

  const tablePagination = cursorPagination.getPaginationProps({
    dataLength: stops.data?.data.length ?? 0,
    hasNextPage: stops.data?.meta.hasNextPage ?? false,
    nextCursor: stops.data?.meta.nextCursor,
  });

  const columns = useMemo(
    () =>
      getStopsTableColumns({
        t,
        places: placesData,
      }),
    [t, placesData],
  );

  const renderStopCard = useMemo(
    () =>
      getStopsCard({
        t,
        places: placesData,
      }),
    [t, placesData],
  );

  const exportFields = useMemo<Array<keyof Stop & string>>(
    () => ["id", "placeId", "name", "createdAt", "updatedAt"],
    [],
  );

  const applySearchAroundLocation = useCallback(
    (lat: number, lon: number) => {
      setWithin(encodeGeoJsonPoint(lat, lon));
      cursorPagination.reset();
    },
    [cursorPagination],
  );

  const handleSearchAroundMe = () => {
    if (!location) {
      setWaitingForLocationSearch(true);
      requestLocation();
      return;
    }

    applySearchAroundLocation(location.lat, location.lon);
  };

  const handleClearLocationSearch = () => {
    setWithin(undefined);
    setWaitingForLocationSearch(false);
    cursorPagination.reset();
  };

  useEffect(() => {
    if (!waitingForLocationSearch || !location) {
      return;
    }

    applySearchAroundLocation(location.lat, location.lon);
    setWaitingForLocationSearch(false);
  }, [waitingForLocationSearch, location, applySearchAroundLocation]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    cursorPagination.reset();
  };

  const handleColumnFiltersChange = (
    updater:
      | MRT_ColumnFiltersState
      | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState),
  ) => {
    setColumnFilters((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );

    cursorPagination.reset();
  };

  const handleRadiusChange = (value: string) => {
    const nextRadius = Number(value);

    setWithinRadius(nextRadius > 0 ? nextRadius : DEFAULT_WITHIN_RADIUS);

    if (within) {
      cursorPagination.reset();
    }
  };

  const radiusTextField = (
    <TextField
      type="number"
      size="small"
      label={t("stops.filters.radius")}
      value={withinRadius}
      onChange={(event) => handleRadiusChange(event.target.value)}
      slotProps={{
        htmlInput: {
          min: 100,
          step: 100,
        },
      }}
      sx={{
        width: { xs: "100%", md: 180 },
      }}
    />
  );

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <SignpostRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("stops.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("stops.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
                alignItems: { xs: "stretch", sm: "center" },
            }}
            >
            <StopsMapDialog
                stops={stops.data?.data ?? []}
                places={placesData}
                loading={stops.isLoading || stops.isFetching}
                pageIndex={tablePagination.pagination.pageIndex}
                hasNextPage={Boolean(stops.data?.meta.hasNextPage)}
                hasPreviousPage={tablePagination.pagination.pageIndex > 0}
                onNextPage={() => {
                tablePagination.onPaginationChange((current) => ({
                    ...current,
                    pageIndex: current.pageIndex + 1,
                }));
                }}
                onPreviousPage={() => {
                tablePagination.onPaginationChange((current) => ({
                    ...current,
                    pageIndex: Math.max(0, current.pageIndex - 1),
                }));
                }}
            />

            <CreateStop />
            </Stack>
      </Stack>

      <Card
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <Button
                  variant={within ? "contained" : "outlined"}
                  startIcon={<MyLocationRoundedIcon />}
                  onClick={handleSearchAroundMe}
                  disabled={isLocationLoading || stops.isFetching}
                >
                  {isLocationLoading
                    ? t("location.prepare")
                    : t("stops.actions.searchAroundMe")}
                </Button>

                {within && (
                  <Button
                    color="inherit"
                    variant="outlined"
                    startIcon={<ClearRoundedIcon />}
                    onClick={handleClearLocationSearch}
                    disabled={stops.isFetching}
                  >
                    {t("stops.actions.clearAroundMe")}
                  </Button>
                )}
              </Stack>

              {radiusTextField}
            </Stack>

            {within && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {t("stops.filters.searchingAroundMe", {
                  radius: withinRadius,
                })}
              </Typography>
            )}

            <Table<Stop>
              columns={columns}
              data={stops.data?.data ?? []}
              exportFields={exportFields}
              enableExport
              enablePagination
              manualPagination
              rowCount={tablePagination.rowCount}
              onPaginationChange={tablePagination.onPaginationChange}
              enableGlobalFilter
              enableColumnFilters
              manualFiltering
              onGlobalFilterChange={(value) => handleSearchChange(String(value))}
              onColumnFiltersChange={handleColumnFiltersChange}
              mobileSearchFields={["name"]}
              mobilePageSize={cursorPagination.pagination.pageSize}
              renderMobileCard={renderStopCard}
              renderMobileFilters={
                <Stack spacing={1.5}>
                  <Button
                    variant={within ? "contained" : "outlined"}
                    startIcon={<MyLocationRoundedIcon />}
                    onClick={handleSearchAroundMe}
                    disabled={isLocationLoading || stops.isFetching}
                    fullWidth
                  >
                    {isLocationLoading
                      ? t("location.prepare")
                      : t("stops.actions.searchAroundMe")}
                  </Button>

                  {within && (
                    <Button
                      color="inherit"
                      variant="outlined"
                      startIcon={<ClearRoundedIcon />}
                      onClick={handleClearLocationSearch}
                      disabled={stops.isFetching}
                      fullWidth
                    >
                      {t("stops.actions.clearAroundMe")}
                    </Button>
                  )}

                  <TextField
                    type="number"
                    size="small"
                    label={t("stops.filters.radius")}
                    value={withinRadius}
                    onChange={(event) =>
                      handleRadiusChange(event.target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        min: 100,
                        step: 100,
                      },
                    }}
                    fullWidth
                  />

                  {within && (
                    <Typography variant="body2" color="text.secondary">
                      {t("stops.filters.searchingAroundMe", {
                        radius: withinRadius,
                      })}
                    </Typography>
                  )}
                </Stack>
              }
              state={{
                isLoading:
                  stops.isLoading ||
                  stops.isFetching ||
                  places.isLoading ||
                  places.isFetching,
                showAlertBanner: stops.isError,
                pagination: tablePagination.pagination,
                globalFilter: search,
                columnFilters,
              }}
              isError={stops.isError}
              refetch={stops.refetch}
              isRefetching={stops.isRefetching}
              initialState={{
                showGlobalFilter: false,
                showColumnFilters: true,
              }}
              muiPaginationProps={{
                rowsPerPageOptions: [10, 20, 50],
                showFirstButton: false,
                showLastButton: false,
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default StopsPage;