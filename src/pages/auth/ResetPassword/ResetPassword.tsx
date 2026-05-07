import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  Alert,
  Box,
  Link as MuiLink,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  alpha,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import { getApiStatusCode } from "../../../api/apiError";
import { useChangePassword } from "../../../hooks/auth/useChangePassword";
import { useForgotPassword } from "../../../hooks/auth/useForgotPassword";
import { useSendOtp } from "../../../hooks/auth/useSendOtp";
import { normalizeSyrianPhone } from "../../../utils/syrianPhone";
import NewPasswordStep from "./steps/NewPasswordStep";
import OtpStep from "./steps/OtpStep";
import PhoneStep from "./steps/PhoneStep";

type ResetStep = "phone" | "otp" | "password" | "success";

const stepOrder: ResetStep[] = ["phone", "otp", "password"];

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();
  const sendOtpMutation = useSendOtp();
  const changePasswordMutation = useChangePassword();

  const [step, setStep] = useState<ResetStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const activeStep = useMemo(() => {
    if (step === "success") return 3;

    return stepOrder.indexOf(step);
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === "phone") return t("auth.reset.phoneSubtitle");
    if (step === "otp") return t("auth.reset.otpSubtitle");
    if (step === "password") return t("auth.reset.passwordSubtitle");

    return t("auth.reset.successSubtitle");
  }, [step, t]);

  const handleSendOtp = async (value: string) => {
    setServerError(null);

    const normalizedPhone = normalizeSyrianPhone(value);

    try {
      await forgotPasswordMutation.mutateAsync({
        phone: normalizedPhone,
      });

      setPhone(normalizedPhone);
      setStep("otp");
    } catch (error) {
      const status = getApiStatusCode(error);

      if (status === 400) {
        setServerError(t("auth.reset.errors.invalidPhone"));
        return;
      }

      setServerError(t("auth.reset.errors.sendOtpFailed"));
    }
  };

  const handleResendOtp = async () => {
    setServerError(null);

    try {
      await sendOtpMutation.mutateAsync({
        phone,
      });
    } catch (error) {
      const status = getApiStatusCode(error);

      if (status === 400) {
        setServerError(t("auth.reset.errors.invalidPhone"));
        return;
      }

      if (status === 404) {
        setServerError(t("auth.reset.errors.phoneNotRegistered"));
        return;
      }

      setServerError(t("auth.reset.errors.sendOtpFailed"));
    }
  };

  const handleVerifyOtp = async (value: string) => {
    setServerError(null);

    setOtp(value);
    setStep("password");
  };

  const handleSaveNewPassword = async (newPassword: string) => {
    setServerError(null);

    try {
      await changePasswordMutation.mutateAsync({
        phone,
        otp,
        newPassword,
      });

      setStep("success");

      window.setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1600);
    } catch (error) {
      const status = getApiStatusCode(error);

      if (status === 400) {
        setServerError(t("auth.reset.errors.invalidOtpOrPassword"));
        return;
      }

      if (status === 403) {
        setServerError(t("auth.reset.errors.tooManyAttempts"));
        return;
      }

      setServerError(t("auth.reset.errors.resetFailed"));
    }
  };

  return (
    <AuthCard
      title={t("auth.reset.title")}
      subtitle={subtitle}
      footer={
        <MuiLink
          component={Link}
          to="/auth/login"
          underline="hover"
          variant="body2"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontWeight: 800,
          }}
        >
          <ArrowBackRoundedIcon fontSize="small" />
          {t("auth.reset.backToLogin")}
        </MuiLink>
      }
    >
      {step !== "success" ? (
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>{t("auth.reset.steps.phone")}</StepLabel>
          </Step>

          <Step>
            <StepLabel>{t("auth.reset.steps.otp")}</StepLabel>
          </Step>

          <Step>
            <StepLabel>{t("auth.reset.steps.password")}</StepLabel>
          </Step>
        </Stepper>
      ) : null}

      {serverError ? <Alert severity="error">{serverError}</Alert> : null}

      {step === "phone" ? <PhoneStep onSubmit={handleSendOtp} /> : null}

      {step === "otp" ? (
        <OtpStep
          phone={phone}
          onBack={() => setStep("phone")}
          onResend={handleResendOtp}
          onSubmit={handleVerifyOtp}
        />
      ) : null}

      {step === "password" ? (
        <NewPasswordStep
          onBack={() => setStep("otp")}
          onSubmit={handleSaveNewPassword}
        />
      ) : null}

      {step === "success" ? (
        <Stack
          spacing={2.25}
          sx={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={(theme) => ({
              width: 74,
              height: 74,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: theme.palette.success.contrastText,
              backgroundColor: theme.palette.success.main,
              boxShadow: `0 20px 45px ${alpha(
                theme.palette.success.main,
                0.25,
              )}`,
            })}
          >
            <CheckCircleRoundedIcon fontSize="large" />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("auth.reset.successTitle")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("auth.reset.redirecting")}
          </Typography>
        </Stack>
      ) : null}
    </AuthCard>
  );
}