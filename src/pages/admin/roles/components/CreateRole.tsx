import { Button } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateRole } from "../../../../hooks/roles/useRoles";
import type { RoleFormValues } from "../../../../schemas/roles/roleSchemas";
import RoleForm from "./RoleForm";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const CreateRole = () => {
  const { t } = useTranslation();
  const createRole = useCreateRole();

  const handleSubmit = async (
    values: RoleFormValues,
    handleClose: () => void,
  ) => {
    await createRole.mutateAsync({
      name: values.name,
      description: values.description,
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
          {t("roles.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("roles.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <RoleForm
              loading={createRole.isPending}
              submitLabel={t("roles.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateRole;