import {
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useUpdateOperationalProfile } from "../../../../hooks/users/useUsers";
import type { UserListItem } from "../../../../types/user.types";
import OperationalProfileForm from "./OperationalProfileForm";
import type { OperationalProfileFormValues } from "../../../../schemas/users/userSchemas";

type UpdateOperationalProfileProps = {
  user: UserListItem;
};

const UpdateOperationalProfile = ({
  user,
}: UpdateOperationalProfileProps) => {
  const { t } = useTranslation();

  const updateProfile =
    useUpdateOperationalProfile(user.id);

  const handleSubmit = async (
    values: OperationalProfileFormValues,
    handleClose: () => void,
  ) => {
    await updateProfile.mutateAsync({
      hireDate: values.hireDate || undefined,
      status: values.status,
      licenseNumber:
        values.licenseNumber || undefined,
      licenseExpiry:
        values.licenseExpiry || undefined,
    });

    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("users.organizationUsers.profile")}>
            <span>
              <IconButton
                size="small"
                color="info"
                onClick={handleOpen}
                disabled={updateProfile.isPending}
                aria-label={t("users.organizationUsers.profile")}
              >
                <BadgeRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t("users.organizationUsers.profile")}
          </DialogTitle>

          <DialogContent dividers>
            <OperationalProfileForm
              defaultValues={{
                hireDate: user.profile?.hireDate ?? "",
                status: user.profile?.status ?? "ACTIVE",
                licenseNumber: "",
                licenseExpiry: user.profile?.licenseExpiry ?? "",
              }}
              loading={updateProfile.isPending}
              submitLabel={t("common.save")}
              onSubmit={(values) =>
                handleSubmit(values, handleClose)
              }
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default UpdateOperationalProfile;