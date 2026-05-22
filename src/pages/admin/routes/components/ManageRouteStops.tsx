import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import LoadingDataError from "../../../../components/LoadingDataError";
import { useStops } from "../../../../hooks/locations/useStops";
import { useUpdateRouteStops } from "../../../../hooks/locations/useRoutes";
import type { Stop } from "../../../../types/stop.types";
import type { TransitRoute } from "../../../../types/route.types";

type ManageRouteStopsProps = {
  route: TransitRoute;
};

type SelectedRouteStop = {
  stopId: string;
  ordering: number;
};

const getInitialStops = (route: TransitRoute): SelectedRouteStop[] => {
  return [...(route.routeNodes ?? [])]
    .sort((a, b) => a.ordering - b.ordering)
    .map((routeNode) => ({
      stopId: routeNode.node.id,
      ordering: routeNode.ordering,
    }));
};

const getStopLabel = (stop: Stop) => {
  return stop.name || stop.id;
};

const ManageRouteStops = ({ route }: ManageRouteStopsProps) => {
  const { t } = useTranslation();

  const stops = useStops({
    limit: 100,
  });

  const updateRouteStops = useUpdateRouteStops(route.id);

  const initialStops = useMemo(() => getInitialStops(route), [route]);

  const [selectedStops, setSelectedStops] =
    useState<SelectedRouteStop[]>(initialStops);

  const [search, setSearch] = useState("");

  const stopsData = useMemo<Stop[]>(() => {
    return stops.data?.data ?? [];
  }, [stops.data?.data]);

  const filteredStops = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return stopsData;
    }

    return stopsData.filter((stop) => {
      const label = `${stop.name} ${stop.id}`.toLowerCase();

      return label.includes(searchValue);
    });
  }, [stopsData, search]);

  const selectedStopIds = useMemo(() => {
    return selectedStops.map((item) => item.stopId);
  }, [selectedStops]);

  const isSelected = (stopId: string) => selectedStopIds.includes(stopId);

  const getOrdering = (stopId: string) => {
    return selectedStops.find((item) => item.stopId === stopId)?.ordering ?? 1;
  };

  const toggleStop = (stopId: string) => {
    setSelectedStops((current) => {
      const exists = current.some((item) => item.stopId === stopId);

      if (exists) {
        return current.filter((item) => item.stopId !== stopId);
      }

      const maxOrdering = current.reduce(
        (max, item) => Math.max(max, item.ordering),
        0,
      );

      return [
        ...current,
        {
          stopId,
          ordering: maxOrdering + 1,
        },
      ];
    });
  };

  const updateOrdering = (stopId: string, ordering: number) => {
    setSelectedStops((current) =>
      current.map((item) =>
        item.stopId === stopId
          ? {
              ...item,
              ordering,
            }
          : item,
      ),
    );
  };

  const handleSave = async (handleClose: () => void) => {
    const payload = selectedStops
      .filter((item) => item.ordering > 0)
      .sort((a, b) => a.ordering - b.ordering)
      .map((item) => ({
        stopId: item.stopId,
        ordering: item.ordering,
      }));

    await updateRouteStops.mutateAsync({
      stops: payload,
    });

    handleClose();
  };

  const loading = stops.isLoading || updateRouteStops.isPending;

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("routes.stops.manage")}>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.currentTarget.blur();

              requestAnimationFrame(() => {
                setSelectedStops(initialStops);
                handleOpen();
              });
            }}
          >
            <AltRouteRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="md" fullWidth>
          <DialogTitle>{t("routes.stops.title")}</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontWeight: 900 }}>{route.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {t("routes.stops.description")}
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("table.search")}
              />

              {stops.isLoading ? (
                <Box
                  sx={{
                    minHeight: 180,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : stops.isError ? (
                <LoadingDataError
                  refetch={stops.refetch}
                  loading={stops.isRefetching}
                />
              ) : filteredStops.length > 0 ? (
                <Stack
                  spacing={1}
                  sx={{
                    maxHeight: 420,
                    overflow: "auto",
                    pr: 0.5,
                  }}
                >
                  {filteredStops.map((stop) => {
                    const checked = isSelected(stop.id);

                    return (
                      <Stack
                        key={stop.id}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{
                          alignItems: { xs: "stretch", sm: "center" },
                          justifyContent: "space-between",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          p: 1.25,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center", minWidth: 0 }}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleStop(stop.id)}
                          />

                          <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap sx={{ fontWeight: 800 }}>
                              {getStopLabel(stop)}
                            </Typography>

                            <Typography
                              noWrap
                              variant="caption"
                              color="text.secondary"
                            >
                              {stop.id}
                            </Typography>
                          </Box>
                        </Stack>

                        <TextField
                          type="number"
                          size="small"
                          label={t("routes.stops.ordering")}
                          value={checked ? getOrdering(stop.id) : ""}
                          onChange={(event) => {
                            updateOrdering(stop.id, Number(event.target.value));
                          }}
                          disabled={!checked}
                          slotProps={{
                            htmlInput: {
                              min: 1,
                              step: 1,
                            },
                          }}
                          sx={{
                            width: { xs: "100%", sm: 140 },
                          }}
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  {t("stops.empty")}
                </Typography>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="contained"
              onClick={() => handleSave(handleClose)}
              disabled={loading}
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    />
  );
};

export default ManageRouteStops;