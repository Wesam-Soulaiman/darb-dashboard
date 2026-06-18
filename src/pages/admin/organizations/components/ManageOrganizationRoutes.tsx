import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import LoadingDataError from "../../../../components/LoadingDataError";
import { useRoutes } from "../../../../hooks/locations/useRoutes";
import {
  useAssignOrganizationRoute,
  useRemoveOrganizationRoute,
} from "../../../../hooks/organizations/useOrganizations";
import type {
  Organization,
  OrganizationRoute,
} from "../../../../types/organization.types";
import type { TransitRoute } from "../../../../types/route.types";

type ManageOrganizationRoutesProps = {
  organization: Organization;
  variant?: "icon" | "embedded";
  onRoutesChange?: (routes: OrganizationRoute[]) => void;
};

const getRoutesArray = (data: unknown): TransitRoute[] => {
  if (Array.isArray(data)) {
    return data as TransitRoute[];
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data?: unknown }).data)
  ) {
    return (data as { data: TransitRoute[] }).data;
  }

  return [];
};

const ManageOrganizationRoutes = ({
  organization,
  variant = "icon",
  onRoutesChange,
}: ManageOrganizationRoutesProps) => {
  const { t } = useTranslation();

  const routes = useRoutes({
    limit: 100,
  });

  const assignRoute = useAssignOrganizationRoute(organization.id);
  const removeRoute = useRemoveOrganizationRoute(organization.id);

  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [organizationRoutes, setOrganizationRoutes] = useState<OrganizationRoute[]>(
    organization.orgRoutes ?? [],
  );

  useEffect(() => {
    setOrganizationRoutes(organization.orgRoutes ?? []);
  }, [organization.orgRoutes]);

  const allRoutes = useMemo(() => getRoutesArray(routes.data), [routes.data]);

  const assignedRouteIds = useMemo(
    () => new Set(organizationRoutes.map((item) => item.route.id)),
    [organizationRoutes],
  );

  const availableRoutes = useMemo(() => {
    return allRoutes.filter((route) => !assignedRouteIds.has(route.id));
  }, [allRoutes, assignedRouteIds]);

  const loading = routes.isLoading || assignRoute.isPending || removeRoute.isPending;

  const syncRoutes = (updatedRoutes: OrganizationRoute[]) => {
    setOrganizationRoutes(updatedRoutes);
    onRoutesChange?.(updatedRoutes);
  };

  const handleAssignRoute = async () => {
    if (!selectedRoute) return;

    const updatedOrganization = await assignRoute.mutateAsync({
      routeId: selectedRoute.id,
    });

    syncRoutes(updatedOrganization.orgRoutes ?? []);
    setSelectedRoute(null);
  };

  const handleRemoveRoute = async (routeId: string) => {
    const updatedOrganization = await removeRoute.mutateAsync({
      routeId,
    });

    syncRoutes(updatedOrganization.orgRoutes ?? []);
  };

  const content = (
    <Stack spacing={2}>
      {variant === "icon" ? (
        <Box>
          <Typography sx={{ fontWeight: 900 }}>{organization.name}</Typography>

          <Typography variant="body2" color="text.secondary">
            {organization.codeName}
          </Typography>
        </Box>
      ) : null}

      {routes.isError ? (
        <LoadingDataError refetch={routes.refetch} loading={routes.isRefetching} />
      ) : (
        <>
          <Stack direction={{ xs: "column" }} spacing={1} sx={{ alignItems: "stretch" }}>
            <Autocomplete
              fullWidth
              options={availableRoutes}
              value={selectedRoute}
              loading={routes.isLoading}
              disabled={loading}
              getOptionLabel={(route) => route.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => setSelectedRoute(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("organizations.routes.selectRoute")}
                  placeholder={t("organizations.routes.selectRoute")}
                />
              )}
            />

            <Button
              variant="contained"
              disabled={!selectedRoute || loading}
              onClick={handleAssignRoute}
              startIcon={<RouteRoundedIcon />}
              sx={{
                width: 200,
              }}
            >
              {assignRoute.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                t("organizations.routes.assign")
              )}
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 900 }}>
              {t("organizations.routes.assignedRoutes")}
            </Typography>

            {organizationRoutes.length > 0 ? (
              <Stack spacing={1}>
                {organizationRoutes.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.25,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 800 }}>
                        {item.route.name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {item.route.price
                          ? `${item.route.price.amount} ${item.route.price.currency}`
                          : ""}
                      </Typography>
                    </Box>

                    <Tooltip title={t("organizations.routes.remove")}>
                      <span>
                        <IconButton
                          color="error"
                          disabled={loading}
                          onClick={() => handleRemoveRoute(item.route.id)}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  minHeight: 120,
                  display: "grid",
                  placeItems: "center",
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  textAlign: "center",
                  p: 2,
                }}
              >
                <Typography color="text.secondary">
                  {t("organizations.routes.noAssignedRoutes")}
                </Typography>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );

  if (variant === "embedded") {
    return content;
  }

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("organizations.routes.tooltip")}>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.currentTarget.blur();

              requestAnimationFrame(() => {
                handleOpen();
              });
            }}
          >
            <RouteRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("organizations.routes.title")}</DialogTitle>

          <DialogContent dividers>{content}</DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={handleClose}>
              {t("common.close")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    />
  );
};

export default ManageOrganizationRoutes;
