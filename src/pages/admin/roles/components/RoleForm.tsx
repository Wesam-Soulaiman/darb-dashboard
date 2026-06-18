import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, Stack, TextField } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { roleSchema, type RoleFormValues } from "../../../../schemas/roles/roleSchemas";

type RoleFormProps = {
  defaultValues?: Partial<RoleFormValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: RoleFormValues) => Promise<void> | void;
};

const RoleForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: RoleFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("roles.form.name")}
                  error={Boolean(errors.name)}
                  helperText={getErrorMessage(errors.name?.message)}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  multiline
                  minRows={3}
                  label={t("roles.form.description")}
                  error={Boolean(errors.description)}
                  helperText={getErrorMessage(errors.description?.message)}
                />
              )}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
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
      </CardContent>
    </Card>
  );
};

export default RoleForm;
