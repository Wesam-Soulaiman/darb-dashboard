import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { useTranslation } from "react-i18next";

import type { Run } from "../../../../types/run.types";

import RunStatusChip from "./RunStatusChip";

type RunArchiveCardProps = {
  run: Run;
  routeName: string;
};

const RunArchiveCard = ({ run, routeName }: RunArchiveCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <AccessTimeRoundedIcon color="primary" />

              <Typography
                variant="h5"
                dir="ltr"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 800,
                }}
              >
                {run.operatingTime}
              </Typography>
            </Stack>

            <RunStatusChip status={run.status} />
          </Stack>

          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <CalendarMonthRoundedIcon fontSize="small" />

              <Typography variant="body2">{run.operatingDate}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <RouteRoundedIcon fontSize="small" />

              <Typography variant="body2">{routeName}</Typography>
            </Stack>
          </Stack>

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {t("runs.card.headsign")}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {run.trip.headsign}
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={1.25}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <PersonRoundedIcon fontSize="small" />

              <Typography variant="body2">
                {run.driver
                  ? `${run.driver.firstName} ${run.driver.lastName} — ${run.driver.phone}`
                  : t("runs.card.unassignedDriver")}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <DirectionsBusRoundedIcon fontSize="small" />

              <Typography variant="body2">
                {run.bus
                  ? `${run.bus.plateNumber} — ${run.bus.busCode}`
                  : t("runs.card.unassignedBus")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RunArchiveCard;
