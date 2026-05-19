import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import OrganizationForm from "./components/OrganizationForm";
import { useCreateOrganization } from "../../../hooks/organizations/useOrganizations";
import type { CreateOrganizationFormValues } from "../../../schemas/organizations/organizationSchemas";

const CreateOrganizationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createOrganization = useCreateOrganization();

  const handleSubmit = async (values: CreateOrganizationFormValues) => {
    await createOrganization.mutateAsync({
      name: values.name,
      codeName: values.codeName,
      icon: values.icon,
    });

    navigate("/admin/dashboard/organizations");
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <AddBusinessRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("organizations.createTitle")}
            </Typography>

            <Typography color="text.secondary">
              {t("organizations.createSubtitle")}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={Link}
          to="/admin/dashboard/organizations"
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            borderRadius: 2,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          {t("common.back")}
        </Button>
      </Stack>

      <OrganizationForm
        mode="create"
        loading={createOrganization.isPending}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
};

export default CreateOrganizationPage;