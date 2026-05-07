import type { ThemeOptions } from "@mui/material/styles";

export const typographyOverrides = {
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  h1: {
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.25,
  },
  h3: {
    fontWeight: 700,
    fontSize: "1.625rem",
    lineHeight: 1.3,
  },
  h4: {
    fontWeight: 700,
    fontSize: "1.375rem",
    lineHeight: 1.35,
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: 1.45,
  },
  h6: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.5,
  },

  subtitle1: {
    fontWeight: 600,
    fontSize: "0.9375rem",
    lineHeight: 1.55,
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: "0.8125rem",
    lineHeight: 1.6,
  },

  body1: {
    fontSize: "0.9375rem",
    lineHeight: 1.7,
  },
  body2: {
    fontSize: "0.8125rem",
    lineHeight: 1.7,
  },

  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.6,
  },
  overline: {
    fontSize: "0.75rem",
    lineHeight: 1.6,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    textTransform: "none",
  },
} satisfies NonNullable<ThemeOptions["typography"]>;
