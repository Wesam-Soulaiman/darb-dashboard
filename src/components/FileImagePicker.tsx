import { Box, styled, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { useTranslation } from "react-i18next";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type FileImagePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  title?: string;
  description?: string;
  renderContent?: () => ReactNode;
  onSelectImage?: (files: FileList | null) => void;
  containerProps?: BoxProps;
};

const FileImagePicker = ({
  title,
  description,
  renderContent,
  onSelectImage,
  containerProps,
  accept = "image/*",
  ...inputProps
}: FileImagePickerProps) => {
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectImage?.(event.target.files);
    event.target.value = "";
  };

  return (
    <Box {...containerProps}>
      <Box
        component="label"
        sx={{
          p: 2,
          borderRadius: 3,
          width: "100%",
          height: "100%",
          minHeight: 170,
          display: "flex",
          border: (theme) => `2px dashed ${theme.palette.divider}`,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          cursor: "pointer",
          transition: "0.2s ease",
          bgcolor: "background.default",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <VisuallyHiddenInput
          type="file"
          accept={accept}
          onChange={handleChange}
          {...inputProps}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            textAlign: "center",
            mb: 1,
          }}
        >
          {title || "File Upload"}
        </Typography>

        <Typography component="p" color="text.secondary" sx={{ textAlign: "center" }}>
          {description || t("imagePicker.pickFile")}
        </Typography>

        {renderContent?.()}
      </Box>
    </Box>
  );
};

export default FileImagePicker;
