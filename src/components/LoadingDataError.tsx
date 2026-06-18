import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type LoadingDataErrorProps = {
  refetch: () => void;
  loading?: boolean;
};

const LoadingDataError = ({ refetch, loading = false }: LoadingDataErrorProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Typography>{t("loadingError.title")}</Typography>

      <Button size="small" variant="outlined" onClick={refetch} disabled={loading}>
        {loading ? t("common.loading") : t("loadingError.refetch")}
      </Button>
    </Stack>
  );
};

export default LoadingDataError;
