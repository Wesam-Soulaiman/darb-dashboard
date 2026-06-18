import { useRef } from "react";
import { Alert, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";

import { useFullCalendarResize } from "./useFullCalendarResize";

type ScheduleFullCalendarProps = {
  events: EventInput[];
  loading: boolean;
  onRangeSelect: (selection: DateSelectArg) => void;
  onDateClick: (dateClick: DateClickArg) => void;
  onEventClick: (eventClick: EventClickArg) => void;
};

const ScheduleFullCalendar = ({
  events,
  loading,
  onRangeSelect,
  onDateClick,
  onEventClick,
}: ScheduleFullCalendarProps) => {
  const { t, i18n } = useTranslation();

  const calendarRef = useRef<FullCalendar | null>(null);
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

  useFullCalendarResize(calendarRef, calendarWrapperRef);

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        boxShadow: "none",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
        <Stack spacing={2.25}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("schedules.calendar.calendarTitle")}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t("schedules.calendar.allSchedulesDescription")}
              </Typography>
            </Box>
          </Stack>

          {loading && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {t("common.loading")}
            </Alert>
          )}

          <Box
            ref={calendarWrapperRef}
            className="schedule-calendar-shell"
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              buttonText={{
                today: t("common.today", { defaultValue: "Today" }),
                month: t("common.month", { defaultValue: "Month" }),
                week: t("common.week", { defaultValue: "Week" }),
              }}
              height="auto"
              selectable
              selectMirror
              unselectAuto={false}
              events={events}
              select={onRangeSelect}
              dateClick={onDateClick}
              eventClick={onEventClick}
              firstDay={i18n.language.startsWith("ar") ? 6 : 0}
              eventDisplay="block"
              dayMaxEventRows={4}
              locale={i18n.language.startsWith("ar") ? arLocale : "en"}
              eventContent={(eventInfo) => {
                return (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      alignItems: "center",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "currentColor",
                        flexShrink: 0,
                      }}
                    />

                    <Box
                      component="span"
                      sx={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {eventInfo.event.title}
                    </Box>
                  </Stack>
                );
              }}
            />
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            {t("schedules.calendar.allSchedulesHelp")}
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScheduleFullCalendar;
