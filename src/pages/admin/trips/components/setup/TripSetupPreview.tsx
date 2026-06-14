import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import DatePickerInput from "../../../../../components/inputs/DatePickerInput";
import { useTripPreviewTimes } from "../../../../../hooks/organizations/useTrips";
import type { Trip, TripCalendarStatus } from "../../../../../types/trip.types";

type TripSetupPreviewProps = {
  trip: Trip;
  hasUnsavedChanges: boolean;
};

type StatusColor = "success" | "info" | "error" | "default";

const getToday = () => {
  return dayjs().format("YYYY-MM-DD");
};

const getStatusColor = (status: TripCalendarStatus): StatusColor => {
  switch (status) {
    case "allowed":
      return "success";

    case "forced":
      return "info";

    case "blocked":
      return "error";

    default:
      return "default";
  }
};

const getStatusSeverity = (
  status: TripCalendarStatus,
): "success" | "info" | "error" | "warning" => {
  switch (status) {
    case "allowed":
      return "success";

    case "forced":
      return "info";

    case "blocked":
      return "error";

    default:
      return "warning";
  }
};

const getStatusIcon = (status: TripCalendarStatus) => {
  switch (status) {
    case "allowed":
      return <CheckCircleRoundedIcon />;

    case "forced":
      return <InfoRoundedIcon />;

    case "blocked":
      return <BlockRoundedIcon />;

    default:
      return <InfoRoundedIcon />;
  }
};

const TripSetupPreview = ({ trip, hasUnsavedChanges }: TripSetupPreviewProps) => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [requestedDate, setRequestedDate] = useState<string | null>(null);

  const preview = useTripPreviewTimes(
    trip.organizationId,
    trip.id,
    requestedDate ?? "",
    Boolean(requestedDate),
  );

  const handlePreview = () => {
    if (!selectedDate) {
      return;
    }

    if (requestedDate === selectedDate) {
      void preview.refetch();
      return;
    }

    setRequestedDate(selectedDate);
  };

  return (
    <Stack spacing={2.5}>
      <Alert severity="info" icon={<VisibilityRoundedIcon />} sx={{ borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>{t("trips.setup.preview.title")}</Typography>

        <Typography variant="body2">{t("trips.setup.preview.description")}</Typography>
      </Alert>

      {hasUnsavedChanges && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 900 }}>
            {t("trips.setup.preview.unsavedTitle")}
          </Typography>

          <Typography variant="body2">
            {t("trips.setup.preview.unsavedWarning")}
          </Typography>
        </Alert>
      )}

      <Card variant="outlined" sx={{ borderRadius: 1 }}>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "minmax(0, 1fr) auto",
              },
              gap: 2,
              alignItems: "start",

              "& .MuiFormControl-root": {
                m: 0,
              },

              "& .MuiInputBase-root": {
                minHeight: 56,
              },
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                alignSelf: "start",
              }}
            >
              <DatePickerInput
                name="tripPreviewDate"
                label={t("trips.setup.preview.date")}
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(value) => {
                  const nextDate = value?.isValid() ? value.format("YYYY-MM-DD") : "";

                  setSelectedDate(nextDate);
                  setRequestedDate(null);
                }}
                required
              />
            </Box>

            <Button
              type="button"
              variant="contained"
              startIcon={
                preview.isFetching ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <VisibilityRoundedIcon />
                )
              }
              onClick={handlePreview}
              disabled={!selectedDate || preview.isFetching}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                minWidth: {
                  sm: 190,
                },
                height: 56,
                minHeight: 56,
                alignSelf: "start",
                px: 3,
                borderRadius: 1,
                whiteSpace: "nowrap",
                fontWeight: 800,
              }}
            >
              {preview.isFetching
                ? t("trips.setup.preview.loading")
                : t("trips.setup.preview.action")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {preview.isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void preview.refetch()}>
              {t("common.retry")}
            </Button>
          }
          sx={{ borderRadius: 3 }}
        >
          {t("trips.setup.preview.error")}
        </Alert>
      )}

      {requestedDate && preview.data && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 6,
              bgcolor: `${getStatusColor(preview.data.status)}.main`,
            }}
          />

          <CardContent>
            <Stack spacing={2.5}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                sx={{
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {t("trips.setup.preview.result")}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {dayjs(requestedDate).format("YYYY/MM/DD")}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip
                    icon={getStatusIcon(preview.data.status)}
                    color={getStatusColor(preview.data.status)}
                    label={t(`trips.preview.status.${preview.data.status}`)}
                  />

                  <Chip
                    variant="outlined"
                    label={t("trips.setup.preview.departuresCount", {
                      count: preview.data.departures.length,
                    })}
                  />
                </Stack>
              </Stack>

              <Alert
                severity={getStatusSeverity(preview.data.status)}
                sx={{ borderRadius: 2 }}
              >
                {t(`trips.setup.preview.statusDescription.${preview.data.status}`)}
              </Alert>

              {preview.data.departures.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <EventAvailableRoundedIcon
                    color="disabled"
                    sx={{
                      fontSize: 44,
                      mb: 1,
                    }}
                  />

                  <Typography sx={{ fontWeight: 900 }}>
                    {t("trips.setup.preview.noDepartures")}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(4, minmax(0, 1fr))",
                      md: "repeat(6, minmax(0, 1fr))",
                    },
                    gap: 1,
                  }}
                >
                  {preview.data.departures.map((departure, index) => (
                    <Box
                      key={`${departure}-${index}`}
                      sx={{
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {t("trips.setup.preview.departureNumber", {
                          number: index + 1,
                        })}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontFamily: "monospace",
                        }}
                      >
                        {departure}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default TripSetupPreview;
