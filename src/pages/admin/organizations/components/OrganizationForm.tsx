import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FileImagePicker from "../../../../components/FileImagePicker";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationFormValues,
  type UpdateOrganizationFormValues,
} from "../../../../schemas/organizations/organizationSchemas";

type CreateOrganizationFormProps = {
  mode: "create";
  defaultValues?: Partial<CreateOrganizationFormValues> & {
    currentIcon?: string;
  };
  loading?: boolean;
  onSubmit: (values: CreateOrganizationFormValues) => Promise<void> | void;
};

type UpdateOrganizationFormProps = {
  mode: "update";
  defaultValues?: Partial<UpdateOrganizationFormValues> & {
    currentIcon?: string;
  };
  loading?: boolean;
  onSubmit: (values: UpdateOrganizationFormValues) => Promise<void> | void;
};

type OrganizationFormProps = CreateOrganizationFormProps | UpdateOrganizationFormProps;

type OrganizationFormValues = CreateOrganizationFormValues | UpdateOrganizationFormValues;

const OrganizationForm = ({
  mode,
  defaultValues,
  loading = false,
  onSubmit,
}: OrganizationFormProps) => {
  const { t } = useTranslation();

  const schema = mode === "create" ? createOrganizationSchema : updateOrganizationSchema;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      codeName: defaultValues?.codeName ?? "",
      icon: null,
    } as OrganizationFormValues,
  });

  const selectedIcon = watch("icon");

  const previewUrl = useMemo(() => {
    if (selectedIcon instanceof File) {
      return URL.createObjectURL(selectedIcon);
    }

    return defaultValues?.currentIcon ?? "";
  }, [selectedIcon, defaultValues?.currentIcon]);

  useEffect(() => {
    return () => {
      if (selectedIcon instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedIcon, previewUrl]);

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  const iconErrorMessage = getErrorMessage(errors.icon?.message);
  const nameErrorMessage = getErrorMessage(errors.name?.message);
  const codeNameErrorMessage = getErrorMessage(errors.codeName?.message);

  const submitLabel =
    mode === "create"
      ? t("organizations.actions.create")
      : t("organizations.actions.update");

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
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit((values) => {
            if (mode === "create") {
              return onSubmit(values as CreateOrganizationFormValues);
            }

            return onSubmit(values as UpdateOrganizationFormValues);
          })}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{
                alignItems: { xs: "stretch", md: "flex-start" },
              }}
            >
              <Stack spacing={1.5} sx={{ width: { xs: "100%", md: 300 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <ImageRoundedIcon color="primary" />

                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t("organizations.form.icon")}
                  </Typography>
                </Stack>

                <FileImagePicker
                  title={t("common.upload")}
                  description={t("imagePicker.pickFile")}
                  accept="image/png,image/jpeg,image/jpg"
                  containerProps={{
                    sx: {
                      minHeight: 180,
                    },
                  }}
                  onSelectImage={(files) => {
                    const file = files?.[0];

                    if (!file) return;

                    setValue("icon", file, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  renderContent={() => (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        textAlign: "center",
                      }}
                    >
                      PNG, JPG, JPEG
                    </Typography>
                  )}
                />

                {iconErrorMessage ? (
                  <FormHelperText error>{iconErrorMessage}</FormHelperText>
                ) : null}

                {selectedIcon || defaultValues?.currentIcon ? (
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteRoundedIcon />}
                    onClick={() =>
                      setValue("icon", null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    {t("common.remove")}
                  </Button>
                ) : null}
              </Stack>

              <Stack spacing={2.5} sx={{ flex: 1 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: errors.icon ? "error.main" : "divider",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={previewUrl || undefined}
                    variant="rounded"
                    sx={{
                      width: 96,
                      height: 96,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ImageRoundedIcon />
                  </Avatar>

                  <Stack spacing={0.75} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {selectedIcon instanceof File
                        ? selectedIcon.name
                        : defaultValues?.currentIcon
                          ? t("organizations.form.currentIcon")
                          : t("organizations.form.noIcon")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {t("organizations.form.iconHint")}
                    </Typography>

                    {selectedIcon instanceof File ? (
                      <Chip
                        size="small"
                        label={`${Math.round(selectedIcon.size / 1024)} KB`}
                        sx={{ alignSelf: "flex-start" }}
                      />
                    ) : null}
                  </Stack>
                </Stack>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      label={t("organizations.form.name")}
                      error={Boolean(errors.name)}
                      helperText={nameErrorMessage}
                    />
                  )}
                />

                <Controller
                  name="codeName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      label={t("organizations.form.codeName")}
                      error={Boolean(errors.codeName)}
                      helperText={
                        codeNameErrorMessage || t("organizations.form.codeNameHint")
                      }
                    />
                  )}
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    disabled={!isValid || loading || (mode === "update" && !isDirty)}
                  >
                    {loading ? t("common.saving") : submitLabel}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
