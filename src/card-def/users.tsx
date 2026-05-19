import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import type { User } from "../types/user.types";
import { formatSyrianPhone } from "../utils/syrianPhone";
import UpdateUser from "../pages/admin/users/components/UpdateUser";
import DeleteUser from "../pages/admin/users/components/DeleteUser";

interface UsersCardProps {
  t: TFunction;
}

export const getUsersCard = ({ t }: UsersCardProps) => {
  return (user: User) => (
    <Card
      key={user.id}
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
                {user.firstName} {user.lastName}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Stack>

            <Chip
              size="small"
              color={user.isActive ? "success" : "default"}
              label={
                user.isActive
                  ? t("users.status.active")
                  : t("users.status.inactive")
              }
            />
          </Stack>

          <Divider />

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("users.table.phone")}
            </Typography>

            <Typography variant="body2">{formatSyrianPhone(user.phone)}</Typography>
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("users.table.organizationId")}
            </Typography>

            <Typography variant="body2">{user.organizationId ?? "-"}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              size="small"
              variant="outlined"
              label={
                user.isSuperAdmin
                  ? t("users.types.superAdmin")
                  : t("users.types.user")
              }
            />

            <Chip
              size="small"
              variant="outlined"
              label={t("users.rolesCount", {
                count: user.roles.length,
              })}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <UpdateUser user={user} />
            <DeleteUser user={user} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};