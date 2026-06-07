import {
  Badge,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import type {
  Dispatch,
  SetStateAction,
} from "react";
import type { MRT_ColumnFiltersState } from "material-react-table";
import { useTranslation } from "react-i18next";

import type { Organization } from "../../../../types/organization.types";
import type { OperationalProfileStatus } from "../../../../types/user.types";

type UserMobileFiltersProps = {
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: Dispatch<
    SetStateAction<MRT_ColumnFiltersState>
  >;
  organizations?: Organization[];
  showOrganizationFilter?: boolean;
  onFiltersChange?: () => void;
};

const getFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  return "";
};

const setFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
  value: string,
): MRT_ColumnFiltersState => {
  const filtersWithoutCurrent = filters.filter(
    (filter) => filter.id !== id,
  );

  if (!value.trim()) {
    return filtersWithoutCurrent;
  }

  return [
    ...filtersWithoutCurrent,
    {
      id,
      value,
    },
  ];
};

const UserMobileFilters = ({
  columnFilters,
  setColumnFilters,
  organizations = [],
  showOrganizationFilter = false,
  onFiltersChange,
}: UserMobileFiltersProps) => {
  const { t } = useTranslation();

  const status = getFilterValue(columnFilters, "status");
  const roleName = getFilterValue(columnFilters, "roleName");
  const organizationId = getFilterValue(
    columnFilters,
    "organizationId",
  );

  const activeFiltersCount = [
    status,
    roleName,
    showOrganizationFilter ? organizationId : "",
  ].filter(Boolean).length;

  const updateFilter = (id: string, value: string) => {
    setColumnFilters((current) =>
      setFilterValue(current, id, value),
    );

    onFiltersChange?.();
  };

  const clearFilters = () => {
    setColumnFilters([]);
    onFiltersChange?.();
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Badge
              badgeContent={activeFiltersCount}
              color="primary"
            >
              <FilterAltRoundedIcon color="action" />
            </Badge>

            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                {t("table.filters")}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {t("users.filters.mobileDescription")}
              </Typography>
            </Box>
          </Stack>

          {activeFiltersCount > 0 && (
            <Button
              size="small"
              color="inherit"
              startIcon={<FilterAltOffRoundedIcon />}
              onClick={clearFilters}
            >
              {t("table.clearFilters")}
            </Button>
          )}
        </Stack>

        <TextField
          select
          fullWidth
          size="small"
          label={t("users.organizationUsers.status")}
          value={status}
          onChange={(event) =>
            updateFilter("status", event.target.value)
          }
        >
          <MenuItem value="">
            {t("table.all")}
          </MenuItem>

          <MenuItem
            value={
              "ACTIVE" satisfies OperationalProfileStatus
            }
          >
            {t("users.status.ACTIVE")}
          </MenuItem>

          <MenuItem
            value={
              "ON_LEAVE" satisfies OperationalProfileStatus
            }
          >
            {t("users.status.ON_LEAVE")}
          </MenuItem>

          <MenuItem
            value={
              "TERMINATED" satisfies OperationalProfileStatus
            }
          >
            {t("users.status.TERMINATED")}
          </MenuItem>
        </TextField>

        <TextField
          fullWidth
          size="small"
          label={t("users.organizationUsers.roleName")}
          value={roleName}
          onChange={(event) =>
            updateFilter("roleName", event.target.value)
          }
          placeholder={t("users.filters.rolePlaceholder")}
        />

        {showOrganizationFilter && (
          <TextField
            select
            fullWidth
            size="small"
            label={t("users.form.organization")}
            value={organizationId}
            onChange={(event) =>
              updateFilter(
                "organizationId",
                event.target.value,
              )
            }
          >
            <MenuItem value="">
              {t("table.all")}
            </MenuItem>

            {organizations.map((organization) => (
              <MenuItem
                key={organization.id}
                value={String(organization.id)}
              >
                {organization.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>
    </Paper>
  );
};

export default UserMobileFilters;