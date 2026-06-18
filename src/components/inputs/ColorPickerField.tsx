import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import { ChromePicker, type ColorResult, type RGBColor } from "react-color";

const DEFAULT_COLOR = "#3A7CDFFF";

type ColorPickerFieldProps = {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  name?: string;
};

const toHexPart = (value: number) => {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
};

const normalizeHexAlphaColor = (value?: string | null) => {
  if (!value) return DEFAULT_COLOR;

  const color = String(value).trim();

  if (/^#[0-9a-fA-F]{8}$/.test(color)) {
    return color.toUpperCase();
  }

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color.toUpperCase()}FF`;
  }

  return DEFAULT_COLOR;
};

const hexAlphaToRgb = (value?: string | null): RGBColor => {
  const color = normalizeHexAlphaColor(value);

  return {
    r: Number.parseInt(color.slice(1, 3), 16),
    g: Number.parseInt(color.slice(3, 5), 16),
    b: Number.parseInt(color.slice(5, 7), 16),
    a: Number((Number.parseInt(color.slice(7, 9), 16) / 255).toFixed(2)),
  };
};

const rgbToHexAlpha = (rgb: RGBColor) => {
  const alphaValue = typeof rgb.a === "number" ? rgb.a : 1;

  return `#${toHexPart(rgb.r)}${toHexPart(rgb.g)}${toHexPart(
    rgb.b,
  )}${toHexPart(alphaValue * 255)}`;
};

const getAlphaPercent = (value?: string | null) => {
  const color = normalizeHexAlphaColor(value);
  const alphaHex = color.slice(7, 9);
  const alphaValue = Number.parseInt(alphaHex, 16) / 255;

  return Math.round(alphaValue * 100);
};

const getBaseColor = (value?: string | null) => {
  return normalizeHexAlphaColor(value).slice(0, 7);
};

const ColorPickerField = ({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  required = false,
  name,
}: ColorPickerFieldProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [internalColor, setInternalColor] = useState(() => normalizeHexAlphaColor(value));

  const open = Boolean(anchorEl);

  useEffect(() => {
    setInternalColor(normalizeHexAlphaColor(value));
  }, [value]);

  const rgbColor = useMemo(() => hexAlphaToRgb(internalColor), [internalColor]);

  const baseColor = getBaseColor(internalColor);
  const alphaPercent = getAlphaPercent(internalColor);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onBlur?.();
  };

  const handleColorChange = (color: ColorResult) => {
    const nextColor = rgbToHexAlpha(color.rgb);

    setInternalColor(nextColor);
    onChange(nextColor);
  };

  return (
    <FormControl fullWidth error={error}>
      <TextField
        fullWidth
        name={name}
        label={label}
        value={`${internalColor} · Alpha ${alphaPercent}%`}
        required={required}
        error={error}
        helperText={helperText}
        onClick={handleOpen}
        onBlur={onBlur}
        slotProps={{
          htmlInput: {
            readOnly: true,
            style: {
              cursor: "pointer",
            },
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: internalColor,
                    border: "2px solid",
                    borderColor: "background.paper",
                    boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleOpen}
                >
                  <PaletteRoundedIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            cursor: "pointer",
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 330,
              maxWidth: "calc(100vw - 32px)",
              overflow: "hidden",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: 12,
            },
          },
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  bgcolor: internalColor,
                  border: "2px solid",
                  borderColor: "background.paper",
                  boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`,
                }}
              />

              <Box>
                <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>{label}</Typography>

                <Typography variant="caption" color="text.secondary">
                  {baseColor} · Alpha {alphaPercent}%
                </Typography>
              </Box>
            </Stack>

            <IconButton size="small" onClick={handleClose}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box
            sx={{
              borderRadius: 2.5,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",

              "& .chrome-picker": {
                width: "100% !important",
                boxShadow: "none !important",
                borderRadius: "0 !important",
                background: "transparent !important",
                fontFamily: "inherit !important",
              },

              "& .chrome-picker input": {
                color: "#111827 !important",
                background: "#FFFFFF !important",
                border: "1px solid #D1D5DB !important",
                boxShadow: "none !important",
                borderRadius: "8px !important",
                height: "30px !important",
                fontSize: "12px !important",
                fontWeight: "700 !important",
              },

              "& .chrome-picker label": {
                color: "#6B7280 !important",
                fontSize: "11px !important",
                fontWeight: "700 !important",
              },

              "& .chrome-picker svg": {
                fill: "#111827 !important",
              },
            }}
          >
            <ChromePicker
              color={rgbColor}
              onChange={handleColorChange}
              onChangeComplete={handleColorChange}
              disableAlpha={false}
            />
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  HEX + Alpha
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900, fontFamily: "monospace" }}
                >
                  {internalColor}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Base Color
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900, fontFamily: "monospace" }}
                >
                  {baseColor}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Opacity
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 900 }}>
                  {alphaPercent}%
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              color="inherit"
              variant="outlined"
              onClick={() => {
                setInternalColor(DEFAULT_COLOR);
                onChange(DEFAULT_COLOR);
              }}
              sx={{ borderRadius: 2 }}
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={handleClose}
              sx={{ borderRadius: 2 }}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </FormControl>
  );
};

ColorPickerField.displayName = "ColorPickerField";

export default ColorPickerField;
