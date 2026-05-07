import { Box, TextField } from "@mui/material";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { useMemo, useRef } from "react";

type OtpInputProps = {
  value: string;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
};

export default function OtpInput({
  value,
  length = 5,
  disabled = false,
  error = false,
  onChange,
  onComplete,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    return Array.from({ length }, (_, index) => value[index] ?? "");
  }, [length, value]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    input?.focus();
    input?.select();
  };

  const updateValue = (nextDigits: string[]) => {
    const nextValue = nextDigits.join("").slice(0, length);
    onChange(nextValue);

    if (nextValue.length === length) {
      onComplete?.(nextValue);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const rawValue = event.target.value;
    const numericValue = rawValue.replace(/\D/g, "");

    if (!numericValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      updateValue(nextDigits);
      return;
    }

    const nextDigits = [...digits];

    for (let i = 0; i < numericValue.length; i += 1) {
      const targetIndex = index + i;
      if (targetIndex >= length) break;

      nextDigits[targetIndex] = numericValue[i];
    }

    updateValue(nextDigits);

    const nextIndex = Math.min(index + numericValue.length, length - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    const key = event.key;

    if (key === "Backspace") {
      event.preventDefault();

      const nextDigits = [...digits];

      if (nextDigits[index]) {
        nextDigits[index] = "";
        updateValue(nextDigits);
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = "";
        updateValue(nextDigits);
        focusInput(index - 1);
      }

      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedValue) return;

    const nextDigits = Array.from(
      { length },
      (_, index) => pastedValue[index] ?? "",
    );

    updateValue(nextDigits);

    const nextIndex = Math.min(pastedValue.length, length - 1);
    focusInput(nextIndex);
  };

  return (
    <Box
      dir="ltr"
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 1, sm: 1.25 },
      }}
      onPaste={handlePaste}
    >
      {digits.map((digit, index) => (
        <TextField
          key={index}
          value={digit}
          disabled={disabled}
          error={error}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          inputRef={(element) => {
            inputRefs.current[index] = element;
          }}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 1,
              "aria-label": `OTP digit ${index + 1}`,
            },
          }}
          sx={{
            width: { xs: 48, sm: 56 },
            "& .MuiInputBase-input": {
              height: { xs: 48, sm: 56 },
              p: 0,
              textAlign: "center",
              fontSize: "1.35rem",
              fontWeight: 900,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
        />
      ))}
    </Box>
  );
}