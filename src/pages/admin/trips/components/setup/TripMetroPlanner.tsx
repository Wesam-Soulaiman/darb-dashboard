import { Alert, Stack, Typography } from "@mui/material";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { useTranslation } from "react-i18next";

import type { TripSetupStop } from "./tripSetup.types";
import TripDesktopMetroMap from "./route-planner/TripDesktopMetroMap";
import TripMobileTimeline from "./route-planner/TripMobileTimeline";
import TripStopEditorDrawer from "./route-planner/TripStopEditorDrawer";
import TripTimeGenerator from "./route-planner/TripTimeGenerator";
import { useTripMetroPlanner } from "./route-planner/useTripMetroPlanner";

type TripMetroPlannerProps = {
  stops: TripSetupStop[];
  disabled?: boolean;
  onChange: (stops: TripSetupStop[]) => void;
};

const TripMetroPlanner = ({
  stops,
  disabled = false,
  onChange,
}: TripMetroPlannerProps) => {
  const { t } = useTranslation();

  const planner = useTripMetroPlanner({
    stops,
    onChange,
  });

  return (
    <Stack spacing={2.5}>
      <Alert severity="info" icon={<RouteRoundedIcon />} sx={{ borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>
          {t("trips.setup.routePlanner.title")}
        </Typography>

        <Typography variant="body2">
          {t("trips.setup.routePlanner.description")}
        </Typography>
      </Alert>

      <TripTimeGenerator
        startTime={planner.startTime}
        defaultTravelMinutes={planner.defaultTravelMinutes}
        defaultDwellMinutes={planner.defaultDwellMinutes}
        enabledStopsCount={planner.enabledStopsCount}
        skippedStopsCount={planner.skippedStopsCount}
        disabled={disabled}
        hasStops={stops.length > 0}
        onStartTimeChange={planner.setStartTime}
        onTravelMinutesChange={planner.setDefaultTravelMinutes}
        onDwellMinutesChange={planner.setDefaultDwellMinutes}
        onGenerate={planner.handleGenerateTimes}
      />

      <TripDesktopMetroMap
        stops={stops}
        selectedStopId={planner.selectedStopId}
        disabled={disabled}
        onSelectStop={planner.openStopEditor}
        onTravelMinutesChange={planner.handleTravelMinutesChange}
      />

      <TripMobileTimeline
        stops={stops}
        selectedStopId={planner.selectedStopId}
        disabled={disabled}
        onSelectStop={planner.openStopEditor}
      />

      <TripStopEditorDrawer
        stop={planner.selectedStop}
        stopIndex={planner.selectedStopIndex}
        disabled={disabled}
        onClose={planner.closeStopEditor}
        onEnabledChange={planner.handleStopEnabledChange}
        onTravelMinutesChange={planner.handleTravelMinutesChange}
        onArrivalTimeChange={planner.handleArrivalTimeChange}
        onDwellMinutesChange={planner.handleDwellMinutesChange}
        onDepartureTimeChange={planner.handleDepartureTimeChange}
        onPatchStop={planner.updateSelectedStop}
      />
    </Stack>
  );
};

export default TripMetroPlanner;
