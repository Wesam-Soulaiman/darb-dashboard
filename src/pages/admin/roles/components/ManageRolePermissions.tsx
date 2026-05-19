import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import LoadingDataError from "../../../../components/LoadingDataError";
import { usePermissions } from "../../../../hooks/roles/usePermissions";
import {
  useAssignRolePermissions,
  useRemoveRolePermissions,
} from "../../../../hooks/roles/useRoles";
import type { Role } from "../../../../types/role.types";
import { getPermissionLabel } from "../../../../utils/permissionTranslation";

type ManageRolePermissionsProps = {
  role: Role;
};

const ManageRolePermissions = ({ role }: ManageRolePermissionsProps) => {
  const { t } = useTranslation();

  const permissions = usePermissions();
  const assignPermissions = useAssignRolePermissions(role.id);
  const removePermissions = useRemoveRolePermissions(role.id);

  const initialSelectedIds = useMemo(
    () => role.permissions.map((permission) => permission.id),
    [role.permissions],
  );

  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const [search, setSearch] = useState("");

  const filteredPermissions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return permissions.data ?? [];
    }

    return (permissions.data ?? []).filter((permission) => {
      const translatedLabel = getPermissionLabel(permission, t).toLowerCase();

      const rawLabel =
        `${permission.action} ${permission.resourceType}`.toLowerCase();

      return (
        translatedLabel.includes(searchValue) || rawLabel.includes(searchValue)
      );
    });
  }, [permissions.data, search, t]);

  const togglePermission = (permissionId: number) => {
    setSelectedIds((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });
  };

  const handleSave = async (handleClose: () => void) => {
    const idsToAssign = selectedIds.filter(
      (id) => !initialSelectedIds.includes(id),
    );

    const idsToRemove = initialSelectedIds.filter(
      (id) => !selectedIds.includes(id),
    );

    if (idsToAssign.length > 0) {
      await assignPermissions.mutateAsync({
        permissionIds: idsToAssign,
      });
    }

    if (idsToRemove.length > 0) {
      await removePermissions.mutateAsync({
        permissionIds: idsToRemove,
      });
    }

    handleClose();
  };

  const loading =
    permissions.isLoading ||
    assignPermissions.isPending ||
    removePermissions.isPending;

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("roles.permissions.manage")}>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.currentTarget.blur();

              requestAnimationFrame(() => {
                setSelectedIds(initialSelectedIds);
                handleOpen();
              });
            }}
          >
            <AdminPanelSettingsRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("roles.permissions.title")}</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{role.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {role.description}
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("table.search")}
              />

              {permissions.isLoading ? (
                <Box
                  sx={{
                    minHeight: 180,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : permissions.isError ? (
                <LoadingDataError
                  refetch={permissions.refetch}
                  loading={permissions.isRefetching}
                />
              ) : filteredPermissions.length > 0 ? (
                <Stack
                  spacing={0.75}
                  sx={{
                    maxHeight: 360,
                    overflow: "auto",
                  }}
                >
                  {filteredPermissions.map((permission) => (
                    <FormControlLabel
                      key={permission.id}
                      control={
                        <Checkbox
                          checked={selectedIds.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                        />
                      }
                      label={getPermissionLabel(permission, t)}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  {t("permissions.empty")}
                </Typography>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="contained"
              onClick={() => handleSave(handleClose)}
              disabled={loading}
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    />
  );
};

export default ManageRolePermissions;