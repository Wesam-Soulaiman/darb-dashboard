import { useMemo, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuthContext } from "../../../contexts/AuthContext";
import {
  useCreateSchedule,
  useCreateScheduleException,
  useDeleteSchedule,
  useDeleteScheduleException,
  useScheduleExceptions,
  useSchedules,
  useUpdateSchedule,
} from "../../../hooks/organizations/useSchedules";
import type { Schedule, ScheduleException } from "../../../types/schedule.types";
import type {
  ScheduleFormInputValues,
  ScheduleFormValues,
} from "../../../schemas/organizations/scheduleSchemas";
import { MAX_SCHEDULES_LIMIT } from "./components/calendar/scheduleCalendar.constants";
import type {
  ExceptionDraft,
  ScheduleDialogMode,
} from "./components/calendar/scheduleCalendar.types";
import {
  addDays,
  getActiveDayIndexes,
  getDefaultDraft,
  getReadableTextColor,
  getToday,
  hexAlphaToRgba,
  normalizeScheduleColor,
  scheduleToDraft,
  toDateInputValue,
} from "./components/calendar/scheduleCalendar.utils";
import ScheduleCalendarHeader from "./components/calendar/ScheduleCalendarHeader";
import ScheduleCalendarStats from "./components/calendar/ScheduleCalendarStats";
import ScheduleCalendarStyles from "./components/calendar/ScheduleCalendarStyles";
import ScheduleDialog from "./components/calendar/ScheduleDialog";
import ScheduleExceptionDialog from "./components/calendar/ScheduleExceptionDialog";
import ScheduleFullCalendar from "./components/calendar/ScheduleFullCalendar";

const ScheduleCalendarPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { user, isSuperAdmin } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const schedules = useSchedules(orgId, {
    page: 1,
    limit: MAX_SCHEDULES_LIMIT,
  });

  const schedulesList = useMemo(() => {
    return schedules.data?.data ?? [];
  }, [schedules.data?.data]);

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const [scheduleDialogMode, setScheduleDialogMode] =
    useState<ScheduleDialogMode>("create");

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [scheduleDefaultValues, setScheduleDefaultValues] = useState<
    Partial<ScheduleFormInputValues>
  >(() => getDefaultDraft());

  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);

  const [exceptionDraft, setExceptionDraft] = useState<ExceptionDraft>({
    exceptionDate: getToday(),
    exceptionType: 1,
    note: "",
  });

  const selectedScheduleId = selectedSchedule?.id ?? 0;

  const exceptions = useScheduleExceptions(
    orgId,
    selectedScheduleId,
    scheduleDialogOpen && scheduleDialogMode === "edit" && selectedScheduleId > 0,
  );

  const createSchedule = useCreateSchedule(orgId);
  const updateSchedule = useUpdateSchedule(orgId, selectedScheduleId);
  const deleteSchedule = useDeleteSchedule(orgId);

  const createException = useCreateScheduleException(orgId, selectedScheduleId);
  const deleteException = useDeleteScheduleException(orgId, selectedScheduleId);

  const calendarEvents = useMemo<EventInput[]>(() => {
    return schedulesList.reduce<EventInput[]>((events, schedule) => {
      const draft = scheduleToDraft(schedule);
      const scheduleColor = normalizeScheduleColor(schedule.color);
      const scheduleBackgroundColor = hexAlphaToRgba(scheduleColor);
      const scheduleTextColor = getReadableTextColor(scheduleColor);

      if (!draft.startDate || !draft.endDate) {
        return events;
      }

      events.push({
        id: `schedule-${schedule.id}`,
        title: schedule.name || t("schedules.title"),
        daysOfWeek: getActiveDayIndexes(draft),
        startRecur: draft.startDate,
        endRecur: addDays(draft.endDate, 1),
        allDay: true,
        backgroundColor: schedule.isActive ? scheduleBackgroundColor : undefined,
        borderColor: schedule.isActive ? scheduleBackgroundColor : undefined,
        textColor: schedule.isActive ? scheduleTextColor : undefined,
        classNames: schedule.isActive
          ? ["schedule-colored-event"]
          : ["schedule-inactive-event"],
        extendedProps: {
          type: "schedule",
          scheduleId: schedule.id,
          serviceCode: schedule.serviceCode ?? "",
          isActive: Boolean(schedule.isActive),
          scheduleColor,
          scheduleBackgroundColor,
        },
      });

      const scheduleExceptions = Array.isArray(schedule.exceptions)
        ? schedule.exceptions
        : [];

      scheduleExceptions.forEach((exception) => {
        const exceptionDate = toDateInputValue(exception.exceptionDate, "");

        if (!exceptionDate) return;

        const isAdded = exception.exceptionType === 1;

        events.push({
          id: `schedule-${schedule.id}-exception-${exception.id}`,
          title: `${t(
            `schedules.exceptions.types.${exception.exceptionType}`,
          )} - ${schedule.name || t("schedules.title")}`,
          start: exceptionDate,
          allDay: true,
          classNames: isAdded
            ? ["schedule-exception-added"]
            : ["schedule-exception-removed"],
          extendedProps: {
            type: "exception",
            scheduleId: schedule.id,
            exceptionId: exception.id,
            exceptionType: exception.exceptionType,
            serviceCode: schedule.serviceCode ?? "",
            note: exception.note ?? "",
            scheduleColor,
            scheduleBackgroundColor,
          },
        });
      });

      return events;
    }, []);
  }, [schedulesList, t]);

  const schedulesCount = schedules.data?.meta.total ?? 0;

  const activeSchedulesCount = schedulesList.filter(
    (schedule) => schedule.isActive,
  ).length;

  const inactiveSchedulesCount = schedulesList.filter(
    (schedule) => !schedule.isActive,
  ).length;

  const updateExceptionDraft = <Key extends keyof ExceptionDraft>(
    key: Key,
    value: ExceptionDraft[Key],
  ) => {
    setExceptionDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openCreateScheduleDialog = (startDate?: string, endDate?: string) => {
    const defaultDraft = getDefaultDraft();

    setSelectedSchedule(null);
    setScheduleDialogMode("create");
    setScheduleDefaultValues({
      ...defaultDraft,
      startDate: startDate ?? defaultDraft.startDate,
      endDate: endDate ?? defaultDraft.endDate,
    });
    setScheduleDialogOpen(true);
  };

  const openEditScheduleDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setScheduleDialogMode("edit");
    setScheduleDefaultValues(scheduleToDraft(schedule));
    setScheduleDialogOpen(true);
  };

  const closeScheduleDialog = () => {
    setScheduleDialogOpen(false);
    setExceptionDialogOpen(false);
  };

  const handleSaveSchedule = async (values: ScheduleFormValues) => {
    const payload = {
      ...values,
      name: values.name.trim(),
      serviceCode: values.serviceCode.trim(),
      color: normalizeScheduleColor(values.color),
    };

    if (scheduleDialogMode === "create") {
      const createdSchedule = await createSchedule.mutateAsync(payload);

      setSelectedSchedule(createdSchedule);
      setScheduleDefaultValues(scheduleToDraft(createdSchedule));
      setScheduleDialogMode("edit");

      return;
    }

    if (!selectedSchedule) return;

    const updatedSchedule = await updateSchedule.mutateAsync(payload);

    if (updatedSchedule) {
      setSelectedSchedule(updatedSchedule);
      setScheduleDefaultValues(scheduleToDraft(updatedSchedule));
    }
  };

  const handleDeleteSchedule = async (schedule: Schedule) => {
    await deleteSchedule.mutateAsync(schedule.id);
    closeScheduleDialog();
  };

  const handleCalendarRangeSelect = (selection: DateSelectArg) => {
    openCreateScheduleDialog(selection.startStr, addDays(selection.endStr, -1));
  };

  const handleCalendarDateClick = (dateClick: DateClickArg) => {
    openCreateScheduleDialog(dateClick.dateStr, dateClick.dateStr);
  };

  const handleCalendarEventClick = (eventClick: EventClickArg) => {
    const scheduleId = Number(eventClick.event.extendedProps.scheduleId);

    const schedule = schedulesList.find((item) => item.id === scheduleId);

    if (!schedule) return;

    openEditScheduleDialog(schedule);
  };

  const openExceptionDialog = () => {
    setExceptionDraft({
      exceptionDate: getToday(),
      exceptionType: 1,
      note: "",
    });

    setExceptionDialogOpen(true);
  };

  const handleCreateException = async () => {
    if (!selectedScheduleId) return;

    if (!exceptionDraft.exceptionDate) {
      toast.error(t("validation.required"));
      return;
    }

    await createException.mutateAsync({
      exceptionDate: exceptionDraft.exceptionDate,
      exceptionType: exceptionDraft.exceptionType,
      note: exceptionDraft.note.trim() || undefined,
    });

    setExceptionDialogOpen(false);
    setExceptionDraft({
      exceptionDate: getToday(),
      exceptionType: 1,
      note: "",
    });
  };

  const handleDeleteException = async (exception: ScheduleException) => {
    await deleteException.mutateAsync(exception.id);
  };

  const backToSchedulesPath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/schedules`
    : "/admin/dashboard/schedules";

  if (!hasValidOrgId) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("schedules.noOrganizationTitle")}
        </Typography>

        <Typography color="text.secondary">
          {t("schedules.noOrganizationMessage")}
        </Typography>

        {isSuperAdmin && (
          <Button
            component={RouterLink}
            to="/admin/dashboard/organizations"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {t("organizations.title")}
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <>
      <ScheduleCalendarStyles />

      <Stack spacing={3}>
        <ScheduleCalendarHeader
          backToSchedulesPath={backToSchedulesPath}
          onAddSchedule={() => openCreateScheduleDialog()}
        />

        <ScheduleCalendarStats
          schedulesCount={schedulesCount}
          activeSchedulesCount={activeSchedulesCount}
          inactiveSchedulesCount={inactiveSchedulesCount}
        />

        <ScheduleFullCalendar
          events={calendarEvents}
          loading={schedules.isLoading}
          onRangeSelect={handleCalendarRangeSelect}
          onDateClick={handleCalendarDateClick}
          onEventClick={handleCalendarEventClick}
        />

        <ScheduleDialog
          open={scheduleDialogOpen}
          mode={scheduleDialogMode}
          schedule={selectedSchedule}
          defaultValues={scheduleDefaultValues}
          saving={createSchedule.isPending || updateSchedule.isPending}
          deleting={deleteSchedule.isPending}
          exceptions={exceptions.data ?? selectedSchedule?.exceptions}
          exceptionsLoading={exceptions.isLoading}
          exceptionsError={exceptions.isError}
          exceptionDeleting={deleteException.isPending}
          onClose={closeScheduleDialog}
          onSubmit={handleSaveSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onRetryExceptions={() => exceptions.refetch()}
          onOpenExceptionDialog={openExceptionDialog}
          onDeleteException={handleDeleteException}
        />

        <ScheduleExceptionDialog
          open={exceptionDialogOpen}
          draft={exceptionDraft}
          loading={createException.isPending}
          onChange={updateExceptionDraft}
          onClose={() => setExceptionDialogOpen(false)}
          onSubmit={handleCreateException}
        />
      </Stack>
    </>
  );
};

export default ScheduleCalendarPage;
