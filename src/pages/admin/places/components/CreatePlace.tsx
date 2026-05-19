import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreatePlace } from "../../../../hooks/locations/usePlaces";
import type { PlaceFormValues } from "../../../../schemas/locations/placeSchemas";
import PlaceForm from "./PlaceForm";

const CreatePlace = () => {
  const { t } = useTranslation();
  const createPlace = useCreatePlace();

  const handleSubmit = async (
    values: PlaceFormValues,
    handleClose: () => void,
  ) => {
    await createPlace.mutateAsync({
      name: values.name,
      governateId: values.governateId,
      center: values.center,
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
          {t("places.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("places.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <PlaceForm
              loading={createPlace.isPending}
              submitLabel={t("places.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreatePlace;