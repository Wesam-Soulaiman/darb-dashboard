import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  assignUserRoleSchema,
  type AssignUserRoleFormInputValues,
  type AssignUserRoleFormValues,
} from "../../../../schemas/users/userSchemas";
import { useRoles } from "../../../../hooks/roles/useRoles";
import type { Role } from "../../../../types/role.types";
import type { UserRoleSummary } from "../../../../types/user.types";

type AssignUserRoleFormProps = {
  assignedRoles: UserRoleSummary[];
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: AssignUserRoleFormValues) => Promise<void> | void;
};

const AssignUserRoleForm = ({
  assignedRoles,
  loading = false,
  submitLabel,
  onSubmit,
}: AssignUserRoleFormProps) => {
  const { t } = useTranslation();
  const roles = useRoles();

  const assignedRoleIds = new Set(assignedRoles.map((role) => role.id));

  const availableRoles: Role[] = (roles.data ?? []).filter(
    (role) => !assignedRoleIds.has(role.id),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<AssignUserRoleFormInputValues, unknown, AssignUserRoleFormValues>({
    resolver: zodResolver(assignUserRoleSchema),
    mode: "onChange",
    defaultValues: {
      roleId: "",
    },
  });

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        {availableRoles.length === 0 ? (
          <Alert severity="info">{t("users.organizationUsers.allRolesAssigned")}</Alert>
        ) : (
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label={t("users.organizationUsers.roleName")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={roles.isLoading || loading}
                    error={Boolean(errors.roleId)}
                    helperText={getErrorMessage(errors.roleId?.message)}
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  disabled={!isValid || loading || !isDirty}
                >
                  {loading ? t("common.saving") : submitLabel}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignUserRoleForm;
