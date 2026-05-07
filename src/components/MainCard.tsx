import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  type CardContentProps,
  type CardHeaderProps,
  type CardProps,
} from "@mui/material";

export interface MainCardProps extends Omit<CardProps, "title"> {
  border?: boolean;
  cardTitle?: ReactNode;
  darkTitle?: boolean;
  cardHeaderProps?: CardHeaderProps;

  cardContent?: boolean;
  contentProps?: CardContentProps;

  glow?: boolean;
  glass?: boolean;
  clickable?: boolean;

  children?: ReactNode;
}

export default function MainCard({
  border = true,
  cardTitle,
  darkTitle = false,
  cardHeaderProps,

  cardContent = true,
  contentProps,

  glow = false,
  glass = false,
  clickable = false,

  sx,
  children,
  ...rest
}: MainCardProps) {
  return (
    <Card
      elevation={0}
      {...rest}
      sx={[
        (theme) => ({
          overflow: "hidden",
          position: "relative",
          borderRadius: 3,

          border: border ? "1px solid" : "none",
          borderColor: glass
            ? theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.14)"
              : "rgba(255,255,255,0.65)"
            : theme.palette.custom.cardBorder,

          backgroundColor: glass
            ? theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.72)"
            : theme.palette.custom.surface,

          backgroundImage: "none",

          backdropFilter: glass ? "blur(18px)" : "none",
          WebkitBackdropFilter: glass ? "blur(18px)" : "none",

          boxShadow: glow
            ? theme.palette.mode === "dark"
              ? `0 0 0 1px ${theme.palette.custom.cardBorder}, 0 18px 45px rgba(0,0,0,0.38)`
              : `0 0 0 1px ${theme.palette.custom.cardBorder}, 0 16px 40px rgba(15,23,42,0.08)`
            : "none",

          cursor: clickable ? "pointer" : "default",
          transition:
            "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease",

          ...(clickable && {
            "&:hover": {
              transform: "translateY(-3px)",
              borderColor: theme.palette.primary.main,
              boxShadow:
                theme.palette.mode === "dark"
                  ? `0 0 0 1px ${theme.palette.primary.main}, 0 20px 50px rgba(0,0,0,0.45)`
                  : `0 0 0 1px ${theme.palette.primary.main}, 0 18px 45px rgba(15,23,42,0.12)`,
            },
          }),

          "& pre": {
            m: 0,
            p: 2,
            overflow: "auto",
            borderRadius: 2,
            fontFamily: "monospace",
            fontSize: "0.8125rem",
            backgroundColor: theme.palette.custom.surfaceAlt,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {cardTitle ? (
        <CardHeader
          title={
            typeof cardTitle === "string" ? (
              <Typography variant={darkTitle ? "h4" : "subtitle1"}>
                {cardTitle}
              </Typography>
            ) : (
              cardTitle
            )
          }
          sx={{
            px: 2.5,
            pt: 2.5,
            pb: cardContent ? 0 : 2.5,
          }}
          {...cardHeaderProps}
        />
      ) : null}

      {cardContent ? (
        <CardContent
          {...contentProps}
          sx={[
            {
              p: 2.5,
              "&:last-child": {
                pb: 2.5,
              },
            },
            ...(Array.isArray(contentProps?.sx)
              ? contentProps.sx
              : [contentProps?.sx]),
          ]}
        >
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
}