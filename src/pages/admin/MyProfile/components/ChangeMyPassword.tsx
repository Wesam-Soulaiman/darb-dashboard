import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useChangeMyPassword } from "../../../../hooks/auth/useChangeMyPassword";
import { useAuthContext } from "../../../../contexts/AuthContext";
import ChangeMyPasswordForm from "./ChangeMyPasswordForm";
import type { ChangePasswordFormValues } from "../../../../schemas/auth/changePasswordSchema";

const ChangeMyPassword = () => {
  const { t } = useTranslation();
  const { logout } = useAuthContext();
  const changePassword = useChangeMyPassword();

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await changePassword.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    logout();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="outlined"
          color="warning"
          startIcon={<LockResetRoundedIcon />}
          onClick={handleOpen}
        >
          {t("profile.changePassword")}
        </Button>
      )}
      DialogRender={({ props }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("profile.changePassword")}</DialogTitle>

          <DialogContent dividers>
            <ChangeMyPasswordForm
              loading={changePassword.isPending}
              submitLabel={t("auth.changePassword.submit")}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default ChangeMyPassword;
