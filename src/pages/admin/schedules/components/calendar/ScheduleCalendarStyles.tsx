import { GlobalStyles, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const ScheduleCalendarStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        ".schedule-calendar-shell .schedule-colored-event": {
          border: "0 !important",
        },
        ".schedule-calendar-shell .schedule-inactive-event": {
          backgroundColor: `${theme.palette.text.disabled} !important`,
          color: `${theme.palette.background.paper} !important`,
        },
        ".schedule-calendar-shell .schedule-exception-added": {
          backgroundColor: `${theme.palette.success.main} !important`,
          color: `${theme.palette.success.contrastText} !important`,
        },
        ".schedule-calendar-shell .schedule-exception-removed": {
          backgroundColor: `${theme.palette.error.main} !important`,
          color: `${theme.palette.error.contrastText} !important`,
        },
        ".schedule-calendar-shell .fc": {
          "--fc-border-color": theme.palette.divider,
          "--fc-page-bg-color": "transparent",
          "--fc-neutral-bg-color": theme.palette.action.hover,
          "--fc-today-bg-color": alpha(theme.palette.primary.main, 0.08),
          "--fc-small-font-size": "0.78rem",
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
        },
        ".schedule-calendar-shell .fc-theme-standard td, .schedule-calendar-shell .fc-theme-standard th":
          {
            borderColor: theme.palette.divider,
          },
        ".schedule-calendar-shell .fc-scrollgrid": {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 20,
          overflow: "hidden",
          background: theme.palette.background.paper,
        },
        ".schedule-calendar-shell .fc-toolbar": {
          gap: 12,
          marginBottom: "18px !important",
          flexWrap: "wrap",
        },
        ".schedule-calendar-shell .fc-toolbar-title": {
          fontWeight: 900,
          fontSize: "1.35rem",
          color: theme.palette.text.primary,
        },
        ".schedule-calendar-shell .fc-button": {
          border: "0 !important",
          margin: "2px !important",
          borderRadius: "12px !important",
          padding: "8px 14px !important",
          fontWeight: "800 !important",
          textTransform: "none !important",
          boxShadow: "none !important",
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.primary.contrastText} !important`,
        },
        ".schedule-calendar-shell .fc-button:hover": {
          backgroundColor: `${theme.palette.primary.dark} !important`,
        },
        ".schedule-calendar-shell .fc-button.fc-button-active": {
          backgroundColor: `${theme.palette.primary.dark} !important`,
        },
        ".schedule-calendar-shell .fc-col-header-cell": {
          background: theme.palette.action.hover,
          padding: "12px 0",
        },
        ".schedule-calendar-shell .fc-col-header-cell-cushion": {
          color: theme.palette.text.secondary,
          fontWeight: 900,
          textDecoration: "none",
        },
        ".schedule-calendar-shell .fc-daygrid-day": {
          background: theme.palette.background.paper,
          transition: "background-color 150ms ease",
        },
        ".schedule-calendar-shell .fc-daygrid-day:hover": {
          background: theme.palette.action.hover,
        },
        ".schedule-calendar-shell .fc-daygrid-day-number": {
          width: 30,
          height: 30,
          display: "inline-grid",
          placeItems: "center",
          margin: 6,
          borderRadius: 10,
          color: theme.palette.text.primary,
          fontWeight: 900,
          textDecoration: "none",
        },
        ".schedule-calendar-shell .fc-day-today .fc-daygrid-day-number": {
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        ".schedule-calendar-shell .fc-daygrid-day-frame": {
          minHeight: 120,
          padding: 4,
        },
        ".schedule-calendar-shell .fc-event": {
          border: "0 !important",
          borderRadius: "10px !important",
          padding: "3px 7px !important",
          fontWeight: "800 !important",
          fontSize: "0.76rem !important",
          boxShadow: "none !important",
          cursor: "pointer",
        },
        ".schedule-calendar-shell .fc-daygrid-event": {
          whiteSpace: "normal",
        },
        ".schedule-calendar-shell .schedule-operating-event": {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.primary.contrastText} !important`,
        },
        ".schedule-calendar-shell .fc-highlight": {
          backgroundColor: `${alpha(theme.palette.primary.main, 0.18)} !important`,
        },
        ".schedule-calendar-shell .fc-daygrid-more-link": {
          fontWeight: 800,
          color: theme.palette.primary.main,
        },
        [theme.breakpoints.down("sm")]: {
          ".schedule-calendar-shell .fc-toolbar": {
            display: "grid",
            gridTemplateColumns: "1fr",
          },
          ".schedule-calendar-shell .fc-toolbar-chunk": {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
          },
          ".schedule-calendar-shell .fc-toolbar-title": {
            fontSize: "1.05rem",
            textAlign: "center",
          },
          ".schedule-calendar-shell .fc-daygrid-day-frame": {
            minHeight: 92,
          },
          ".schedule-calendar-shell .fc-button": {
            padding: "7px 10px !important",
            fontSize: "0.78rem !important",
          },
        },
      }}
    />
  );
};

export default ScheduleCalendarStyles;