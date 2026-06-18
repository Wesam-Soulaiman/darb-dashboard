import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import LoadingDataError from "./LoadingDataError";

type SearchField<T> = keyof T & string;

interface MobileCardsViewProps<T> {
  data: T[];
  renderCard: (item: T) => ReactNode;
  renderFilters?: ReactNode;
  searchFields?: SearchField<T>[];
  pageSize?: number;
  enableSearch?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  isRefetching?: boolean;

  manualFiltering?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

const MobileCardsView = <T,>({
  data,
  renderCard,
  renderFilters,
  searchFields = [],
  pageSize = 10,
  enableSearch = true,
  isLoading = false,
  isError = false,
  refetch,
  isRefetching = false,

  manualFiltering = false,
  globalFilter,
  onGlobalFilterChange,
}: MobileCardsViewProps<T>) => {
  const { t } = useTranslation();

  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(1);

  const search = enableSearch
    ? manualFiltering
      ? (globalFilter ?? "")
      : localSearch
    : "";

  const filteredData = useMemo(() => {
    if (!enableSearch || manualFiltering) {
      return data;
    }

    const value = search.trim().toLowerCase();

    if (!value) {
      return data;
    }

    if (!searchFields.length) {
      return data;
    }

    return data.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = item[field];

        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }

        return String(fieldValue).toLowerCase().includes(value);
      }),
    );
  }, [data, enableSearch, manualFiltering, search, searchFields]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (manualFiltering) {
      onGlobalFilterChange?.(value);
    } else {
      setLocalSearch(value);
    }

    setPage(1);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 220,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError && refetch) {
    return <LoadingDataError refetch={refetch} loading={isRefetching} />;
  }

  return (
    <Stack spacing={2}>
      {renderFilters}

      {enableSearch ? (
        <TextField
          fullWidth
          value={search}
          onChange={handleSearchChange}
          placeholder={t("table.search")}
          size="small"
        />
      ) : null}

      {paginatedData.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {paginatedData.map((item) => renderCard(item))}
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: 160,
            display: "grid",
            placeItems: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary">{t("table.noData")}</Typography>
        </Box>
      )}

      {pageCount > 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 1,
          }}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      ) : null}
    </Stack>
  );
};

export default MobileCardsView;
