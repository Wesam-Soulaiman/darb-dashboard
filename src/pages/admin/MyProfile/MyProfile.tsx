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
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useTranslation } from "react-i18next";

import { useMe } from "../../../hooks/users/useUsers";
import LoadingDataError from "../../../components/LoadingDataError";
import UpdateMyProfile from "./components/UpdateMyProfile";
import ChangeMyPassword from "./components/ChangeMyPassword";
import AppSettings from "./components/AppSettings";

export default function MyProfile() {
  const { t } = useTranslation();
  const me = useMe();

  if (me.isLoading) {
    return <Typography>{t("common.loading")}</Typography>;
  }

  if (me.isError || !me.data) {
    return <LoadingDataError refetch={me.refetch} loading={me.isRefetching} />;
  }

  const fullName = `${me.data.firstName} ${me.data.lastName}`.trim();
  const initials = `${me.data.firstName?.[0] ?? ""}${me.data.lastName?.[0] ?? ""}` || "U";

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <AccountCircleRoundedIcon />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("profile.my")}
          </Typography>

          <Typography color="text.secondary">{t("profile.subtitle")}</Typography>
        </Box>
      </Stack>

      <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "flex-start", md: "center" } }}
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 900,
                  fontSize: 26,
                }}
              >
                {initials}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    overflowWrap: "anywhere",
                  }}
                >
                  {fullName || "-"}
                </Typography>

                <Typography color="text.secondary">{me.data.email}</Typography>
                <Typography color="text.secondary">{me.data.phone}</Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  width: { xs: "100%", md: "auto" },
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                <UpdateMyProfile user={me.data} />
                <ChangeMyPassword />
              </Stack>
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {me.data.isSuperAdmin && (
                <Chip color="primary" label={t("profile.superAdmin")} />
              )}

              <Chip
                color={me.data.isActive ? "success" : "default"}
                label={
                  me.data.isActive
                    ? t("users.details.active")
                    : t("users.details.inactive")
                }
              />

              {me.data.mustChangePassword && (
                <Chip color="warning" label={t("profile.mustChangePassword")} />
              )}
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>{t("users.details.roles")}</Typography>

              {me.data.roles.length ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {me.data.roles.map((role) => (
                    <Chip key={role.id} label={role.name} variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <AppSettings />
    </Stack>
  );
}
