import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteOrganization } from "../../../../hooks/organizations/useOrganizations";
import type { Organization } from "../../../../types/organization.types";

type DeleteOrganizationProps = {
  organization: Organization;
};

const DeleteOrganization = ({ organization }: DeleteOrganizationProps) => {
  const { t } = useTranslation();
  const deleteOrganization = useDeleteOrganization();

  return (
    <DeletePopupAction
      item={organization}
      title={t("delete_pop.title", {
        thetypes: t("thetypes.organization"),
      })}
      description={t("delete_pop.desc", {
        thetypes: t("thetypes.organization"),
      })}
      tooltip={t("delete_pop.tooltip")}
      confirmLabel={t("delete_pop.confirm")}
      cancelLabel={t("delete_pop.cancel")}
      loading={deleteOrganization.isPending}
      onConfirm={async (item) => {
        await deleteOrganization.mutateAsync(item.id);
      }}
    />
  );
};

export default DeleteOrganization;
