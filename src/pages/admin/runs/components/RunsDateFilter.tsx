import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
} from "@mui/material";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import DatePickerInput from "../../../../components/inputs/DatePickerInput";

type RunsDateFilterProps = {
  value: Dayjs;
  showFinished: boolean;
  onDateChange: (value: Dayjs) => void;
  onShowFinishedChange: (value: boolean) => void;
};

const RunsDateFilter = ({
  value,
  showFinished,
  onDateChange,
  onShowFinishedChange,
}: RunsDateFilterProps) => {
  const { t } = useTranslation();

  const today = dayjs().startOf("day");

  const isToday = value.isSame(today, "day");

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          sx={{
            alignItems: {
              xs: "stretch",
              md: "center",
            },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                md: 280,
              },
            }}
          >
            <DatePickerInput
              name="runsDate"
              label={t("runs.filters.date")}
              value={value}
              onChange={(newValue) => {
                if (!newValue || !newValue.isValid()) {
                  return;
                }

                onDateChange(newValue.startOf("day"));
              }}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<TodayRoundedIcon />}
            disabled={isToday}
            onClick={() => onDateChange(today)}
            sx={{
              minHeight: 44,
              borderRadius: 2,
            }}
          >
            {t("runs.actions.today")}
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={showFinished}
                onChange={(event) => {
                  onShowFinishedChange(event.target.checked);
                }}
              />
            }
            label={t("runs.filters.showFinished")}
            sx={{
              marginInlineStart: {
                md: "auto",
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RunsDateFilter;
