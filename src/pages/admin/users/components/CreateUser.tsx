import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateUser } from "../../../../hooks/users/useUsers";
import CreateUserForm from "./CreateUserForm";
import type { CreateUserFormValues } from "../../../../schemas/users/userSchemas";

type CreateUserMode = "super-admin" | "company-admin";

type CreateUserProps = {
  mode: CreateUserMode;
  organizationId?: number | null;
};

const CreateUser = ({ mode, organizationId = null }: CreateUserProps) => {
  const { t } = useTranslation();
  const createUser = useCreateUser();

  const handleSubmit = async (values: CreateUserFormValues, handleClose: () => void) => {
    const resolvedOrganizationId =
      mode === "company-admin" ? organizationId : values.organizationId;

    await createUser.mutateAsync({
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      organizationId: resolvedOrganizationId ?? null,
      isActive: values.isActive,
      isDriver: values.isDriver,
      hireDate: values.hireDate,

      licenseNumber: values.isDriver ? values.licenseNumber : undefined,

      licenseExpiry: values.isDriver ? values.licenseExpiry : undefined,
    });

    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="contained"
          startIcon={<PersonAddRoundedIcon />}
          onClick={handleOpen}
        >
          {t("users.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("users.actions.create")}</DialogTitle>

          <DialogContent dividers>
            <CreateUserForm
              defaultValues={{
                organizationId: mode === "company-admin" ? organizationId : null,
                isDriver: false,
              }}
              showOrganizationField={mode === "super-admin"}
              loading={createUser.isPending}
              submitLabel={t("common.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateUser;
