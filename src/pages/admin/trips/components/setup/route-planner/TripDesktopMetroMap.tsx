import { Box, ButtonBase, Chip, Stack, TextField, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { TripSetupStop } from "../tripSetup.types";
import { toNonNegativeInteger } from "./tripMetroPlanner.utils";

type TripDesktopMetroMapProps = {
  stops: TripSetupStop[];
  selectedStopId: string | null;
  disabled?: boolean;

  onSelectStop: (index: number) => void;
  onTravelMinutesChange: (index: number, minutes: number) => void;
};

type MetroStopCardProps = {
  stop: TripSetupStop;
  index: number;
  totalStops: number;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
};

const MetroStopCard = ({
  stop,
  index,
  totalStops,
  selected,
  disabled,
  onClick,
}: MetroStopCardProps) => {
  const { t } = useTranslation();

  const isFirst = index === 0;
  const isLast = index === totalStops - 1;

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: 180,
        minWidth: 180,
        borderRadius: 3,
        textAlign: "center",
        alignSelf: "stretch",
      }}
    >
      <Stack
        spacing={1.25}
        sx={{
          width: "100%",
          minHeight: 205,
          p: 2,
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid",
          borderColor: selected
            ? "primary.main"
            : stop.enabled
              ? "divider"
              : "action.disabledBackground",
          bgcolor: selected
            ? "action.selected"
            : stop.enabled
              ? "background.paper"
              : "action.hover",
          borderRadius: 3,
          opacity: stop.enabled ? 1 : 0.55,
          transition: "border-color 160ms ease, transform 160ms ease",

          "&:hover": {
            borderColor: "primary.main",
            transform: disabled ? "none" : "translateY(-2px)",
          },
        }}
      >
        <Stack spacing={0.75} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: stop.enabled ? "primary.main" : "action.disabled",
              color: stop.enabled ? "primary.contrastText" : "text.disabled",
              boxShadow: stop.enabled ? 3 : 0,
              border: "4px solid",
              borderColor: "background.paper",
              outline: "3px solid",
              outlineColor: stop.enabled ? "primary.main" : "divider",
            }}
          >
            {stop.enabled ? (
              <LocationOnRoundedIcon fontSize="small" />
            ) : (
              <NotInterestedRoundedIcon fontSize="small" />
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
            {isFirst
              ? t("trips.setup.routePlanner.startStation")
              : isLast
                ? t("trips.setup.routePlanner.endStation")
                : t("trips.setup.routePlanner.stationNumber", {
                    number: index + 1,
                  })}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontWeight: 900,
            overflowWrap: "anywhere",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {stop.stopName}
        </Typography>

        {stop.enabled ? (
          <Stack spacing={0.25} sx={{ alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              {stop.arrivalTime.slice(0, 5)}
            </Typography>

            <Typography color="text.secondary">
              {t("trips.setup.routePlanner.departureShort")}:{" "}
              {stop.departureTime.slice(0, 5)}
            </Typography>
          </Stack>
        ) : (
          <Chip
            size="medium"
            color="default"
            variant="outlined"
            icon={<NotInterestedRoundedIcon />}
            label={t("trips.setup.routePlanner.skipped")}
          />
        )}

        <Chip
          size="small"
          variant={selected ? "filled" : "outlined"}
          color={selected ? "primary" : "default"}
          icon={<EditRoundedIcon />}
          label={t("trips.setup.routePlanner.editStop")}
        />
      </Stack>
    </ButtonBase>
  );
};

type MetroConnectorProps = {
  minutes: number;
  disabled: boolean;
  onChange: (minutes: number) => void;
};

const MetroConnector = ({ minutes, disabled, onChange }: MetroConnectorProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      spacing={1}
      sx={{
        width: 130,
        minWidth: 130,
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <TextField
        size="small"
        type="number"
        label={t("trips.setup.routePlanner.travelMinutesShort")}
        value={minutes}
        onChange={(event) => onChange(toNonNegativeInteger(event.target.value))}
        disabled={disabled}
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
            inputMode: "numeric",
            style: {
              textAlign: "center",
            },
          },
        }}
        sx={{
          width: 110,

          "& input": {
            fontWeight: 900,
          },
        }}
      />

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 14,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 5,
            borderRadius: 99,
            bgcolor: "primary.main",
            opacity: 0.65,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            insetInlineEnd: -1,
            top: "50%",
            width: 10,
            height: 14,
            bgcolor: "primary.main",
            transform: "translateY(-50%)",

            clipPath:
              theme.direction === "rtl"
                ? "polygon(100% 0, 0 50%, 100% 100%)"
                : "polygon(0 0, 100% 50%, 0 100%)",
          }}
        />
      </Box>
    </Stack>
  );
};

const TripDesktopMetroMap = ({
  stops,
  selectedStopId,
  disabled = false,
  onSelectStop,
  onTravelMinutesChange,
}: TripDesktopMetroMapProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "block",
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900 }}>
            {t("trips.setup.routePlanner.metroTitle")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("trips.setup.routePlanner.metroDescription")}
          </Typography>
        </Box>

        <Chip
          size="medium"
          icon={<RouteRoundedIcon />}
          label={t("trips.setup.routePlanner.totalStops", {
            count: stops.length,
          })}
          variant="outlined"
        />
      </Stack>

      <Box
        sx={{
          overflowX: "auto",
          px: 3,
          py: 3,
          scrollbarWidth: "thin",
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: "max-content",
            minWidth: "100%",
            alignItems: "center",
          }}
        >
          {stops.map((stop, index) => (
            <Stack key={stop.stopId} direction="row" sx={{ alignItems: "center" }}>
              {index > 0 && (
                <MetroConnector
                  minutes={stop.travelMinutesFromPrevious}
                  disabled={disabled}
                  onChange={(minutes) => onTravelMinutesChange(index, minutes)}
                />
              )}

              <MetroStopCard
                stop={stop}
                index={index}
                totalStops={stops.length}
                selected={selectedStopId === stop.stopId}
                disabled={disabled}
                onClick={() => onSelectStop(index)}
              />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default TripDesktopMetroMap;
