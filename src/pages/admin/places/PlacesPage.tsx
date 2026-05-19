import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnFiltersState } from "material-react-table";

import Table from "../../../components/Table";
import {
  getPlacesTableColumns,
  type PlaceTableRow,
} from "../../../tables-def/places";
import { getPlacesCard } from "../../../card-def/places";
import { usePlaces } from "../../../hooks/locations/usePlaces";
import { useCursorPagination } from "../../../hooks/common/useCursorPagination";
import type { Place } from "../../../types/place.types";
import CreatePlace from "./components/CreatePlace";
import { useCountries } from "../../../hooks/locations/useCountries";
import { useGovernates } from "../../../hooks/locations/useGovernates";
import type { Country } from "../../../types/country.types";
import type { Governate } from "../../../types/governate.types";
import PlacesMapDialog from "./components/PlacesMapDialog";


const DEFAULT_PLACES_LIMIT = 20;

const resolveResponseData = <T,>(
  response: T[] | { data: T[] } | undefined,
): T[] => {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  return response.data;
};

const getFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
};

const PlacesPage = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>([]);

  const cursorPagination = useCursorPagination({
    initialPageSize: DEFAULT_PLACES_LIMIT,
  });

  const countries = useCountries();

  const countriesData = resolveResponseData<Country>(countries.data);

  const selectedCountryIdValue = getFilterValue(columnFilters, "countryId");
  const selectedGovernateIdValue = getFilterValue(columnFilters, "governateId");

  const countryId = selectedCountryIdValue
    ? Number(selectedCountryIdValue)
    : undefined;

  const governateId = selectedGovernateIdValue
    ? Number(selectedGovernateIdValue)
    : undefined;

  const governates = useGovernates({
    countryId,
  });

  const governatesData = resolveResponseData<Governate>(governates.data);

  const governateCountryMap = useMemo(() => {
    return new Map(
      governatesData.map((governate) => [governate.id, governate.countryId]),
    );
  }, [governatesData]);

  const places = usePlaces({
    cursor: cursorPagination.cursor,
    limit: cursorPagination.limit,
    search: search.trim() || undefined,
    countryId,
    governateId,
  });

  const tablePagination = cursorPagination.getPaginationProps({
    dataLength: places.data?.data.length ?? 0,
    hasNextPage: places.data?.meta.hasNextPage ?? false,
    nextCursor: places.data?.meta.nextCursor,
  });

  const tableData = useMemo<PlaceTableRow[]>(() => {
    return (places.data?.data ?? []).map((place) => ({
      ...place,
      countryId: governateCountryMap.get(place.governateId) ?? countryId,
    }));
  }, [places.data?.data, governateCountryMap, countryId]);

  const columns = useMemo(
    () =>
      getPlacesTableColumns({
        t,
        countries: countriesData,
        governates: governatesData,
      }),
    [t, countriesData, governatesData],
  );

  const renderPlaceCard = useMemo(
    () =>
      getPlacesCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Place & string>>(
    () => ["id", "name", "governateId", "createdAt", "updatedAt"],
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    cursorPagination.reset();
  };

  const handleColumnFiltersChange = (
    updater:
      | MRT_ColumnFiltersState
      | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState),
  ) => {
    setColumnFilters((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;

      const oldCountryId = getFilterValue(current, "countryId");
      const nextCountryId = getFilterValue(next, "countryId");

      if (oldCountryId !== nextCountryId) {
        return next.filter((filter) => filter.id !== "governateId");
      }

      return next;
    });

    cursorPagination.reset();
  };

    const updateMobileFilter = (id: "countryId" | "governateId", value: string) => {
  setColumnFilters((current) => {
    const withoutCurrent = current.filter((filter) => filter.id !== id);

    let next = value
      ? [
          ...withoutCurrent,
          {
            id,
            value,
          },
        ]
      : withoutCurrent;

    if (id === "countryId") {
      next = next.filter((filter) => filter.id !== "governateId");
    }

    return next;
  });

  cursorPagination.reset();
};
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
            <PlaceRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("places.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("places.subtitle")}
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
            <PlacesMapDialog
                places={tableData}
                loading={places.isLoading || places.isFetching}
                pageIndex={tablePagination.pagination.pageIndex}
                hasNextPage={Boolean(places.data?.meta.hasNextPage)}
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

            <CreatePlace />
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
          <Table<PlaceTableRow>
            columns={columns}
            data={tableData}
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
            renderMobileCard={renderPlaceCard}
            renderMobileFilters={
                <Stack spacing={1.5}>
                    <TextField
                    select
                    fullWidth
                    size="small"
                    label={t("places.filters.country")}
                    value={selectedCountryIdValue}
                    onChange={(event) => {
                        updateMobileFilter("countryId", event.target.value);
                    }}
                    disabled={countries.isLoading}
                    >
                    <MenuItem value="">{t("places.filters.allCountries")}</MenuItem>

                    {countriesData.map((country) => (
                        <MenuItem key={country.id} value={String(country.id)}>
                        {country.name}
                        </MenuItem>
                    ))}
                    </TextField>

                    <TextField
                    select
                    fullWidth
                    size="small"
                    label={t("places.filters.governate")}
                    value={selectedGovernateIdValue}
                    onChange={(event) => {
                        updateMobileFilter("governateId", event.target.value);
                    }}
                    disabled={governates.isLoading}
                    >
                    <MenuItem value="">{t("places.filters.allGovernates")}</MenuItem>

                    {governatesData.map((governate) => (
                        <MenuItem key={governate.id} value={String(governate.id)}>
                        {governate.name}
                        </MenuItem>
                    ))}
                    </TextField>
                </Stack>
            }
            state={{
              isLoading:
              places.isLoading ||
              places.isFetching ||
              countries.isLoading ||
              governates.isLoading,
              showAlertBanner: places.isError,
              pagination: tablePagination.pagination,
              globalFilter: search,
              columnFilters,
            }}
            isError={places.isError}
            refetch={places.refetch}
            isRefetching={places.isRefetching}
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
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PlacesPage;