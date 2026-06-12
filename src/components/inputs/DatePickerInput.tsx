import type { ReactNode } from "react";
import { FormControl } from "@mui/material";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";

type DatePickerInputProps = Omit<
  DatePickerProps,
  "value" | "onChange" | "slotProps"
> & {
  name: string;
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  onBlur?: () => void;
};

const DatePickerInput = ({
  name,
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  onBlur,
  ...props
}: DatePickerInputProps) => {
  return (
    <FormControl fullWidth error={error}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          onChange(newValue as Dayjs | null);
        }}
        onClose={onBlur}
        slotProps={{
          textField: {
            fullWidth: true,
            name,
            error,
            helperText,
            required,
            onBlur,
          },
        }}
        {...props}
      />
    </FormControl>
  );
};

DatePickerInput.displayName = "DatePickerInput";

export default DatePickerInput;