import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateUser } from "../../../../hooks/users/useUsers";
import CreateUserForm from "./CreateUserForm";
import type { CreateUserFormValues } from "../../../../schemas/users/userSchemas";

type CreateUserProps = {
  mode: "super-admin" | "company-admin";
  organizationId?: number | null;
};

const CreateUser = ({ mode, organizationId = null }: CreateUserProps) => {
  const { t } = useTranslation();
  const createUser = useCreateUser();

  const isSuperAdminMode = mode === "super-admin";

  const handleSubmit = async (values: CreateUserFormValues, handleClose: () => void) => {
    await createUser.mutateAsync({
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      organizationId: isSuperAdminMode ? values.organizationId : organizationId,
      isActive: values.isActive,
      hireDate: values.hireDate,
      licenseNumber: values.licenseNumber || undefined,
      licenseExpiry: values.licenseExpiry || undefined,
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
          {isSuperAdminMode
            ? t("users.actions.create")
            : t("users.organizationUsers.createStaff")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>
            {isSuperAdminMode
              ? t("users.createTitle")
              : t("users.organizationUsers.createStaff")}
          </DialogTitle>

          <DialogContent dividers>
            <CreateUserForm
              showOrganizationField={isSuperAdminMode}
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
