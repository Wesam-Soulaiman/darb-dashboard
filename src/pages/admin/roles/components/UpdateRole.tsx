import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateRole } from "../../../../hooks/roles/useRoles";
import type { Role } from "../../../../types/role.types";
import type { RoleFormValues } from "../../../../schemas/roles/roleSchemas";
import RoleForm from "./RoleForm";

type UpdateRoleProps = {
  role: Role;
};

const UpdateRole = ({ role }: UpdateRoleProps) => {
  const { t } = useTranslation();
  const updateRole = useUpdateRole(role.id);

  const handleSubmit = async (values: RoleFormValues, handleClose: () => void) => {
    await updateRole.mutateAsync({
      name: values.name,
      description: values.description,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("roles.editTitle")}
      tooltip={t("common.edit")}
      maxWidth="sm"
    >
      {({ handleClose }) => (
        <RoleForm
          loading={updateRole.isPending}
          submitLabel={t("roles.actions.update")}
          defaultValues={{
            name: role.name,
            description: role.description,
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateRole;
