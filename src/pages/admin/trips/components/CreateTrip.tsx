import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateTrip } from "../../../../hooks/organizations/useTrips";
import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { Bus } from "../../../../types/bus.types";
import type { OrganizationRoute } from "../../../../types/organization.types";
import type { Schedule } from "../../../../types/schedule.types";
import TripForm from "./TripForm";
import { buildTripPayload } from "./tripPayload";

type CreateTripProps = {
  orgId: number;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
};

const blurActiveElement = () => {
  const activeElement = document.activeElement as HTMLElement | null;

  if (activeElement && activeElement !== document.body) {
    activeElement.blur();
  }
};

const CreateTrip = ({
  orgId,
  orgRoutes,
  schedules,
  buses,
}: CreateTripProps) => {
  const { t } = useTranslation();
  const createTrip = useCreateTrip(orgId);

  const handleSubmit = async (
    values: TripFormValues,
    handleClose: () => void,
  ) => {
    await createTrip.mutateAsync(buildTripPayload(values));

    blurActiveElement();

    requestAnimationFrame(() => {
      handleClose();
    });
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={(event) => {
            event.currentTarget.blur();

            requestAnimationFrame(() => {
              handleOpen();
            });
          }}
          sx={{
            borderRadius: 2,
            px: 2.5,
          }}
        >
          {t("trips.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog
          {...props}
          maxWidth="md"
          fullWidth
          disableRestoreFocus
          onClose={() => {
            blurActiveElement();

            requestAnimationFrame(() => {
              handleClose();
            });
          }}
        >
          <DialogTitle>
            {t("trips.createTitle")}
          </DialogTitle>

          <DialogContent dividers>
            <TripForm
              orgRoutes={orgRoutes}
              schedules={schedules}
              buses={buses}
              loading={createTrip.isPending}
              submitLabel={t("trips.actions.create")}
              disableSubmitWhenPristine={false}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateTrip;