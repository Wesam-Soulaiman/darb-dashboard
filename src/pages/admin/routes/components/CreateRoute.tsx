import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateRoute } from "../../../../hooks/locations/useRoutes";
import type { RouteFormValues } from "../../../../schemas/locations/routeSchemas";
import RouteForm from "./RouteForm";

const CreateRoute = () => {
  const { t } = useTranslation();
  const createRoute = useCreateRoute();

  const handleSubmit = async (values: RouteFormValues, handleClose: () => void) => {
    await createRoute.mutateAsync({
      name: values.name,
      originPlaceId: values.originPlaceId,
      destinationPlaceId: values.destinationPlaceId,
      mode: values.mode,
      price: values.price,
      line: values.line,
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
          {t("routes.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="md" fullWidth>
          <DialogTitle>{t("routes.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <RouteForm
              loading={createRoute.isPending}
              submitLabel={t("routes.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateRoute;
