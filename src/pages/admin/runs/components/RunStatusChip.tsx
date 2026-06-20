import { Chip, type ChipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { RunStatus } from "../../../../types/run.types";

type RunStatusChipProps = {
  status: RunStatus;
};

const statusColors: Record<RunStatus, ChipProps["color"]> = {
  draft: "default",
  confirmed: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "error",
};

const RunStatusChip = ({ status }: RunStatusChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      size="small"
      color={statusColors[status]}
      label={t(`runs.status.${status}`)}
      sx={{
        fontWeight: 700,
      }}
    />
  );
};

export default RunStatusChip;
