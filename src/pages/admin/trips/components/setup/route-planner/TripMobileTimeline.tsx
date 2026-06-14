import { Box, ButtonBase, Chip, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { useTranslation } from "react-i18next";

import type { TripSetupStop } from "../tripSetup.types";

type TripMobileTimelineProps = {
  stops: TripSetupStop[];
  selectedStopId: string | null;
  disabled?: boolean;
  onSelectStop: (index: number) => void;
};

const TripMobileTimeline = ({
  stops,
  selectedStopId,
  disabled = false,
  onSelectStop,
}: TripMobileTimelineProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: {
          xs: "block",
          md: "none",
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 900 }}>
          {t("trips.setup.routePlanner.timelineTitle")}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t("trips.setup.routePlanner.timelineDescription")}
        </Typography>
      </Box>

      <Stack sx={{ px: 2, py: 2 }}>
        {stops.map((stop, index) => {
          const selected = selectedStopId === stop.stopId;

          return (
            <Box
              key={stop.stopId}
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "42px minmax(0, 1fr)",
                gap: 1.5,
                pb: index === stops.length - 1 ? 0 : 2.5,
              }}
            >
              <Stack
                sx={{
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: stop.enabled ? "primary.main" : "action.disabled",
                    color: stop.enabled ? "primary.contrastText" : "text.disabled",
                    border: "4px solid",
                    borderColor: "background.paper",
                    outline: "2px solid",
                    outlineColor: stop.enabled ? "primary.main" : "divider",
                  }}
                >
                  {stop.enabled ? (
                    <LocationOnRoundedIcon fontSize="small" />
                  ) : (
                    <NotInterestedRoundedIcon fontSize="small" />
                  )}
                </Box>

                {index < stops.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 36,
                      bottom: -20,
                      width: 4,
                      borderRadius: 99,
                      bgcolor: "primary.main",
                      opacity: 0.45,
                    }}
                  />
                )}
              </Stack>

              <ButtonBase
                onClick={() => onSelectStop(index)}
                disabled={disabled}
                sx={{
                  display: "block",
                  width: "100%",
                  textAlign: "initial",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 1.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: selected ? "primary.main" : "divider",
                    bgcolor: selected
                      ? "action.selected"
                      : stop.enabled
                        ? "background.paper"
                        : "action.hover",
                    opacity: stop.enabled ? 1 : 0.6,
                  }}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {stop.stopName}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {stop.enabled
                            ? t("trips.setup.routePlanner.busStopsHere")
                            : t("trips.setup.routePlanner.busSkipsStop")}
                        </Typography>
                      </Box>

                      <EditRoundedIcon color="action" fontSize="small" />
                    </Stack>

                    {index > 0 && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t("trips.setup.routePlanner.travelDuration", {
                          count: stop.travelMinutesFromPrevious,
                        })}
                        sx={{
                          alignSelf: "flex-start",
                        }}
                      />
                    )}

                    {stop.enabled && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size="medium"
                          color="primary"
                          label={`${t(
                            "trips.setup.routePlanner.arrivalShort",
                          )} ${stop.arrivalTime.slice(0, 5)}`}
                          sx={{ mb: 0.5 }}
                        />

                        <Chip
                          size="medium"
                          variant="outlined"
                          label={`${t(
                            "trips.setup.routePlanner.departureShort",
                          )} ${stop.departureTime.slice(0, 5)}`}
                          sx={{ mb: 0.5 }}
                        />
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </ButtonBase>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default TripMobileTimeline;
