import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateOrganization } from "../../../../hooks/organizations/useOrganizations";
import type { Organization } from "../../../../types/organization.types";
import type { UpdateOrganizationFormValues } from "../../../../schemas/organizations/organizationSchemas";

import OrganizationForm from "./OrganizationForm";

type UpdateOrganizationProps = {
  organization: Organization;
};

const UpdateOrganization = ({ organization }: UpdateOrganizationProps) => {
  const { t } = useTranslation();
  const updateOrganization = useUpdateOrganization(organization.id);

  const handleSubmit = async (
    values: UpdateOrganizationFormValues,
    handleClose: () => void,
  ) => {
    await updateOrganization.mutateAsync({
      name: values.name,
      codeName: values.codeName,
      icon: values.icon instanceof File ? values.icon : undefined,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction title={t("organizations.editTitle")} tooltip={t("common.edit")}>
      {({ handleClose }) => (
        <OrganizationForm
          mode="update"
          loading={updateOrganization.isPending}
          defaultValues={{
            name: organization.name,
            codeName: organization.codeName,
            currentIcon: organization.icon,
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateOrganization;
