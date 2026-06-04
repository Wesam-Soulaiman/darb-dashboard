import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateBus } from "../../../../hooks/organizations/useBuses";
import type { CreateBusFormValues } from "../../../../schemas/organizations/busSchemas";
import BusForm from "./BusForm";

type CreateBusProps = {
  orgId: number;
};

const CreateBus = ({ orgId }: CreateBusProps) => {
  const { t } = useTranslation();
  const createBus = useCreateBus(orgId);

  const handleSubmit = async (
    values: CreateBusFormValues,
    handleClose: () => void,
    ) => {
    await createBus.mutateAsync({
        plateNumber: values.plateNumber,
        type: values.type,
        capacity: values.capacity,
        manufacturer: values.manufacturer,
        model: values.model,
        year: values.year,
        registrationExpiry: values.registrationExpiry,
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
          {t("buses.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("buses.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <BusForm
              mode="create"
              loading={createBus.isPending}
              submitLabel={t("buses.actions.create")}
              onSubmit={(values) =>
                handleSubmit(values as CreateBusFormValues, handleClose)
              }
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateBus;