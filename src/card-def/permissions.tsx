import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import type { Permission } from "../types/permission.types";
import {
  getPermissionActionLabel,
  getPermissionResourceLabel,
} from "../utils/permissionTranslation";

interface PermissionsCardProps {
  t: TFunction;
}

export const getPermissionsCard = ({ t }: PermissionsCardProps) => {
  return (permission: Permission) => (
    <Card
      key={permission.id}
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
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: 900 }}>
              {getPermissionResourceLabel(permission.resourceType, t)}
            </Typography>

            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={getPermissionActionLabel(permission.action, t)}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};