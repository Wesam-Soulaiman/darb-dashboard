import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";
import { Link as RouterLink } from "react-router-dom";
import UpdateOrganization from "../pages/admin/organizations/components/UpdateOrganization";
import DeleteOrganization from "../pages/admin/organizations/components/DeleteOrganization";
import type { Organization } from "../types/organization.types";

type GetOrganizationCardDefArgs = {
  t: TFunction;
};

export const getOrganizationCardDef = ({ t }: GetOrganizationCardDefArgs) => {
  return (organization: Organization) => (
    <Card
      key={organization.id}
      variant="outlined"
      sx={{
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
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Tooltip title={t("common.details")}>
              <IconButton
                component={RouterLink}
                to={`/admin/dashboard/organizations/${organization.id}`}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                />
              </IconButton>
            </Tooltip>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.4,
                }}
              >
                {organization.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                #{organization.id}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={0.75}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  {t("organizations.table.createdAt")}
                </Typography>

                <Typography variant="body2">
                  {organization.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString("ar-SY")
                    : "-"}
                </Typography>
              </Stack>
              <Chip label={organization.codeName} size="small" variant="outlined" />
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
            <UpdateOrganization organization={organization} />
            <DeleteOrganization organization={organization} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
