import { useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import { useTranslation } from "react-i18next";

import { useUser } from "../../../../hooks/users/useUsers";

type ViewUserDetailsProps = {
  userId: number;
  renderTrigger?: (props: { open: () => void }) => ReactNode;
};

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
};

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";

  return `${first}${last}`.toUpperCase() || "U";
};

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: "action.hover",
          color: "text.secondary",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}
        </Typography>

        <Typography
          variant="body2"
          component="div"
          sx={{
            fontWeight: 700,
            overflowWrap: "anywhere",
          }}
        >
          {value ?? "-"}
        </Typography>
      </Box>
    </Stack>
  );
};

const ViewUserDetails = ({ userId, renderTrigger }: ViewUserDetailsProps) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const user = useUser(open ? userId : undefined);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const locale = i18n.language?.startsWith("ar") ? "ar-SY" : "en-US";

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const fullName = user.data ? `${user.data.firstName} ${user.data.lastName}`.trim() : "";

  const uniquePermissions = useMemo(() => {
    if (!user.data) return [];

    return Array.from(
      new Set([
        ...user.data.permissions,
        ...user.data.roles.flatMap((role) =>
          role.permissions.map(
            (permission) => `${permission.action}:${permission.resourceType}`,
          ),
        ),
      ]),
    ).sort((first, second) => first.localeCompare(second));
  }, [user.data]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger({
          open: () => setOpen(true),
        })
      ) : (
        <Tooltip title={t("users.actions.view")}>
          <IconButton
            size="small"
            onClick={() => setOpen(true)}
            aria-label={t("users.actions.view")}
          >
            <VisibilityRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pr: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("users.details.title")}
          </Typography>

          <Tooltip title={t("common.close")}>
            <IconButton onClick={handleClose} aria-label={t("common.close")}>
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent dividers>
          {user.isLoading ? (
            <Stack
              spacing={2}
              sx={{
                minHeight: 280,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={38} />

              <Typography color="text.secondary">{t("common.loading")}</Typography>
            </Stack>
          ) : user.isError ? (
            <Stack
              spacing={2}
              sx={{
                minHeight: 240,
                justifyContent: "center",
              }}
            >
              <Alert severity="error">{t("users.details.loadError")}</Alert>

              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => user.refetch()}
                disabled={user.isRefetching}
                sx={{ alignSelf: "center" }}
              >
                {user.isRefetching ? t("common.loading") : t("common.retry")}
              </Button>
            </Stack>
          ) : !user.data ? (
            <Alert severity="warning">{t("users.details.notFound")}</Alert>
          ) : (
            <Stack spacing={3}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontSize: 25,
                      fontWeight: 900,
                    }}
                  >
                    {getInitials(user.data.firstName, user.data.lastName)}
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

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t("users.details.userId", {
                        id: user.data.id,
                      })}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={
                        user.data.isActive ? (
                          <CheckCircleRoundedIcon />
                        ) : (
                          <BlockRoundedIcon />
                        )
                      }
                      color={user.data.isActive ? "success" : "default"}
                      label={
                        user.data.isActive
                          ? t("users.details.active")
                          : t("users.details.inactive")
                      }
                      variant="outlined"
                    />

                    {user.data.isDriver && (
                      <Chip
                        icon={<DriveEtaRoundedIcon />}
                        color="info"
                        label={t("users.details.driver")}
                        variant="outlined"
                      />
                    )}

                    {user.data.isSuperAdmin && (
                      <Chip
                        icon={<AdminPanelSettingsRoundedIcon />}
                        color="primary"
                        label={t("profile.superAdmin")}
                      />
                    )}

                    {user.data.mustChangePassword && (
                      <Chip
                        icon={<LockResetRoundedIcon />}
                        color="warning"
                        label={t("profile.mustChangePassword")}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </Paper>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
                  {t("users.details.accountInformation")}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  <DetailItem
                    icon={<EmailRoundedIcon />}
                    label={t("users.form.email")}
                    value={user.data.email || "-"}
                  />

                  <DetailItem
                    icon={<PhoneRoundedIcon />}
                    label={t("users.form.phone")}
                    value={user.data.phone || "-"}
                  />

                  <DetailItem
                    icon={<BusinessRoundedIcon />}
                    label={t("users.form.organization")}
                    value={
                      user.data.organizationId
                        ? `#${user.data.organizationId}`
                        : t("users.form.noOrganization")
                    }
                  />

                  <DetailItem
                    icon={<BadgeRoundedIcon />}
                    label={t("users.details.accountType")}
                    value={
                      user.data.isSuperAdmin
                        ? t("profile.superAdmin")
                        : t("users.details.regularUser")
                    }
                        />
                        {user.data.isDriver && (
  <>
    <Divider />

    <Stack spacing={1.5}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 900 }}
      >
        {t(
          "users.form.driverInformation",
        )}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <DetailItem
          icon={<DriveEtaRoundedIcon />}
          label={t(
            "users.organizationUsers.licenseNumber",
          )}
          value={
            user.data.profile
              ?.licenseNumber ?? "-"
          }
        />

        <DetailItem
          icon={<CalendarMonthRoundedIcon />}
          label={t(
            "users.organizationUsers.licenseExpiry",
          )}
          value={formatDate(
            user.data.profile
              ?.licenseExpiry,
          )}
        />
      </Box>
    </Stack>
  </>
)}

                  <DetailItem
                    icon={<CalendarMonthRoundedIcon />}
                    label={t("users.table.createdAt")}
                    value={formatDate(user.data.createdAt)}
                  />

                  <DetailItem
                    icon={<UpdateRoundedIcon />}
                    label={t("users.table.updatedAt")}
                    value={formatDate(user.data.updatedAt)}
                  />
                </Box>
              </Box>

              <Divider />

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <BadgeRoundedIcon color="action" />

                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {t("users.details.roles")}
                    </Typography>
                  </Stack>

                  <Chip size="small" label={user.data.roles.length} variant="outlined" />
                </Stack>

                {user.data.roles.length ? (
                  <Stack spacing={1.5}>
                    {user.data.roles.map((role) => (
                      <Paper
                        key={role.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          borderColor: "divider",
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                            spacing={1}
                            sx={{
                              justifyContent: "space-between",
                              alignItems: {
                                xs: "flex-start",
                                sm: "center",
                              },
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontWeight: 900 }}>
                                {role.name}
                              </Typography>

                              {role.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.25 }}
                                >
                                  {role.description}
                                </Typography>
                              )}
                            </Box>

                            <Chip
                              size="small"
                              variant="outlined"
                              label={
                                role.organizationId
                                  ? t("users.details.organizationRole", {
                                      id: role.organizationId,
                                    })
                                  : t("users.details.globalRole")
                              }
                            />
                          </Stack>

                          <Divider />

                          <Typography variant="caption" color="text.secondary">
                            {t("users.details.rolePermissions")}
                          </Typography>

                          {role.permissions.length ? (
                            <Stack
                              direction="row"
                              sx={{
                                flexWrap: "wrap",
                                gap: 0.75,
                              }}
                            >
                              {role.permissions.map((permission) => (
                                <Chip
                                  key={permission.id}
                                  size="small"
                                  variant="outlined"
                                  label={`${permission.action}:${permission.resourceType}`}
                                />
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t("users.details.noPermissions")}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">{t("users.details.noRoles")}</Alert>
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <SecurityRoundedIcon color="action" />

                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {t("users.details.permissions")}
                    </Typography>
                  </Stack>

                  <Chip
                    size="small"
                    label={uniquePermissions.length}
                    variant="outlined"
                  />
                </Stack>

                {uniquePermissions.length ? (
                  <Stack
                    direction="row"
                    sx={{
                      flexWrap: "wrap",
                      gap: 0.75,
                    }}
                  >
                    {uniquePermissions.map((permission) => (
                      <Chip
                        key={permission}
                        size="small"
                        label={permission}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">{t("users.details.noPermissions")}</Alert>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewUserDetails;
