import type { PaletteOptions } from "@mui/material/styles";

export type PaletteKey = "energetic" | "electric" | "solar" | "classic";

type ColorScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type AppPaletteTokens = {
  grey: ColorScale;
  primaryScale: ColorScale;
  greenAccent: ColorScale;
  redAccent: ColorScale;
  blueAccent: ColorScale;
};

type AppPaletteOptions = PaletteOptions & {
  custom: {
    tokens?: AppPaletteTokens;
    sidebar: string;
    surface: string;
    surfaceAlt: string;
    cardBorder: string;
    hover: string;
    selected: string;
    shadow: string;
  };
};

type PaletteFactory = (isDark: boolean) => AppPaletteOptions;

export const classicTokens = (isDark: boolean): AppPaletteTokens =>
  isDark
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primaryScale: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1f2a40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primaryScale: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#1f2a40",
          500: "#334155",
          600: "#64748b",
          700: "#94a3b8",
          800: "#cbd5e1",
          900: "#f1f5f9",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#2fbf9b",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#4f46e5",
          600: "#6366f1",
          700: "#818cf8",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      };

export const palettes: Record<PaletteKey, PaletteFactory> = {
  energetic: (isDark) => ({
    primary: {
      main: "#4CAF7D",
      light: "#6EDC94",
      dark: "#2E7D57",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9D9D6E",
      light: "#c1c18b",
      dark: "#73734E",
      contrastText: "#111827",
    },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    success: { main: "#22C55E" },
    info: { main: "#3B82F6" },
    text: {
      primary: isDark ? "#F8FAFC" : "#0F172A",
      secondary: isDark ? "#CBD5E1" : "#475569",
      disabled: isDark ? "#64748B" : "#94A3B8",
    },
    background: {
      default: isDark ? "#0F1216" : "#F5F7FB",
      paper: isDark ? "#171B21" : "#FFFFFF",
    },
    divider: isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)",
    custom: {
      sidebar: isDark ? "#11151A" : "#FFFFFF",
      surface: isDark ? "#171B21" : "#FFFFFF",
      surfaceAlt: isDark ? "#1D232B" : "#F8FAFC",
      cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
      hover: isDark ? "rgba(110,220,148,0.10)" : "rgba(76,175,125,0.08)",
      selected: isDark ? "rgba(110,220,148,0.18)" : "rgba(76,175,125,0.12)",
      shadow: isDark
        ? "0 18px 45px rgba(0,0,0,0.35)"
        : "0 16px 40px rgba(15,23,42,0.08)",
    },
  }),

  electric: (isDark) => ({
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7C3AED",
      light: "#A78BFA",
      dark: "#5B21B6",
      contrastText: "#ffffff",
    },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    success: { main: "#10B981" },
    info: { main: "#06B6D4" },
    text: {
      primary: isDark ? "#EAF2FF" : "#0F172A",
      secondary: isDark ? "#9FB3D1" : "#475569",
      disabled: isDark ? "#64748B" : "#94A3B8",
    },
    background: {
      default: isDark ? "#080D17" : "#F4F7FF",
      paper: isDark ? "#101827" : "#FFFFFF",
    },
    divider: isDark ? "rgba(255,255,255,0.10)" : "rgba(37,99,235,0.10)",
    custom: {
      sidebar: isDark ? "#0B1220" : "#FFFFFF",
      surface: isDark ? "#101827" : "#FFFFFF",
      surfaceAlt: isDark ? "#162033" : "#EEF4FF",
      cardBorder: isDark ? "rgba(96,165,250,0.12)" : "rgba(37,99,235,0.10)",
      hover: isDark ? "rgba(74,169,255,0.10)" : "rgba(37,99,235,0.08)",
      selected: isDark ? "rgba(74,169,255,0.18)" : "rgba(37,99,235,0.12)",
      shadow: isDark
        ? "0 18px 45px rgba(0,0,0,0.40)"
        : "0 16px 40px rgba(37,99,235,0.10)",
    },
  }),

  solar: (isDark) => ({
    primary: {
      main: "#D97706",
      light: "#FBBF24",
      dark: "#92400E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EA580C",
      light: "#FB923C",
      dark: "#9A3412",
      contrastText: "#ffffff",
    },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    success: { main: "#16A34A" },
    info: { main: "#0284C7" },
    text: {
      primary: isDark ? "#FFF7ED" : "#111827",
      secondary: isDark ? "#FED7AA" : "#57534E",
      disabled: isDark ? "#A8A29E" : "#A8A29E",
    },
    background: {
      default: isDark ? "#171717" : "#FFFBEB",
      paper: isDark ? "#22201D" : "#FFFFFF",
    },
    divider: isDark ? "rgba(255,255,255,0.09)" : "rgba(120,53,15,0.10)",
    custom: {
      sidebar: isDark ? "#1C1917" : "#FFFFFF",
      surface: isDark ? "#22201D" : "#FFFFFF",
      surfaceAlt: isDark ? "#2C2823" : "#FFF7ED",
      cardBorder: isDark ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.12)",
      hover: isDark ? "rgba(251,191,36,0.10)" : "rgba(217,119,6,0.08)",
      selected: isDark ? "rgba(251,191,36,0.18)" : "rgba(217,119,6,0.12)",
      shadow: isDark
        ? "0 18px 45px rgba(0,0,0,0.38)"
        : "0 16px 40px rgba(120,53,15,0.10)",
    },
  }),

  classic: (isDark) => {
    const tokens = classicTokens(isDark);

    return {
      primary: {
        main: isDark ? tokens.primaryScale[500] : "#1F2A40",
        light: isDark ? tokens.primaryScale[400] : "#334155",
        dark: isDark ? tokens.primaryScale[700] : "#0F172A",
        contrastText: "#ffffff",
      },
      secondary: {
        main: tokens.greenAccent[500],
        light: tokens.greenAccent[400],
        dark: tokens.greenAccent[700],
        contrastText: isDark ? "#061A14" : "#ffffff",
      },
      error: { main: tokens.redAccent[500] },
      warning: { main: "#F59E0B" },
      success: { main: tokens.greenAccent[500] },
      info: { main: tokens.blueAccent[500] },
      text: {
        primary: isDark ? "#F8FAFC" : "#111827",
        secondary: isDark ? "#CBD5E1" : "#475569",
        disabled: isDark ? "#64748B" : "#94A3B8",
      },
      background: {
        default: isDark ? tokens.primaryScale[500] : "#F6F8FC",
        paper: isDark ? "#1F2A40" : "#FFFFFF",
      },
      divider: isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)",
      custom: {
        tokens,
        sidebar: isDark ? "#101624" : "#FFFFFF",
        surface: isDark ? "#1F2A40" : "#FFFFFF",
        surfaceAlt: isDark ? "#141B2D" : "#F1F5F9",
        cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
        hover: isDark ? "rgba(76,206,172,0.10)" : "rgba(76,206,172,0.12)",
        selected: isDark ? "rgba(76,206,172,0.18)" : "rgba(76,206,172,0.18)",
        shadow: isDark
          ? "0 18px 45px rgba(0,0,0,0.42)"
          : "0 16px 40px rgba(15,23,42,0.08)",
      },
    };
  },
};
