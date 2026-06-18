import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useUpdateMyProfile } from "../../../../hooks/users/useUsers";
import type { User } from "../../../../types/user.types";
import MyProfileForm from "./MyProfileForm";
import type { MyProfileFormValues } from "../../../../schemas/users/userSchemas";

type UpdateMyProfileProps = {
  user: User;
};

const UpdateMyProfile = ({ user }: UpdateMyProfileProps) => {
  const { t } = useTranslation();
  const updateProfile = useUpdateMyProfile();

  const handleSubmit = async (values: MyProfileFormValues, handleClose: () => void) => {
    await updateProfile.mutateAsync(values);

    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={handleOpen}>
          {t("profile.edit")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("profile.edit")}</DialogTitle>

          <DialogContent dividers>
            <MyProfileForm
              defaultValues={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
              loading={updateProfile.isPending}
              submitLabel={t("common.save")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default UpdateMyProfile;
