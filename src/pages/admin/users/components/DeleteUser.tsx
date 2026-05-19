import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteUser } from "../../../../hooks/users/useUsers";
import type { User } from "../../../../types/user.types";

type DeleteUserProps = {
  user: User;
};

const DeleteUser = ({ user }: DeleteUserProps) => {
  const { t } = useTranslation();
  const deleteUser = useDeleteUser();

  return (
    <DeletePopupAction
      item={user}
      loading={deleteUser.isPending}
      title={t("users.deleteTitle")}
      description={t("users.deleteDescription", {
        name: `${user.firstName} ${user.lastName}`,
      })}
      tooltip={t("common.delete")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      onConfirm={async (selectedUser) => {
        await deleteUser.mutateAsync(selectedUser.id);
      }}
    />
  );
};

export default DeleteUser;