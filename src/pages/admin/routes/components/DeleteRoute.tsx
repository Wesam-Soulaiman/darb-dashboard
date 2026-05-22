import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteRoute } from "../../../../hooks/locations/useRoutes";
import type { TransitRoute } from "../../../../types/route.types";

type DeleteRouteProps = {
  route: TransitRoute;
};

const DeleteRoute = ({ route }: DeleteRouteProps) => {
  const { t } = useTranslation();
  const deleteRoute = useDeleteRoute();

  return (
    <DeletePopupAction
      item={route}
      loading={deleteRoute.isPending}
      title={t("routes.deleteTitle")}
      description={t("routes.deleteDescription", {
        name: route.name,
      })}
      tooltip={t("common.delete")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      onConfirm={async (selectedRoute) => {
        await deleteRoute.mutateAsync(selectedRoute.id);
      }}
    />
  );
};

export default DeleteRoute;