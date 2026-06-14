import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useTranslation } from "react-i18next";

import DoubleClickToConfirm from "../../../../../components/actions/DoubleClickToConfirm";
import GtfsTimePicker from "../../../../../components/inputs/GtfsTimePicker";
import type { TripSetupFrequencyWindow } from "./tripSetup.types";
import {
  createDefaultFrequencyWindow,
  gtfsTimeToSeconds,
  isValidGtfsTime,
  secondsToGtfsTime,
} from "./tripSetup.utils";

type TripFrequencyWindowsProps = {
  repeated: boolean;
  windows: TripSetupFrequencyWindow[];
  disabled?: boolean;
  onRepeatedChange: (value: boolean) => void;
  onChange: (windows: TripSetupFrequencyWindow[]) => void;
};

const normalizeHeadwayMinutes = (value: unknown, fallback = 1): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.max(1, Math.round(parsedValue));
};

const getEstimatedDepartures = (window: TripSetupFrequencyWindow) => {
  const headwayMinutes = normalizeHeadwayMinutes(window.headwayMinutes);

  if (!isValidGtfsTime(window.startTime) || !isValidGtfsTime(window.endTime)) {
    return 0;
  }

  const durationSeconds =
    gtfsTimeToSeconds(window.endTime) - gtfsTimeToSeconds(window.startTime);

  if (durationSeconds <= 0) {
    return 0;
  }

  return Math.ceil(durationSeconds / (headwayMinutes * 60));
};

const TripFrequencyWindows = ({
  repeated,
  windows,
  disabled = false,
  onRepeatedChange,
  onChange,
}: TripFrequencyWindowsProps) => {
  const { t } = useTranslation();

  const updateWindow = (clientId: string, patch: Partial<TripSetupFrequencyWindow>) => {
    onChange(
      windows.map((window) =>
        window.clientId === clientId
          ? {
              ...window,
              ...patch,
            }
          : window,
      ),
    );
  };

  const handleAddWindow = () => {
    const nextWindow = createDefaultFrequencyWindow();

    const lastWindow = windows[windows.length - 1];

    if (lastWindow && isValidGtfsTime(lastWindow.endTime)) {
      nextWindow.startTime = lastWindow.endTime;

      nextWindow.endTime = secondsToGtfsTime(
        gtfsTimeToSeconds(lastWindow.endTime) + 3 * 60 * 60,
      );
    }

    onChange([...windows, nextWindow]);
  };

  const handleRemoveWindow = (clientId: string) => {
    onChange(windows.filter((window) => window.clientId !== clientId));
  };

  const totalEstimatedDepartures = windows.reduce(
    (total, window) => total + getEstimatedDepartures(window),
    0,
  );

  return (
    <Stack spacing={2.5}>
      <Alert severity="info" icon={<RepeatRoundedIcon />} sx={{ borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>
          {t("trips.setup.frequency.title")}
        </Typography>

        <Typography variant="body2">{t("trips.setup.frequency.description")}</Typography>
      </Alert>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <FormControlLabel
            sx={{
              m: 0,
              width: "100%",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: repeated ? "primary.main" : "divider",
              transition: "border-color 160ms ease, background-color 160ms ease",

              "& .MuiFormControlLabel-label": {
                flex: 1,
                minWidth: 0,
              },
            }}
            control={
              <Switch
                checked={repeated}
                onChange={(event) => onRepeatedChange(event.target.checked)}
                disabled={disabled}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 900 }}>
                  {t("trips.setup.frequency.repeatQuestion")}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t("trips.setup.frequency.repeatQuestionDescription")}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {!repeated ? (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 900 }}>
            {t("trips.setup.frequency.fixedTripTitle")}
          </Typography>

          <Typography variant="body2">
            {t("trips.setup.frequency.fixedTripDescription")}
          </Typography>
        </Alert>
      ) : (
        <Stack spacing={2}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("trips.setup.frequency.windowsTitle")}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t("trips.setup.frequency.windowsDescription")}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                icon={<ScheduleRoundedIcon />}
                variant="outlined"
                label={t("trips.setup.frequency.windowsCount", {
                  count: windows.length,
                })}
                sx={{ mb: 0.5 }}
              />

              <Chip
                color="primary"
                label={t("trips.setup.frequency.estimatedDepartures", {
                  count: totalEstimatedDepartures,
                })}
                sx={{ mb: 0.5 }}
              />
            </Stack>
          </Stack>

          {windows.length === 0 && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {t("trips.setup.frequency.noWindows")}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                lg: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {windows.map((window, index) => {
              const estimatedDepartures = getEstimatedDepartures(window);

              return (
                <Card
                  key={window.clientId}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    minWidth: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    borderColor: "divider",
                    transition: "border-color 160ms ease, transform 160ms ease",

                    "&:hover": {
                      borderColor: "primary.main",
                      transform: disabled ? "none" : "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 5,
                      bgcolor: "primary.main",
                    }}
                  />

                  <CardContent>
                    <Stack spacing={2.25}>
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={1.5}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: {
                            xs: "stretch",
                            sm: "flex-start",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.25}
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              display: "grid",
                              placeItems: "center",
                              borderRadius: 2.5,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 900,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {t("trips.setup.frequency.windowTitle", {
                                number: index + 1,
                              })}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {t("trips.setup.frequency.windowSubtitle")}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            flexShrink: 0,
                            alignSelf: {
                              xs: "flex-end",
                              sm: "flex-start",
                            },
                          }}
                        >
                          <DoubleClickToConfirm
                            color="error"
                            variant="outlined"
                            size="small"
                            disabled={disabled}
                            resetAfterMs={4000}
                            aria-label={t("trips.setup.frequency.removeWindow")}
                            title={t("trips.setup.frequency.removeWindow")}
                            confirmText={t("trips.setup.frequency.confirmRemoveWindow")}
                            onConfirm={() => {
                              handleRemoveWindow(window.clientId);
                            }}
                            sx={{
                              minWidth: 40,
                              width: 40,
                              height: 40,
                              p: 0,
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </DoubleClickToConfirm>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "repeat(2, minmax(0, 1fr))",
                          },
                          gap: 1.5,

                          "& .MuiFormControl-root": {
                            m: 0,
                          },
                        }}
                      >
                        <GtfsTimePicker
                          name={`frequency-${window.clientId}-start`}
                          label={t("trips.setup.frequency.startTime")}
                          value={window.startTime}
                          onChange={(value) =>
                            updateWindow(window.clientId, {
                              startTime: value,
                            })
                          }
                          disabled={disabled}
                          required
                          maxDayOffset={3}
                        />

                        <GtfsTimePicker
                          name={`frequency-${window.clientId}-end`}
                          label={t("trips.setup.frequency.endTime")}
                          value={window.endTime}
                          onChange={(value) =>
                            updateWindow(window.clientId, {
                              endTime: value,
                            })
                          }
                          disabled={disabled}
                          required
                          maxDayOffset={3}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        type="number"
                        label={t("trips.setup.frequency.headwayMinutes")}
                        value={window.headwayMinutes}
                        onChange={(event) =>
                          updateWindow(window.clientId, {
                            headwayMinutes: normalizeHeadwayMinutes(
                              event.target.value,
                              window.headwayMinutes,
                            ),
                          })
                        }
                        disabled={disabled}
                        helperText={t("trips.setup.frequency.headwayDescription")}
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            step: 1,
                            inputMode: "numeric",
                          },
                        }}
                      />

                      <FormControlLabel
                        sx={{
                          m: 0,
                          px: 2,
                          py: 0.75,
                          minHeight: 58,
                          alignItems: "flex-start",

                          "& .MuiSwitch-root": {
                            mt: 0.25,
                            flexShrink: 0,
                          },

                          "& .MuiFormControlLabel-label": {
                            flex: 1,
                            minWidth: 0,
                          },
                        }}
                        control={
                          <Switch
                            checked={window.exactTimes}
                            onChange={(event) =>
                              updateWindow(window.clientId, {
                                exactTimes: event.target.checked,
                              })
                            }
                            disabled={disabled}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              {t("trips.setup.frequency.exactTimes")}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                lineHeight: 1.5,
                              }}
                            >
                              {t("trips.setup.frequency.exactTimesDescription")}
                            </Typography>
                          </Box>
                        }
                      />

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {t("trips.setup.frequency.windowSummary")}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.5,
                            fontWeight: 900,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {t("trips.setup.frequency.windowSummaryValue", {
                            start: window.startTime.slice(0, 5),
                            end: window.endTime.slice(0, 5),
                            minutes: window.headwayMinutes,
                            count: estimatedDepartures,
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Button
            type="button"
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddWindow}
            disabled={disabled}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              alignSelf: {
                xs: "stretch",
                sm: "flex-start",
              },
              borderRadius: 2.5,
              px: 2.5,
            }}
          >
            {t("trips.setup.frequency.addWindow")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default TripFrequencyWindows;
