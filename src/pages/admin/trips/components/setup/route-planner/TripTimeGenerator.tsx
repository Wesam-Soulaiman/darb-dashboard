import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import { useTranslation } from "react-i18next";

import GtfsTimePicker from "../../../../../../components/inputs/GtfsTimePicker";

type TripTimeGeneratorProps = {
  startTime: string;
  defaultTravelMinutes: number;
  defaultDwellMinutes: number;

  enabledStopsCount: number;
  skippedStopsCount: number;

  disabled?: boolean;
  hasStops: boolean;

  onStartTimeChange: (value: string) => void;
  onTravelMinutesChange: (value: unknown) => void;
  onDwellMinutesChange: (value: unknown) => void;
  onGenerate: () => void;
};

const TripTimeGenerator = ({
  startTime,
  defaultTravelMinutes,
  defaultDwellMinutes,
  enabledStopsCount,
  skippedStopsCount,
  disabled = false,
  hasStops,
  onStartTimeChange,
  onTravelMinutesChange,
  onDwellMinutesChange,
  onGenerate,
}: TripTimeGeneratorProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("trips.setup.routePlanner.generatorTitle")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("trips.setup.routePlanner.generatorDescription")}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              size="small"
              color={enabledStopsCount >= 2 ? "success" : "error"}
              label={t("trips.setup.routePlanner.enabledStopsCount", {
                count: enabledStopsCount,
              })}
            />

            {skippedStopsCount > 0 && (
              <Chip
                size="small"
                variant="outlined"
                label={t("trips.setup.routePlanner.skippedStopsCount", {
                  count: skippedStopsCount,
                })}
              />
            )}
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "start",

            "& > *": {
              minWidth: 0,
            },

            "& .MuiFormControl-root": {
              m: 0,
            },
          }}
        >
          <GtfsTimePicker
            name="tripStartTime"
            label={t("trips.setup.routePlanner.startTime")}
            value={startTime}
            onChange={onStartTimeChange}
            disabled={disabled}
            required
            maxDayOffset={2}
          />

          <TextField
            fullWidth
            type="number"
            label={t("trips.setup.routePlanner.defaultTravelMinutes")}
            value={defaultTravelMinutes}
            onChange={(event) => onTravelMinutesChange(event.target.value)}
            disabled={disabled}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
                inputMode: "numeric",
              },
            }}
          />

          <TextField
            fullWidth
            type="number"
            label={t("trips.setup.routePlanner.defaultDwellMinutes")}
            value={defaultDwellMinutes}
            onChange={(event) => onDwellMinutesChange(event.target.value)}
            disabled={disabled}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
                inputMode: "numeric",
              },
            }}
          />
        </Box>

        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="contained"
            startIcon={<AutoFixHighRoundedIcon />}
            onClick={onGenerate}
            disabled={disabled || !hasStops}
            sx={{
              minHeight: 48,
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: { sm: 190 },
              borderRadius: 2.5,
              px: 3,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            {t("trips.setup.routePlanner.generate")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TripTimeGenerator;
