import type { Components, Theme } from "@mui/material/styles";

export const overrideComponents: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      "*": {
        boxSizing: "border-box",
      },
      html: {
        width: "100%",
        minHeight: "100%",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      body: {
        width: "100%",
        minHeight: "100%",
        margin: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      "#root": {
        minHeight: "100vh",
      },
      a: {
        color: "inherit",
        textDecoration: "none",
      },
      "::-webkit-scrollbar": {
        width: 8,
        height: 8,
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: 999,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.18)"
            : "rgba(15,23,42,0.20)",
      },
      "::-webkit-scrollbar-thumb:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.28)"
            : "rgba(15,23,42,0.32)",
      },
    }),
  },

  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        position: "relative",
        borderRadius: 16,
        backgroundImage: "none",
        border: `1px solid ${theme.palette.custom.cardBorder}`,
        boxShadow: theme.palette.custom.shadow,
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 18,
        backgroundImage: "none",
        backgroundColor: theme.palette.custom.surface,
        border: `1px solid ${theme.palette.custom.cardBorder}`,
        boxShadow: theme.palette.custom.shadow,
      }),
    },
  },

  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: "20px 20px 8px",
      },
      title: {
        fontWeight: 700,
        fontSize: "1rem",
      },
      subheader: {
        marginTop: 4,
        fontSize: "0.8125rem",
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 20,
        "&:last-child": {
          paddingBottom: 20,
        },
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        paddingInline: 18,
        paddingBlock: 8,
        textTransform: "none",
        fontWeight: 700,
        transition:
          "background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      },
      contained: ({ theme }) => ({
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.30)"
            : "0 10px 24px rgba(15,23,42,0.12)",
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        "&:hover": {
          backgroundColor: theme.palette.custom.hover,
        },
      }),
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.9)",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
        },
      }),
      input: {
        paddingBlock: 12,
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      margin: "dense",
      size: "small",
    },
  },

  MuiFormControl: {
    defaultProps: {
      fullWidth: true,
      margin: "dense",
      size: "small",
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },

  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 16,
        border: `1px solid ${theme.palette.custom.cardBorder}`,
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surfaceAlt,
        "& .MuiTableCell-root": {
          fontWeight: 700,
          color: theme.palette.text.primary,
        },
      }),
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 700,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundImage: "none",
        backgroundColor: theme.palette.custom.sidebar,
        borderInlineEnd: `1px solid ${theme.palette.divider}`,
      }),
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        marginInline: 10,
        marginBlock: 3,
        color: theme.palette.text.secondary,
        "&:hover": {
          backgroundColor: theme.palette.custom.hover,
          color: theme.palette.text.primary,
        },
        "&.Mui-selected": {
          backgroundColor: theme.palette.custom.selected,
          color: theme.palette.primary.main,
          fontWeight: 700,
          "&:hover": {
            backgroundColor: theme.palette.custom.selected,
          },
        },
      }),
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(15,18,22,0.86)"
            : "rgba(255,255,255,0.86)",
        backdropFilter: "blur(14px)",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
      }),
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 8,
        fontWeight: 600,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
      },
    },
  },
};
