import { Alert, Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { RunStats } from "../../../../types/run.types";

type RunsStatsProps = {
  stats?: RunStats;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
};

const RunsStats = ({
  stats,
  loading = false,
  error = false,
  onRetry,
}: RunsStatsProps) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              {t("common.retry")}
            </Button>
          ) : undefined
        }
      >
        {t("runs.stats.loadError")}
      </Alert>
    );
  }

  const items = [
    {
      key: "total",
      label: t("runs.stats.total"),
      value: stats?.total ?? 0,
    },
    {
      key: "draft",
      label: t("runs.stats.draft"),
      value: stats?.byStatus.draft ?? 0,
    },
    {
      key: "confirmed",
      label: t("runs.stats.confirmed"),
      value: stats?.byStatus.confirmed ?? 0,
    },
    {
      key: "inProgress",
      label: t("runs.stats.inProgress"),
      value: stats?.byStatus.in_progress ?? 0,
    },
    {
      key: "completed",
      label: t("runs.stats.completed"),
      value: stats?.byStatus.completed ?? 0,
    },
    {
      key: "cancelled",
      label: t("runs.stats.cancelled"),
      value: stats?.byStatus.cancelled ?? 0,
    },
  ];

  return (
    <Stack spacing={1.5}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
        }}
      >
        {t("runs.stats.title")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            xl: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {items.map((item) => (
          <Paper
            key={item.key}
            variant="outlined"
            sx={{
              p: 2,
              minWidth: 0,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                color: "text.secondary",
              }}
            >
              {item.label}
            </Typography>

            {loading ? (
              <Skeleton variant="text" width={60} height={48} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                {item.value}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Stack>
  );
};

export default RunsStats;
