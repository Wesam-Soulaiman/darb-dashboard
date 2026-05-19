import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateStop } from "../../../../hooks/locations/useStops";
import type { StopFormValues } from "../../../../schemas/locations/stopSchemas";
import StopForm from "./StopForm";

const CreateStop = () => {
  const { t } = useTranslation();
  const createStop = useCreateStop();

  const handleSubmit = async (
    values: StopFormValues,
    handleClose: () => void,
  ) => {
    await createStop.mutateAsync({
      name: values.name,
      placeId: values.placeId,
      coordinates: values.coordinates,
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
          {t("stops.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("stops.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <StopForm
              loading={createStop.isPending}
              submitLabel={t("stops.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateStop;