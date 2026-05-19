import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import type { Role } from "../types/role.types";
import UpdateRole from "../pages/admin/roles/components/UpdateRole";
import ManageRolePermissions from "../pages/admin/roles/components/ManageRolePermissions";

interface RolesCardProps {
  t: TFunction;
}

export const getRolesCard = ({ t }: RolesCardProps) => {
  return (role: Role) => (
    <Card
      key={role.id}
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.4,
                }}
              >
                {role.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                #{role.id}
              </Typography>
            </Stack>

            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={t("roles.permissions.count", {
                count: role.permissions.length,
              })}
            />
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("roles.table.description")}
            </Typography>

            <Typography variant="body2">
              {role.description || "-"}
            </Typography>
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("roles.table.createdAt")}
            </Typography>

            <Typography variant="body2">
              {role.createdAt
                ? new Date(role.createdAt).toLocaleDateString("ar-SY")
                : "-"}
            </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ManageRolePermissions role={role} />
            <UpdateRole role={role} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};