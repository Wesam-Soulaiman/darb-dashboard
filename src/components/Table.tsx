import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { generateCsv, mkConfig, download } from "export-to-csv";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MRT_Localization_AR } from "material-react-table/locales/ar";
import { useTranslation } from "react-i18next";

import MobileCardsView from "./MobileCardsView";
import LoadingDataError from "./LoadingDataError";

type ExportField<T extends MRT_RowData> = keyof T & string;
type CsvConfig = Parameters<typeof mkConfig>[0];

type CsvAcceptedData = string | number | boolean | null | undefined;
type CsvRow = Record<string, CsvAcceptedData>;

type AppTableProps<T extends MRT_RowData> = Omit<
  MRT_TableOptions<T>,
  "columns" | "data"
> & {
  columns?: MRT_ColumnDef<T>[];
  data?: T[];
  exportFields?: ExportField<T>[];
  exportConfig?: Partial<CsvConfig>;
  enableExport?: boolean;

  isError?: boolean;
  refetch?: () => void;
  isRefetching?: boolean;

  renderMobileCard?: (item: T) => React.ReactNode;
  mobileSearchFields?: ExportField<T>[];
  mobilePageSize?: number;
  renderMobileFilters?: React.ReactNode;
};

const toCsvValue = (value: unknown): CsvAcceptedData => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value == null
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
};

const Table = <T extends MRT_RowData>({
  columns,
  data,

  exportFields,
  exportConfig,
  enableExport = true,

  isError = false,
  refetch,
  isRefetching = false,

  renderMobileCard,
  mobileSearchFields,
  mobilePageSize = 10,
  renderMobileFilters,

  renderRowActions,

  enablePagination = false,
  enableGlobalFilter = true,
  enableSorting = false,
  enableColumnFilters = false,

  manualPagination = false,
  manualFiltering = false,
  manualSorting = false,

  rowCount,
  state,
  initialState,

  onPaginationChange,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,

  ...props
}: AppTableProps<T>) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [customSearchOpen, setCustomSearchOpen] = useState(false);
  const [customSearch, setCustomSearch] = useState("");

  const safeColumns = useMemo<MRT_ColumnDef<T>[]>(() => {
    return Array.isArray(columns) ? columns : [];
  }, [columns]);

  const safeData = useMemo<T[]>(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const activeSearchValue = manualFiltering
    ? String(state?.globalFilter ?? "")
    : customSearch;

  const filteredSafeData = useMemo(() => {
    if (manualFiltering) {
      return safeData;
    }

    const value = customSearch.trim().toLowerCase();

    if (!value) {
      return safeData;
    }

    return safeData.filter((item) => {
      if (mobileSearchFields?.length) {
        return mobileSearchFields.some((field) => {
          const fieldValue = item[field];

          if (fieldValue === null || fieldValue === undefined) {
            return false;
          }

          return String(fieldValue).toLowerCase().includes(value);
        });
      }

      return Object.values(item).some((fieldValue) => {
        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }

        return String(fieldValue).toLowerCase().includes(value);
      });
    });
  }, [safeData, customSearch, manualFiltering, mobileSearchFields]);

  const tableState = useMemo(
    () => ({
      ...state,
      showProgressBars: state?.isLoading,
      ...(manualPagination && state?.pagination ? { pagination: state.pagination } : {}),
      ...(manualFiltering && state?.columnFilters
        ? { columnFilters: state.columnFilters }
        : {}),
      ...(manualSorting && state?.sorting ? { sorting: state.sorting } : {}),
    }),
    [state, manualPagination, manualFiltering, manualSorting],
  );

  const csvConfig = useMemo(
    () =>
      mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "table-export",
        ...exportConfig,
      }),
    [exportConfig],
  );

  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData: CsvRow[] = rows.map((row) => {
      if (!exportFields?.length) {
        return Object.entries(row.original).reduce<CsvRow>((acc, [key, value]) => {
          acc[key] = toCsvValue(value);
          return acc;
        }, {});
      }

      return exportFields.reduce<CsvRow>((acc, field) => {
        const localizedField = `${field}_ar` as keyof T;
        const value = row.original[localizedField] ?? row.original[field];

        acc[field] = toCsvValue(value);

        return acc;
      }, {});
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const shouldShowTopToolbar = enableExport || enableGlobalFilter;

  const table = useMaterialReactTable<T>({
    ...props,

    columns: safeColumns,
    data: filteredSafeData,

    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnOrdering: false,

    enableColumnFilters,
    enableGlobalFilter: false,

    manualFiltering,
    ...(manualFiltering
      ? {
          onColumnFiltersChange,
        }
      : {}),

    enableSorting,
    manualSorting,
    ...(manualSorting ? { onSortingChange } : {}),

    enablePagination,
    manualPagination,
    ...(manualPagination
      ? {
          rowCount,
          onPaginationChange,
        }
      : {}),

    enableRowActions: Boolean(renderRowActions),
    renderRowActions,

    enableTopToolbar: shouldShowTopToolbar,

    localization:
      i18n.resolvedLanguage === "ar"
        ? {
            ...MRT_Localization_AR,
            rowsPerPage: t("table.rowsPerPage"),
          }
        : undefined,

    initialState: {
      ...initialState,
      showGlobalFilter: false,
    },

    state: tableState,

    muiToolbarAlertBannerProps:
      isError && refetch
        ? {
            color: "error",
            children: <LoadingDataError refetch={refetch} loading={isRefetching} />,
          }
        : undefined,

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      },
    },

    muiTableContainerProps: {
      sx: {
        borderRadius: 0,
      },
    },

    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700,
        whiteSpace: "nowrap",
      },
    },

    muiTableBodyCellProps: {
      align: "right",
      style: {
        textAlign: "right",
      },
      sx: {
        whiteSpace: "nowrap",
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {enableGlobalFilter && (
          <>
            <Tooltip title={t("table.search")}>
              <IconButton
                onClick={() => {
                  setCustomSearchOpen((prev) => !prev);
                }}
              >
                {customSearchOpen ? <CloseRoundedIcon /> : <SearchRoundedIcon />}
              </IconButton>
            </Tooltip>

            {customSearchOpen && (
              <TextField
                value={activeSearchValue}
                onChange={(event) => {
                  const value = event.target.value;

                  if (manualFiltering) {
                    onGlobalFilterChange?.(value);
                    return;
                  }

                  setCustomSearch(value);
                }}
                placeholder={t("table.search")}
                size="small"
                autoFocus
                sx={{
                  minWidth: { xs: "100%", sm: 260 },
                }}
              />
            )}
          </>
        )}

        {enableExport && (
          <Button
            variant="outlined"
            onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          >
            {t("table.exportCSV")}
          </Button>
        )}
      </Box>
    ),
  });

  if (isMobile && renderMobileCard) {
    return (
      <MobileCardsView<T>
        data={safeData}
        renderCard={renderMobileCard}
        renderFilters={renderMobileFilters}
        searchFields={mobileSearchFields}
        pageSize={mobilePageSize}
        enableSearch={enableGlobalFilter}
        isLoading={Boolean(state?.isLoading)}
        isError={isError}
        refetch={refetch}
        isRefetching={isRefetching}
        manualFiltering={manualFiltering}
        globalFilter={typeof state?.globalFilter === "string" ? state.globalFilter : ""}
        onGlobalFilterChange={(value) => {
          onGlobalFilterChange?.(value);
        }}
      />
    );
  }

  return <MaterialReactTable table={table} />;
};

export default Table;
