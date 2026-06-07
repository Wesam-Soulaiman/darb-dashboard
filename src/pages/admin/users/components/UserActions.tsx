import { Stack } from "@mui/material";

import type { UserListItem } from "../../../../types/user.types";
import AssignUserRole from "./AssignUserRole";
import UnassignUserRole from "./UnassignUserRole";
import UpdateOperationalProfile from "./UpdateOperationalProfile";
import DeleteUser from "./DeleteUser";

type UserActionsProps = {
  user: UserListItem;
  isSuperAdmin: boolean;
};

const UserActions = ({
  user,
  isSuperAdmin,
}: UserActionsProps) => {
  const canManageOperationalProfile =
    !isSuperAdmin &&
    Boolean(user.organizationId) &&
    Boolean(user.profile);

  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <AssignUserRole
        userId={user.id}
        assignedRoles={user.roles}
      />

      <UnassignUserRole
        userId={user.id}
        roles={user.roles}
      />

      {canManageOperationalProfile && (
        <UpdateOperationalProfile user={user} />
      )}

      <DeleteUser user={user} />
    </Stack>
  );
};

export default UserActions;