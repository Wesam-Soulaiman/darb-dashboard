import { Paper, Stack, Typography } from "@mui/material";
import DepartureBoardRoundedIcon from "@mui/icons-material/DepartureBoardRounded";

type RunsEmptyStateProps = {
  title: string;
  description: string;
};

const RunsEmptyState = ({ title, description }: RunsEmptyStateProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Stack
        spacing={1.5}
        sx={{
          alignItems: "center",
        }}
      >
        <DepartureBoardRoundedIcon
          color="disabled"
          sx={{
            fontSize: 52,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            maxWidth: 560,
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default RunsEmptyState;
