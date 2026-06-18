import { Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ScheduleCalendarHeaderProps = {
  backToSchedulesPath: string;
  onAddSchedule: () => void;
};

const ScheduleCalendarHeader = ({
  backToSchedulesPath,
  onAddSchedule,
}: ScheduleCalendarHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "stretch", lg: "center" },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <CalendarMonthRoundedIcon />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("schedules.calendar.title")}
          </Typography>

          <Typography color="text.secondary">
            {t("schedules.calendar.allSchedulesSubtitle")}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <Button
          component={RouterLink}
          to={backToSchedulesPath}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ borderRadius: 2 }}
        >
          {t("schedules.calendar.backToTable")}
        </Button>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onAddSchedule}
          sx={{ borderRadius: 2 }}
        >
          {t("schedules.actions.create")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ScheduleCalendarHeader;
