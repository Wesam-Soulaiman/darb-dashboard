import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateUser } from "../../../../hooks/users/useUsers";
import type { User } from "../../../../types/user.types";
import type { UserFormValues } from "../../../../schemas/users/userSchemas";
import UserForm from "./UserForm";

type UpdateUserProps = {
  user: User;
};

const UpdateUser = ({ user }: UpdateUserProps) => {
  const { t } = useTranslation();
  const updateUser = useUpdateUser(user.id);

  const handleSubmit = async (
    values: UserFormValues,
    handleClose: () => void,
  ) => {
    await updateUser.mutateAsync({
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      organizationId: values.organizationId ?? null,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("users.editTitle")}
      tooltip={t("common.edit")}
      maxWidth="sm"
    >
      {({ handleClose }) => (
        <UserForm
          loading={updateUser.isPending}
          submitLabel={t("users.actions.update")}
          defaultValues={{
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            organizationId: user.organizationId,
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateUser;