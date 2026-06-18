import { IconButton, Tooltip } from "@mui/material";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Trip } from "../../../../types/trip.types";

type ManageTripOperationsProps = {
  trip: Trip;
};

const ManageTripOperations = ({ trip }: ManageTripOperationsProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("trips.actions.manageOperations")}>
      <IconButton
        component={RouterLink}
        to={`/admin/dashboard/organizations/${trip.organizationId}/trips/${trip.id}/setup`}
        color="primary"
      >
        <SettingsSuggestRoundedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ManageTripOperations;
