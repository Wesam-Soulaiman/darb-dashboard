import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTranslation } from "react-i18next";

import type { Bus } from "../../../../types/bus.types";
import type { Run } from "../../../../types/run.types";
import type { UserListItem } from "../../../../types/user.types";

import ConfirmRunAction from "./ConfirmRunAction";
import CancelRunAction from "./CancelRunAction";
import RunAssignmentDialog from "./RunAssignmentDialog";
import RunStatusChip from "./RunStatusChip";
import { memo } from "react";

type RunCardProps = {
  run: Run;
  drivers: UserListItem[];
  buses: Bus[];
  optionsLoading?: boolean;
  onTrack?: (run: Run) => void;
};

const RunCard = ({
  run,
  drivers,
  buses,
  optionsLoading = false,
  onTrack,
}: RunCardProps) => {
  const { t } = useTranslation();

  const canEditAssignment = run.status === "draft" || run.status === "confirmed";
  const canCancel = run.status === "draft" || run.status === "confirmed";

  const hasMissingAssignment = !run.driver || !run.bus;

  const trackButton = (
    <Button
      size="small"
      variant="contained"
      startIcon={<GpsFixedRoundedIcon />}
      disabled={!onTrack}
      onClick={() => {
        onTrack?.(run);
      }}
    >
      {t("runs.actions.track")}
    </Button>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.5}
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
                  fontWeight: 800,
                  fontFamily: "monospace",
                }}
              >
                {run.operatingTime}
              </Typography>
            </Stack>

            <RunStatusChip status={run.status} />
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

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <PersonRoundedIcon
                fontSize="small"
                color={run.driver ? "action" : "disabled"}
              />

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.card.driver")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {run.driver
                    ? `${run.driver.firstName} ${run.driver.lastName}`
                    : t("runs.card.unassignedDriver")}
                </Typography>

                {run.driver && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {run.driver.phone}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <DirectionsBusRoundedIcon
                fontSize="small"
                color={run.bus ? "action" : "disabled"}
              />

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.card.bus")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {run.bus
                    ? `${run.bus.plateNumber} — ${run.bus.busCode}`
                    : t("runs.card.unassignedBus")}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {hasMissingAssignment && canEditAssignment && (
            <Alert severity="warning">{t("runs.card.assignmentMissing")}</Alert>
          )}

          {run.status === "confirmed" && (
            <Alert severity="info">{t("runs.card.waitingForStart")}</Alert>
          )}

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
            }}
          >
            {canEditAssignment && (
              <RunAssignmentDialog
                run={run}
                drivers={drivers}
                buses={buses}
                optionsLoading={optionsLoading}
              />
            )}

            {run.status === "draft" && <ConfirmRunAction run={run} />}

            {run.status === "in_progress" &&
              (onTrack ? (
                trackButton
              ) : (
                <Tooltip title={t("runs.tracking.comingSoon")}>
                  <span>{trackButton}</span>
                </Tooltip>
              ))}
            {canCancel && <CancelRunAction run={run} />}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default memo(RunCard);
