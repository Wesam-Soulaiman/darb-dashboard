import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateUser } from "../../../../hooks/users/useUsers";
import type { UserFormValues } from "../../../../schemas/users/userSchemas";
import UserForm from "./UserForm";

const CreateUser = () => {
  const { t } = useTranslation();
  const createUser = useCreateUser();

  const handleSubmit = async (
    values: UserFormValues,
    handleClose: () => void,
  ) => {
    await createUser.mutateAsync({
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      organizationId: values.organizationId ?? null,
    });

    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
          sx={{
            borderRadius: 2,
            px: 2.5,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          {t("users.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("users.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <UserForm
              loading={createUser.isPending}
              submitLabel={t("users.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateUser;