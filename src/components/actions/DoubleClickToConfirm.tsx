import {
  Button,
  CircularProgress,
  Stack,
  styled,
  Typography,
  type ButtonProps,
  type TypographyProps,
} from "@mui/material";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

type MotionTypographyProps = TypographyProps & {
  open: boolean;
};

const MotionTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "open",
})<MotionTypographyProps>(({ theme, open }) => ({
  maxWidth: open ? 220 : 0,
  opacity: open ? 1 : 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  transition: theme.transitions.create(["opacity", "max-width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shortest,
  }),
}));

type DoubleClickToConfirmProps = Omit<ButtonProps, "onClick" | "loading"> & {
  children: ReactNode;
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  confirmText?: ReactNode;
  loadingText?: ReactNode;
  loading?: boolean;
  resetAfterMs?: number;
};

const DoubleClickToConfirm = ({
  children,
  onConfirm,
  confirmText,
  loadingText,
  loading = false,
  resetAfterMs = 4000,
  disabled = false,
  variant = "outlined",
  color = "error",
  ...buttonProps
}: DoubleClickToConfirmProps) => {
  const { t } = useTranslation();

  const [armed, setArmed] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = loading || internalLoading;
  const isDisabled = disabled || isLoading;

  useEffect(() => {
    if (!armed) return;

    const timeoutId = window.setTimeout(() => {
      setArmed(false);
    }, resetAfterMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [armed, resetAfterMs]);

  useEffect(() => {
    if (disabled) {
      setArmed(false);
    }
  }, [disabled]);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    if (!armed) {
      setArmed(true);
      return;
    }

    setInternalLoading(true);

    try {
      await onConfirm(event);
    } finally {
      setInternalLoading(false);
      setArmed(false);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        justifyContent: "flex-end",
        minWidth: 0,
      }}
    >
      <Button
        {...buttonProps}
        color={color}
        variant={armed ? "contained" : variant}
        disabled={isDisabled}
        onClick={handleClick}
        aria-pressed={armed}
        startIcon={
          isLoading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            buttonProps.startIcon
          )
        }
        sx={{
          minWidth: 40,
          transition:
            "background-color 160ms ease, color 160ms ease, border-color 160ms ease",
          ...buttonProps.sx,
        }}
      >
        {children}
      </Button>

      <MotionTypography
        open={armed && !isLoading}
        variant="caption"
        color="error.main"
        role="status"
        aria-live="polite"
        sx={{
          fontWeight: 800,
        }}
      >
        {confirmText ?? t("common.clickAgainToConfirm")}
      </MotionTypography>

      <MotionTypography
        open={isLoading}
        variant="caption"
        color="text.secondary"
        role="status"
        aria-live="polite"
        sx={{
          fontWeight: 700,
        }}
      >
        {loadingText ?? t("common.deleting")}
      </MotionTypography>
    </Stack>
  );
};

export default DoubleClickToConfirm;
