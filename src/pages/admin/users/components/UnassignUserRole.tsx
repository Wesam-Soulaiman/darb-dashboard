import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import { useTranslation } from "react-i18next";

import { useUnassignUserRole } from "../../../../hooks/users/useUsers";
import type { UserRoleSummary } from "../../../../types/user.types";

type UnassignUserRoleProps = {
  userId: number;
  roles: UserRoleSummary[];
};

const UnassignUserRole = ({
  userId,
  roles,
}: UnassignUserRoleProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  const unassignRole = useUnassignUserRole(userId);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [roles, selectedRoleId],
  );

  if (roles.length === 0) {
    return null;
  }

  const handleOpen = () => {
    setSelectedRoleId(roles.length === 1 ? roles[0].id : "");
    setOpen(true);
  };

  const handleClose = () => {
    if (unassignRole.isPending) return;

    setOpen(false);
    setSelectedRoleId("");
  };

  const handleConfirm = async () => {
    if (!selectedRoleId) return;

    await unassignRole.mutateAsync({
      roleId: selectedRoleId,
    });

    handleClose();
  };

  return (
    <>
      <Tooltip title={t("users.organizationUsers.removeRole")}>
        <span>
          <IconButton
            size="small"
            color="warning"
            onClick={handleOpen}
            disabled={unassignRole.isPending}
            aria-label={t("users.organizationUsers.removeRole")}
          >
            <PersonRemoveRoundedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t("users.organizationUsers.removeRole")}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">
              {t("users.organizationUsers.selectRoleToRemove")}
            </Typography>

            <TextField
              select
              fullWidth
              required
              label={t("users.organizationUsers.roleName")}
              value={selectedRoleId}
              onChange={(event) =>
                setSelectedRoleId(Number(event.target.value))
              }
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            {selectedRole && (
              <Typography variant="body2" color="warning.main">
                {t("users.organizationUsers.removeSelectedRoleWarning", {
                  role: selectedRole.name,
                })}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={unassignRole.isPending}
          >
            {t("common.cancel")}
          </Button>

          <Button
            color="warning"
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedRoleId || unassignRole.isPending}
          >
            {unassignRole.isPending
              ? t("common.saving")
              : t("users.organizationUsers.removeRole")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnassignUserRole;