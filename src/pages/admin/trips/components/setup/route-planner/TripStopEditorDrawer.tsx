import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import GtfsTimePicker from "../../../../../../components/inputs/GtfsTimePicker";
import type {
  GtfsPickupDropOffType,
  GtfsTimepoint,
} from "../../../../../../types/trip.types";
import type { TripSetupStop } from "../tripSetup.types";
import { toNonNegativeInteger } from "./tripMetroPlanner.utils";

type TripStopEditorDrawerProps = {
  stop: TripSetupStop | null;
  stopIndex: number | null;
  disabled?: boolean;

  onClose: () => void;
  onEnabledChange: (enabled: boolean) => void;
  onTravelMinutesChange: (index: number, minutes: number) => void;
  onArrivalTimeChange: (value: string) => void;
  onDwellMinutesChange: (minutes: number) => void;
  onDepartureTimeChange: (value: string) => void;
  onPatchStop: (patch: Partial<TripSetupStop>) => void;
};

const TripStopEditorDrawer = ({
  stop,
  stopIndex,
  disabled = false,
  onClose,
  onEnabledChange,
  onTravelMinutesChange,
  onArrivalTimeChange,
  onDwellMinutesChange,
  onDepartureTimeChange,
  onPatchStop,
}: TripStopEditorDrawerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const open = stop !== null && stopIndex !== null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={isMobile ? "bottom" : theme.direction === "rtl" ? "left" : "right"}
      ModalProps={{
        keepMounted: true,
      }}
      slotProps={{
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",

            ...(isMobile
              ? {
                  width: "100%",
                  height: "calc(100dvh - 8px)",
                  maxHeight: "calc(100dvh - 8px)",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }
              : {
                  width: 430,
                  maxWidth: "100vw",
                  height: "100dvh",
                  maxHeight: "100dvh",
                }),
          },
        },
      }}
    >
      {stop && stopIndex !== null && (
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              px: { xs: 2, sm: 2.5 },
              py: 2,
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                minWidth: 0,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: stop.enabled ? "primary.main" : "action.disabled",
                  color: stop.enabled ? "primary.contrastText" : "text.disabled",
                  flexShrink: 0,
                  fontWeight: 900,
                }}
              >
                {stopIndex + 1}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.35,
                    overflowWrap: "anywhere",
                  }}
                >
                  {stop.stopName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t("trips.setup.routePlanner.editingStation", {
                    number: stopIndex + 1,
                  })}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              aria-label={t("common.close")}
              sx={{ flexShrink: 0 }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          {/* Scrollable content */}
          <Stack
            spacing={2.5}
            sx={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarGutter: "stable",
              px: { xs: 2, sm: 2.5 },
              py: 2.5,

              "&::-webkit-scrollbar": {
                width: 7,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "action.disabled",
                borderRadius: 99,
              },
            }}
          >
            <FormControlLabel
              sx={{
                m: 0,
                px: 2,
                py: 1,
                minHeight: 68,
                alignItems: "flex-start",
                border: "1px solid",
                borderColor: stop.enabled ? "success.main" : "divider",
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  flex: 1,
                  minWidth: 0,
                },

                "& .MuiSwitch-root": {
                  mt: 0.25,
                  flexShrink: 0,
                },
              }}
              control={
                <Switch
                  checked={stop.enabled}
                  onChange={(event) => onEnabledChange(event.target.checked)}
                  disabled={disabled}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 900 }}>
                    {stop.enabled
                      ? t("trips.setup.routePlanner.stopEnabled")
                      : t("trips.setup.routePlanner.stopDisabled")}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.25,
                      lineHeight: 1.5,
                    }}
                  >
                    {stop.enabled
                      ? t("trips.setup.routePlanner.stopEnabledDescription")
                      : t("trips.setup.routePlanner.stopDisabledDescription")}
                  </Typography>
                </Box>
              }
            />

            {stopIndex > 0 && (
              <TextField
                fullWidth
                type="number"
                label={t("trips.setup.routePlanner.travelMinutes")}
                value={stop.travelMinutesFromPrevious}
                onChange={(event) =>
                  onTravelMinutesChange(
                    stopIndex,
                    toNonNegativeInteger(event.target.value),
                  )
                }
                disabled={disabled}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                    inputMode: "numeric",
                  },
                }}
              />
            )}

            <GtfsTimePicker
              name={`stop-${stop.stopId}-arrival`}
              label={t("trips.setup.routePlanner.arrivalTime")}
              value={stop.arrivalTime}
              onChange={onArrivalTimeChange}
              disabled={disabled || !stop.enabled}
              required
              maxDayOffset={3}
            />

            <TextField
              fullWidth
              type="number"
              label={t("trips.setup.routePlanner.dwellMinutes")}
              value={stop.dwellMinutes}
              onChange={(event) =>
                onDwellMinutesChange(toNonNegativeInteger(event.target.value))
              }
              disabled={disabled || !stop.enabled}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 1,
                  inputMode: "numeric",
                },
              }}
            />

            <GtfsTimePicker
              name={`stop-${stop.stopId}-departure`}
              label={t("trips.setup.routePlanner.departureTime")}
              value={stop.departureTime}
              onChange={onDepartureTimeChange}
              disabled={disabled || !stop.enabled}
              required
              maxDayOffset={3}
            />

            <Divider />

            <Accordion
              disableGutters
              elevation={0}
              disabled={disabled || !stop.enabled}
              sx={{
                flexShrink: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",

                "&::before": {
                  display: "none",
                },

                "&.Mui-expanded": {
                  mt: 2,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon />}
                sx={{
                  minHeight: 64,

                  "&.Mui-expanded": {
                    minHeight: 64,
                  },

                  "& .MuiAccordionSummary-content": {
                    minWidth: 0,
                    my: 1.25,
                  },

                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    my: 1.25,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    minWidth: 0,
                    alignItems: "center",
                  }}
                >
                  <SettingsRoundedIcon color="action" sx={{ flexShrink: 0 }} />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900 }}>
                      {t("trips.setup.routePlanner.advancedSettings")}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        lineHeight: 1.5,
                      }}
                    >
                      {t("trips.setup.routePlanner.advancedSettingsDescription")}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: { xs: 1.5, sm: 2 },
                  pt: 1,
                  pb: 2,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    select
                    fullWidth
                    label={t("trips.setup.routePlanner.pickupType")}
                    value={stop.pickupType}
                    onChange={(event) =>
                      onPatchStop({
                        pickupType: Number(event.target.value) as GtfsPickupDropOffType,
                      })
                    }
                    disabled={disabled}
                  >
                    {[0, 1, 2, 3].map((value) => (
                      <MenuItem key={value} value={value}>
                        {t(`trips.gtfsPickupTypes.${value}`)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label={t("trips.setup.routePlanner.dropOffType")}
                    value={stop.dropOffType}
                    onChange={(event) =>
                      onPatchStop({
                        dropOffType: Number(event.target.value) as GtfsPickupDropOffType,
                      })
                    }
                    disabled={disabled}
                  >
                    {[0, 1, 2, 3].map((value) => (
                      <MenuItem key={value} value={value}>
                        {t(`trips.gtfsDropOffTypes.${value}`)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControlLabel
                    sx={{
                      m: 0,
                      px: 2,
                      py: 0.75,
                      minHeight: 56,
                    }}
                    control={
                      <Switch
                        checked={stop.timepoint === 1}
                        onChange={(event) =>
                          onPatchStop({
                            timepoint: (event.target.checked ? 1 : 0) as GtfsTimepoint,
                          })
                        }
                        disabled={disabled}
                      />
                    }
                    label={t("trips.setup.routePlanner.exactTime")}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Box
              aria-hidden
              sx={{
                flexShrink: 0,
                height: { xs: 4, sm: 8 },
              }}
            />
          </Stack>

          {/* Footer */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              flexShrink: 0,
              px: { xs: 2, sm: 2.5 },
              pt: 2,
              pb: isMobile ? "calc(16px + env(safe-area-inset-bottom))" : 2,
              borderTop: "1px solid",
              borderColor: "divider",
              justifyContent: "flex-end",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              bgcolor: "background.paper",
            }}
          >
            <Tooltip title={t("trips.setup.routePlanner.editSavedLocally")}>
              <Chip
                icon={<EditRoundedIcon />}
                color="primary"
                onClick={onClose}
                label={t("trips.setup.routePlanner.changesReady")}
                sx={{
                  maxWidth: "100%",

                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Tooltip>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
};

export default TripStopEditorDrawer;
