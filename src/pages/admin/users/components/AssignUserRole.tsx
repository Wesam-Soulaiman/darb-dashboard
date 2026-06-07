import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useAssignUserRole } from "../../../../hooks/users/useUsers";
import AssignUserRoleForm from "./AssignUserRoleForm";
import type { AssignUserRoleFormValues } from "../../../../schemas/users/userSchemas";
import type { UserRoleSummary } from "../../../../types/user.types";

type AssignUserRoleProps = {
  userId: number;
  assignedRoles: UserRoleSummary[];
};

const AssignUserRole = ({
  userId,
  assignedRoles,
}: AssignUserRoleProps) => {
  const { t } = useTranslation();
  const assignRole = useAssignUserRole(userId);

  const handleSubmit = async (
    values: AssignUserRoleFormValues,
    handleClose: () => void,
  ) => {
    await assignRole.mutateAsync({
      roleId: values.roleId,
    });

    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("users.organizationUsers.addRole")}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={handleOpen}
              disabled={assignRole.isPending}
              aria-label={t("users.organizationUsers.addRole")}
            >
              <PersonAddAltRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="xs" fullWidth>
          <DialogTitle>
            {t("users.organizationUsers.addRole")}
          </DialogTitle>

          <DialogContent dividers>
            <AssignUserRoleForm
              assignedRoles={assignedRoles}
              loading={assignRole.isPending}
              submitLabel={t("users.organizationUsers.addRole")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default AssignUserRole;