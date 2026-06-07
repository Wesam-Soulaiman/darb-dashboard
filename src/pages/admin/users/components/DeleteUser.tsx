import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteUser } from "../../../../hooks/users/useUsers";
import type { UserListItem } from "../../../../types/user.types";

type DeleteUserProps = {
  user: UserListItem;
};

const DeleteUser = ({ user }: DeleteUserProps) => {
  const { t } = useTranslation();
  const deleteUser = useDeleteUser();

  const userName =
    `${user.firstName} ${user.lastName}`.trim();

  return (
    <DeletePopupAction<UserListItem>
      item={user}
      title={t("users.delete.title")}
      description={t("users.delete.description", {
        name: userName,
      })}
      tooltip={t("users.delete.tooltip")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      loading={deleteUser.isPending}
      onConfirm={async (selectedUser) => {
        await deleteUser.mutateAsync(selectedUser.id);
      }}
    />
  );
};

export default DeleteUser;