import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import type { Organization } from "../types/organization.types";
import type { UserListItem } from "../types/user.types";
import UserActions from "../pages/admin/users/components/UserActions";
import ViewUserDetails from "../pages/admin/users/components/ViewUserDetails";

type UsersCardOptions = {
  t: TFunction;
  locale: string;
  isSuperAdmin: boolean;
  organizations?: Organization[];
};

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";

  return `${first}${last}`.toUpperCase() || "U";
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(locale);
};

export const getUsersCard = ({
  t,
  locale,
  isSuperAdmin,
  organizations = [],
}: UsersCardOptions) => {
  const organizationNameById = new Map(
    organizations.map((organization) => [organization.id, organization.name]),
  );

  return (user: UserListItem) => (
    <Card
      key={user.id}
      variant="outlined"
      sx={{
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <ViewUserDetails
              userId={user.id}
              renderTrigger={({ open }) => (
                <Avatar
                  onClick={open}
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {getInitials(user.firstName, user.lastName)}
                </Avatar>
              )}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 900 }}>
                {user.firstName} {user.lastName}
              </Typography>

              <Typography noWrap variant="body2" color="text.secondary">
                {user.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {user.phone}
              </Typography>
            </Box>

            <Chip
              size="small"
              color={user.isActive ? "success" : "default"}
              label={
                user.isActive ? t("users.details.active") : t("users.details.inactive")
              }
            />
            {user.isDriver && (
              <Chip
                size="small"
                color="info"
                label={t("users.details.driver")}
                variant="outlined"
              />
            )}
          </Stack>

          <Divider />

          {isSuperAdmin && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {t("users.form.organization")}
              </Typography>

              <Typography sx={{ fontWeight: 700 }}>
                {user.organizationId
                  ? (organizationNameById.get(user.organizationId) ??
                    `#${user.organizationId}`)
                  : t("users.form.noOrganization")}
              </Typography>
            </Stack>
          )}

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("users.organizationUsers.roleName")}
            </Typography>

            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
              {user.roles.length ? (
                user.roles.map((role) => (
                  <Chip key={role.id} label={role.name} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Stack>
          </Stack>

          {user.profile && (
            <>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={t(`users.status.${user.profile.status}`)}
                  color={
                    user.profile.status === "ACTIVE"
                      ? "success"
                      : user.profile.status === "ON_LEAVE"
                        ? "warning"
                        : "default"
                  }
                  variant="outlined"
                />

                <Chip
                  size="small"
                  label={`${t("users.organizationUsers.employeeCode")}: ${
                    user.profile.employeeCode
                  }`}
                  variant="outlined"
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("users.organizationUsers.hireDate")}
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(user.profile.hireDate, locale)}
                  </Typography>
                </Box>

                {user.isDriver && (
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                  >
                    {/* <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {t(
          "users.organizationUsers.licenseNumber",
        )}
      </Typography>

      <Typography variant="body2">
        {user.profile?.licenseNumber ??
          "-"}
      </Typography>
    </Box> */}

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t("users.organizationUsers.licenseExpiry")}
                      </Typography>

                      <Typography variant="body2">
                        {formatDate(user.profile?.licenseExpiry, locale)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </>
          )}

          <Divider />

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              #{user.id}
            </Typography>

            <UserActions user={user} isSuperAdmin={isSuperAdmin} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
