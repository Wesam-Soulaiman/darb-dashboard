import { useCallback, useMemo, useState } from "react";
import type { MRT_PaginationState } from "material-react-table";

type PaginationUpdater =
  | MRT_PaginationState
  | ((old: MRT_PaginationState) => MRT_PaginationState);

type UsePagePaginationArgs = {
  initialPageSize?: number;
};

export const usePagePagination = ({
  initialPageSize = 20,
}: UsePagePaginationArgs = {}) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const page = pagination.pageIndex + 1;
  const limit = pagination.pageSize;

  const reset = useCallback(
    (pageSize = pagination.pageSize) => {
      setPagination({
        pageIndex: 0,
        pageSize,
      });
    },
    [pagination.pageSize],
  );

  const onPaginationChange = useCallback((updater: PaginationUpdater) => {
    setPagination((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;

      if (next.pageSize !== current.pageSize) {
        return {
          pageIndex: 0,
          pageSize: next.pageSize,
        };
      }

      return next;
    });
  }, []);

  return useMemo(
    () => ({
      page,
      limit,
      pagination,
      reset,
      onPaginationChange,
    }),
    [page, limit, pagination, reset, onPaginationChange],
  );
};
