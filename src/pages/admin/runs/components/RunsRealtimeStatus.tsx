import { Chip, CircularProgress, Tooltip } from "@mui/material";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useTranslation } from "react-i18next";

import type { RunsSocketConnectionStatus } from "../../../../types/run-realtime.types";

type RunsRealtimeStatusProps = {
  status: RunsSocketConnectionStatus;
  error?: string | null;
};

const RunsRealtimeStatus = ({ status, error }: RunsRealtimeStatusProps) => {
  const { t } = useTranslation();

  if (status === "connecting") {
    return (
      <Chip
        size="small"
        icon={<CircularProgress size={14} color="inherit" />}
        label={t("runs.realtime.connecting")}
        sx={{
          fontWeight: 700,
        }}
      />
    );
  }

  if (status === "connected") {
    return (
      <Chip
        size="small"
        color="success"
        icon={<CloudDoneRoundedIcon />}
        label={t("runs.realtime.connected")}
        sx={{
          fontWeight: 700,
        }}
      />
    );
  }

  if (status === "error") {
    return (
      <Tooltip title={error || t("runs.realtime.connectionError")}>
        <Chip
          size="small"
          color="error"
          icon={<ErrorOutlineRoundedIcon />}
          label={t("runs.realtime.error")}
          sx={{
            fontWeight: 700,
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Chip
      size="small"
      icon={<CloudOffRoundedIcon />}
      label={t("runs.realtime.disconnected")}
      sx={{
        fontWeight: 700,
      }}
    />
  );
};

export default RunsRealtimeStatus;
