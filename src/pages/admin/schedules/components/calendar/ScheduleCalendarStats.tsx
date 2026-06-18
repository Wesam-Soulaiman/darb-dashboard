import { Box, Paper, Stack, Typography } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useTranslation } from "react-i18next";

type ScheduleCalendarStatsProps = {
  schedulesCount: number;
  activeSchedulesCount: number;
  inactiveSchedulesCount: number;
};

const ScheduleCalendarStats = ({
  schedulesCount,
  activeSchedulesCount,
  inactiveSchedulesCount,
}: ScheduleCalendarStatsProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <CalendarMonthRoundedIcon color="primary" />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {schedulesCount}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("schedules.calendar.totalSchedules")}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <EventAvailableRoundedIcon color="success" />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {activeSchedulesCount}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("schedules.calendar.activeSchedules")}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <BlockRoundedIcon color="disabled" />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {inactiveSchedulesCount}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("schedules.calendar.inactiveSchedules")}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ScheduleCalendarStats;
