import { Button, CircularProgress, Tooltip } from "@mui/material";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useTranslation } from "react-i18next";

import { useConfirmRun } from "../../../../hooks/organizations/useRuns";
import type { Run } from "../../../../types/run.types";

type ConfirmRunActionProps = {
  run: Run;
};

const ConfirmRunAction = ({ run }: ConfirmRunActionProps) => {
  const { t } = useTranslation();

  const confirmRun = useConfirmRun(run.organizationId, run.id);

  const hasCompleteAssignment = Boolean(run.driver && run.bus);

  const button = (
    <Button
      size="small"
      variant="contained"
      color="success"
      startIcon={
        confirmRun.isPending ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <TaskAltRoundedIcon />
        )
      }
      disabled={confirmRun.isPending || !hasCompleteAssignment || run.status !== "draft"}
      onClick={() => {
        confirmRun.mutate();
      }}
    >
      {confirmRun.isPending ? t("runs.actions.confirming") : t("runs.actions.confirm")}
    </Button>
  );

  if (hasCompleteAssignment) {
    return button;
  }

  return (
    <Tooltip title={t("runs.confirm.missingAssignment")}>
      <span>{button}</span>
    </Tooltip>
  );
};

export default ConfirmRunAction;
