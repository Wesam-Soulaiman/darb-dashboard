import { zodResolver } from "@hookform/resolvers/zod";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  resetPhoneSchema,
  type ResetPhoneFormValues,
} from "../../../../schemas/auth/resetPasswordSchemas";

type PhoneStepProps = {
  onSubmit: (phone: string) => Promise<void>;
};

export default function PhoneStep({ onSubmit }: PhoneStepProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPhoneFormValues>({
    resolver: zodResolver(resetPhoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  return (
    <Stack spacing={2.25}>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("auth.fields.phone")}
            placeholder="09XXXXXXXX"
            autoComplete="tel"
            error={Boolean(errors.phone)}
            helperText={
              errors.phone?.message
                ? t(errors.phone.message)
                : t("auth.reset.phoneHint")
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        onClick={handleSubmit((values) => onSubmit(values.phone))}
        sx={{
          py: 1.25,
          borderRadius: 3,
          fontWeight: 900,
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          t("auth.reset.sendOtp")
        )}
      </Button>
    </Stack>
  );
}