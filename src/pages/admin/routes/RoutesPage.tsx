import { useMemo, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnFiltersState } from "material-react-table";

import Table from "../../../components/Table";
import { getRoutesTableColumns } from "../../../tables-def/routes";
import { getRoutesCard } from "../../../card-def/routes";
import { useRoutes } from "../../../hooks/locations/useRoutes";
import { usePlaces } from "../../../hooks/locations/usePlaces";
import { useCursorPagination } from "../../../hooks/common/useCursorPagination";
import type { Place } from "../../../types/place.types";
import type { TransitMode, TransitRoute } from "../../../types/route.types";
import CreateRoute from "./components/CreateRoute";

const DEFAULT_ROUTES_LIMIT = 20;

const getFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
};

const RoutesPage = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>([]);

  const cursorPagination = useCursorPagination({
    initialPageSize: DEFAULT_ROUTES_LIMIT,
  });

  const places = usePlaces({
    limit: 100,
  });

  const placesData = useMemo<Place[]>(() => {
    return places.data?.data ?? [];
  }, [places.data?.data]);

  const originPlaceIdValue = getFilterValue(columnFilters, "originPlaceId");
  const destinationPlaceIdValue = getFilterValue(
    columnFilters,
    "destinationPlaceId",
  );
  const modeValue = getFilterValue(columnFilters, "mode");

  const originPlaceId = originPlaceIdValue
    ? Number(originPlaceIdValue)
    : undefined;

  const destinationPlaceId = destinationPlaceIdValue
    ? Number(destinationPlaceIdValue)
    : undefined;

  const mode = modeValue ? (modeValue as TransitMode) : undefined;

  const routes = useRoutes({
    cursor: cursorPagination.cursor,
    limit: cursorPagination.limit,
    search: search.trim() || undefined,
    originPlaceId,
    destinationPlaceId,
    mode,
  });

  const tablePagination = cursorPagination.getPaginationProps({
    dataLength: routes.data?.data.length ?? 0,
    hasNextPage: routes.data?.meta.hasNextPage ?? false,
    nextCursor: routes.data?.meta.nextCursor,
  });

  const columns = useMemo(
    () =>
      getRoutesTableColumns({
        t,
        places: placesData,
      }),
    [t, placesData],
  );

  const renderRouteCard = useMemo(
    () =>
      getRoutesCard({
        t,
        places: placesData,
      }),
    [t, placesData],
  );

  const exportFields = useMemo<Array<keyof TransitRoute & string>>(
    () => [
      "id",
      "name",
      "originPlaceId",
      "destinationPlaceId",
      "mode",
      "length",
      "createdAt",
      "updatedAt",
    ],
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
    setColumnFilters((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );

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
            <AltRouteRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("routes.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("routes.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <CreateRoute />
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
          <Table<TransitRoute>
            columns={columns}
            data={routes.data?.data ?? []}
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
            renderMobileCard={renderRouteCard}
            state={{
              isLoading:
                routes.isLoading ||
                routes.isFetching ||
                places.isLoading ||
                places.isFetching,
              showAlertBanner: routes.isError,
              pagination: tablePagination.pagination,
              globalFilter: search,
              columnFilters,
            }}
            isError={routes.isError}
            refetch={routes.refetch}
            isRefetching={routes.isRefetching}
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

export default RoutesPage;