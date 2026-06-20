import { Button, CircularProgress } from "@mui/material";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { useTranslation } from "react-i18next";

import { useCreateTodayRuns } from "../../../../hooks/organizations/useRuns";

type CreateRunsForRouteProps = {
  orgId: number;
  routeId: string;
  disabled?: boolean;
  onCreated?: () => void;
};

const CreateRunsForRoute = ({
  orgId,
  routeId,
  disabled = false,
  onCreated,
}: CreateRunsForRouteProps) => {
  const { t } = useTranslation();

  const createRuns = useCreateTodayRuns(orgId);

  const handleCreate = () => {
    createRuns.mutate(routeId, {
      onSuccess: () => {
        onCreated?.();
      },
    });
  };

  return (
    <Button
      variant="contained"
      startIcon={
        createRuns.isPending ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <PlaylistAddRoundedIcon />
        )
      }
      disabled={disabled || createRuns.isPending || !routeId}
      onClick={handleCreate}
      sx={{
        minHeight: 42,
        borderRadius: 2,
        whiteSpace: "nowrap",
      }}
    >
      {createRuns.isPending
        ? t("runs.actions.creatingForRoute")
        : t("runs.actions.createForRoute")}
    </Button>
  );
};

export default CreateRunsForRoute;
