import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { useTranslation } from "react-i18next";

import type { Bus } from "../../../../types/bus.types";
import type { Run } from "../../../../types/run.types";
import type { UserListItem } from "../../../../types/user.types";

import CreateRunsForRoute from "./CreateRunsForRoute";
import RunCard from "./RunCard";
import RunsEmptyState from "./RunsEmptyState";
import { memo } from "react";

type RunRouteSectionProps = {
  orgId: number;
  routeId: string;
  routeName: string;
  runs: Run[];
  drivers: UserListItem[];
  buses: Bus[];
  expanded: boolean;
  optionsLoading?: boolean;
  onExpandedChange: (routeId: string, expanded: boolean) => void;
  onTrack?: (run: Run) => void;
};

const RunRouteSection = ({
  orgId,
  routeId,
  routeName,
  runs,
  drivers,
  buses,
  expanded,
  optionsLoading = false,
  onExpandedChange,
  onTrack,
}: RunRouteSectionProps) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1.5}
          sx={{
            alignItems: {
              xs: "stretch",
              md: "center",
            },
          }}
        >
          <ButtonBase
            onClick={() => onExpandedChange(routeId, !expanded)}
            aria-expanded={expanded}
            sx={{
              flex: 1,
              minWidth: 0,
              justifyContent: "flex-start",
              textAlign: "start",
              borderRadius: 2,
              p: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                width: "100%",
                minWidth: 0,
                alignItems: "center",
              }}
            >
              <RouteRoundedIcon color="primary" />

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {routeName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {expanded ? t("runs.route.collapse") : t("runs.route.expand")}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={t("runs.route.runCount", {
                  count: runs.length,
                })}
              />

              <ExpandMoreRoundedIcon
                sx={{
                  transition: "transform 180ms ease",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Stack>
          </ButtonBase>

          <CreateRunsForRoute
            orgId={orgId}
            routeId={routeId}
            onCreated={() => {
              onExpandedChange(routeId, true);
            }}
          />
        </Stack>

        <Collapse
          in={expanded}
          timeout={{
            enter: 160,
            exit: 120,
          }}
          mountOnEnter
        >
          <Divider
            sx={{
              my: 2,
            }}
          />

          {runs.length === 0 ? (
            <RunsEmptyState
              title={t("runs.empty.title")}
              description={t("runs.empty.description")}
            />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {runs.map((run) => (
                <RunCard
                  key={run.id}
                  run={run}
                  drivers={drivers}
                  buses={buses}
                  optionsLoading={optionsLoading}
                  onTrack={onTrack}
                />
              ))}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default memo(RunRouteSection);
