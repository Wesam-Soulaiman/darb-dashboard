import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import OtpInput from "../../components/OtpInput";
import {
  resetOtpSchema,
  type ResetOtpFormValues,
} from "../../../../schemas/auth/resetPasswordSchemas";
import { formatSyrianPhone } from "../../../../utils/syrianPhone";

type OtpStepProps = {
  phone: string;
  onBack: () => void;
  onResend: () => Promise<void>;
  onSubmit: (otp: string) => Promise<void>;
};

export default function OtpStep({
  phone,
  onBack,
  onResend,
  onSubmit,
}: OtpStepProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetOtpFormValues>({
    resolver: zodResolver(resetOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <Stack spacing={2.25}>
      <Alert severity="info">
        {t("auth.reset.otpSentTo")}{" "}
        <Typography component="span" sx={{ fontWeight: 900 }}>
          {formatSyrianPhone(phone)}
        </Typography>
      </Alert>

      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <Stack spacing={1}>
            <OtpInput
              value={field.value}
              disabled={isSubmitting}
              error={Boolean(errors.otp)}
              length={5}
              onChange={field.onChange}
              onComplete={(value) => {
                field.onChange(value);
              }}
            />

            <FormHelperText
              error={Boolean(errors.otp)}
              sx={{
                textAlign: "center",
                minHeight: 20,
              }}
            >
              {errors.otp?.message
                ? t(errors.otp.message)
                : t("auth.reset.otpHint")}
            </FormHelperText>
          </Stack>
        )}
      />

      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        onClick={handleSubmit((values) => onSubmit(values.otp))}
        sx={{
          py: 1.25,
          borderRadius: 3,
          fontWeight: 900,
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          t("auth.reset.verifyOtp")
        )}
      </Button>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Button type="button" variant="text" onClick={onBack}>
          {t("auth.reset.changePhone")}
        </Button>

        <Button type="button" variant="text" onClick={onResend}>
          {t("auth.reset.resendOtp")}
        </Button>
      </Stack>
    </Stack>
  );
}