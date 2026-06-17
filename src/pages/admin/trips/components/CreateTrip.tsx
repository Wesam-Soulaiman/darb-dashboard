import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateTrip } from "../../../../hooks/organizations/useTrips";
import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { Bus } from "../../../../types/bus.types";
import type { OrganizationRoute } from "../../../../types/organization.types";
import type { Schedule } from "../../../../types/schedule.types";
import type { TripDriverRef } from "../../../../types/trip.types";
import TripForm from "./TripForm";
import { buildTripPayload } from "./tripPayload";

type CreateTripProps = {
  orgId: number;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
  drivers: TripDriverRef[];
};

const blurActiveElement = () => {
  const activeElement = document.activeElement as HTMLElement | null;

  if (activeElement && activeElement !== document.body) {
    activeElement.blur();
  }
};

const CreateTrip = ({ orgId, orgRoutes, schedules, buses, drivers }: CreateTripProps) => {
  const { t } = useTranslation();
  const createTrip = useCreateTrip(orgId);

  const handleSubmit = async (values: TripFormValues, handleClose: () => void) => {
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
          disabled={
            orgRoutes.length === 0 ||
            schedules.length === 0 ||
            buses.length === 0 ||
            drivers.length === 0
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
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
            if (createTrip.isPending) {
              return;
            }

            blurActiveElement();

            requestAnimationFrame(() => {
              handleClose();
            });
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                maxHeight: {
                  xs: "calc(100dvh - 16px)",
                  sm: "calc(100dvh - 64px)",
                },
              },
            },
          }}
        >
          <DialogTitle>{t("trips.createTitle")}</DialogTitle>

          <DialogContent
            dividers
            sx={{
              px: {
                xs: 2,
                sm: 3,
              },
              py: 2.5,
            }}
          >
            <TripForm
              orgRoutes={orgRoutes}
              schedules={schedules}
              buses={buses}
              drivers={drivers}
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
