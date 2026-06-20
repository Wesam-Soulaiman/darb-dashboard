import { useMemo, useState } from "react";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useTranslation } from "react-i18next";

import {
  useUpdateOperationalProfile,
  useUpdateUser,
  useUser,
} from "../../../../hooks/users/useUsers";
import type { UserListItem } from "../../../../types/user.types";
import OperationalProfileForm from "./OperationalProfileForm";
import type { OperationalProfileFormValues } from "../../../../schemas/users/userSchemas";

type UpdateOperationalProfileProps = {
  user: UserListItem;
};

const UpdateOperationalProfile = ({ user }: UpdateOperationalProfileProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const userDetails = useUser(open ? user.id : undefined);

  const updateUser = useUpdateUser(user.id);

  const updateProfile = useUpdateOperationalProfile(user.id);

  const profile = userDetails.data?.profile ?? user.profile;

  const currentIsDriver = userDetails.data?.isDriver ?? user.isDriver;

  const defaultValues = useMemo(
    () => ({
      hireDate: profile?.hireDate ?? "",
      status: profile?.status ?? "ACTIVE",
      isDriver: currentIsDriver,
      licenseNumber: profile?.licenseNumber ?? "",
      licenseExpiry: profile?.licenseExpiry ?? "",
    }),
    [
      currentIsDriver,
      profile?.hireDate,
      profile?.status,
      profile?.licenseNumber,
      profile?.licenseExpiry,
    ],
  );

  const loading = updateUser.isPending || updateProfile.isPending;

  const handleClose = () => {
    if (loading) {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (values: OperationalProfileFormValues) => {
    if (values.isDriver !== currentIsDriver) {
      await updateUser.mutateAsync({
        isDriver: values.isDriver,
      });
    }

    await updateProfile.mutateAsync({
      hireDate: values.hireDate || undefined,

      status: values.status,

      licenseNumber: values.isDriver ? values.licenseNumber : undefined,

      licenseExpiry: values.isDriver ? values.licenseExpiry : undefined,
    });

    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("users.organizationUsers.profile")}>
        <span>
          <IconButton
            size="small"
            color="info"
            onClick={() => setOpen(true)}
            disabled={loading}
            aria-label={t("users.organizationUsers.profile")}
          >
            <BadgeRoundedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t("users.organizationUsers.profile")}</DialogTitle>

        <DialogContent dividers>
          {userDetails.isLoading ? (
            <Stack
              sx={{
                minHeight: 240,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Stack>
          ) : !profile ? (
            <Alert severity="warning">{t("users.organizationUsers.noProfile")}</Alert>
          ) : (
            <OperationalProfileForm
              defaultValues={defaultValues}
              loading={loading}
              submitLabel={t("common.save")}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateOperationalProfile;
