import { useCallback, useMemo, useState } from "react";
import type { MRT_PaginationState } from "material-react-table";

type PaginationUpdater =
  | MRT_PaginationState
  | ((old: MRT_PaginationState) => MRT_PaginationState);

type GetPaginationPropsArgs = {
  dataLength: number;
  hasNextPage?: boolean;
  nextCursor?: string | null;
};

type UseCursorPaginationArgs = {
  initialPageSize?: number;
};

export const useCursorPagination = ({
  initialPageSize = 20,
}: UseCursorPaginationArgs = {}) => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const [cursorHistory, setCursorHistory] = useState<Array<string | undefined>>(
    [undefined],
  );

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const limit = pagination.pageSize;

  const reset = useCallback(
    (pageSize = initialPageSize) => {
      setCursor(undefined);
      setCursorHistory([undefined]);

      setPagination({
        pageIndex: 0,
        pageSize,
      });
    },
    [initialPageSize],
  );

  const getPaginationProps = useCallback(
    ({
      dataLength,
      hasNextPage = false,
      nextCursor,
    }: GetPaginationPropsArgs) => {
      const rowCount = hasNextPage
        ? (pagination.pageIndex + 2) * pagination.pageSize
        : pagination.pageIndex * pagination.pageSize + dataLength;

      const onPaginationChange = (updater: PaginationUpdater) => {
        const next =
          typeof updater === "function" ? updater(pagination) : updater;

        const pageSizeChanged = next.pageSize !== pagination.pageSize;

        if (pageSizeChanged) {
          setCursor(undefined);
          setCursorHistory([undefined]);

          setPagination({
            pageIndex: 0,
            pageSize: next.pageSize,
          });

          return;
        }

        const goingNext = next.pageIndex > pagination.pageIndex;
        const goingPrevious = next.pageIndex < pagination.pageIndex;

        if (goingNext) {
          if (!hasNextPage || !nextCursor) {
            return;
          }

          setCursor(nextCursor);

          setCursorHistory((current) => {
            const updated = [...current];
            updated[next.pageIndex] = nextCursor;
            return updated;
          });

          setPagination(next);
          return;
        }

        if (goingPrevious) {
          const previousCursor = cursorHistory[next.pageIndex];

          setCursor(previousCursor);
          setPagination(next);
        }
      };

      return {
        pagination,
        rowCount,
        onPaginationChange,
      };
    },
    [cursorHistory, pagination],
  );

  return useMemo(
    () => ({
      cursor,
      limit,
      pagination,
      reset,
      getPaginationProps,
    }),
    [cursor, limit, pagination, reset, getPaginationProps],
  );
};
