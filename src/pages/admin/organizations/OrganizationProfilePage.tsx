import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingDataError from "../../../components/LoadingDataError";
import { useOrganization } from "../../../hooks/organizations/useOrganizations";
import type { OrganizationRoute } from "../../../types/organization.types";
import UpdateOrganization from "./components/UpdateOrganization";
import DeleteOrganization from "./components/DeleteOrganization";
import OrganizationRoutesMap from "./components/OrganizationRoutesMap";
import ManageOrganizationRoutes from "./components/ManageOrganizationRoutes";

const formatDate = (value?: string) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("ar-SY");
};

const OrganizationProfilePage = () => {
  const { t } = useTranslation();
  const params = useParams();

  const organizationId = Number(params.id);
  const safeOrganizationId = Number.isFinite(organizationId)
    ? organizationId
    : 0;

  const organization = useOrganization(safeOrganizationId);
  const [orgRoutes, setOrgRoutes] = useState<OrganizationRoute[]>([]);

  useEffect(() => {
    setOrgRoutes(organization.data?.orgRoutes ?? []);
  }, [organization.data?.orgRoutes]);

  if (!Number.isFinite(organizationId)) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("organizations.notFound")}
        </Typography>

        <Button
          component={RouterLink}
          to="/admin/dashboard/organizations"
          startIcon={<ArrowBackRoundedIcon />}
        >
          {t("organizations.profile.backToOrganizations")}
        </Button>
      </Stack>
    );
  }

  if (organization.isLoading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (organization.isError) {
    return (
      <LoadingDataError
        refetch={organization.refetch}
        loading={organization.isRefetching}
      />
    );
  }

  if (!organization.data) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("organizations.notFound")}
        </Typography>

        <Button
          component={RouterLink}
          to="/admin/dashboard/organizations"
          startIcon={<ArrowBackRoundedIcon />}
        >
          {t("organizations.profile.backToOrganizations")}
        </Button>
      </Stack>
    );
  }

  const currentOrganization = organization.data;

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Button
          component={RouterLink}
          to="/admin/dashboard/organizations"
          startIcon={<ArrowBackRoundedIcon />}
          variant="outlined"
          sx={{
            alignSelf: { xs: "stretch", md: "center" },
            borderRadius: 2,
          }}
        >
          {t("organizations.profile.backToOrganizations")}
        </Button>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: { xs: "flex-end", md: "center" },
            alignItems: "center",
          }}
        >
          <Button
            component={RouterLink}
            to={`/admin/dashboard/organizations/${currentOrganization.id}/users`}
            variant="outlined"
            startIcon={<GroupsRoundedIcon />}
            sx={{
              borderRadius: 2,
            }}
          >
            {t("users.organizationUsers.manageUsers")}
          </Button>
          <Button
            component={RouterLink}
            to={`/admin/dashboard/organizations/${currentOrganization.id}/buses`}
            variant="outlined"
            startIcon={<DirectionsBusRoundedIcon />}
            sx={{
              borderRadius: 2,
            }}
          >
            {t("buses.actions.manageBuses")}
          </Button>
          <Button
            component={RouterLink}
            to={`/admin/dashboard/organizations/${currentOrganization.id}/schedules`}
            variant="outlined"
            startIcon={<EventAvailableRoundedIcon />}
            sx={{
              borderRadius: 2,
            }}
          >
            {t("schedules.actions.manageSchedules")}
          </Button>
          <OrganizationRoutesMap orgRoutes={orgRoutes} />
          <UpdateOrganization organization={currentOrganization} />
          <DeleteOrganization organization={currentOrganization} />
        </Stack>
      </Stack>

      <Card
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "start" },
            }}
          >
            <Avatar
              src={currentOrganization.icon || undefined}
              variant="rounded"
              sx={{
                width: 110,
                height: 110,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <BusinessRoundedIcon fontSize="large" />
            </Avatar>

            <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: { xs: "center", sm: "center" },
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    wordBreak: "break-word",
                  }}
                >
                  {currentOrganization.name}
                </Typography>

                <Chip
                  label={currentOrganization.codeName}
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Typography color="text.secondary">
                {t("organizations.profile.subtitle")}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { xs: "stretch", sm: "center" },
                  pt: 1,
                }}
              >
                <Chip
                  icon={<RouteRoundedIcon />}
                  label={t("organizations.profile.routesCount", {
                    count: orgRoutes.length,
                  })}
                  color="primary"
                  variant="outlined"
                />

                <Chip
                  icon={<CalendarMonthRoundedIcon />}
                  label={`${t("organizations.table.createdAt")}: ${formatDate(
                    currentOrganization.createdAt,
                  )}`}
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {t("organizations.profile.assignedRoutes")}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t("organizations.profile.assignedRoutesDescription")}
                  </Typography>
                </Box>

                <ManageOrganizationRoutes
                    variant="embedded"
                    organization={{
                        ...currentOrganization,
                        orgRoutes,
                    }}
                    onRoutesChange={setOrgRoutes}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OrganizationProfilePage;