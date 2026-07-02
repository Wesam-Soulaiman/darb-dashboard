import { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import LoadingDataError from "../../../../components/LoadingDataError";
import { useStops } from "../../../../hooks/locations/useStops";
import { useRoute, useUpdateRouteStops } from "../../../../hooks/locations/useRoutes";
import type { Stop } from "../../../../types/stop.types";
import type { TransitRoute } from "../../../../types/route.types";

type ManageRouteStopsProps = {
  route: TransitRoute;
};

type SelectedRouteStop = {
  stopId: string;
  ordering: string;
};

const getStopLabel = (stop: Stop) => {
  return stop.name || stop.id;
};

const getInitialStopsFromRoute = (routeDetails?: TransitRoute): SelectedRouteStop[] => {
  return [...(routeDetails?.routeNodes ?? [])]
    .sort((a, b) => a.ordering - b.ordering)
    .map((routeNode) => ({
      stopId: routeNode.node.id,
      ordering: String(routeNode.ordering),
    }));
};

const parseOrdering = (ordering: string) => {
  const normalizedOrdering = ordering.trim();

  if (!/^\d+$/.test(normalizedOrdering)) {
    return null;
  }

  const parsedOrdering = Number(normalizedOrdering);

  if (!Number.isInteger(parsedOrdering) || parsedOrdering <= 0) {
    return null;
  }

  return parsedOrdering;
};

const getOrderingError = (selectedStops: SelectedRouteStop[]) => {
  const orderings = selectedStops.map((item) => parseOrdering(item.ordering));

  if (orderings.some((ordering) => ordering === null)) {
    return "routes.stops.errors.invalidOrdering";
  }

  const uniqueOrderings = new Set(orderings);

  if (uniqueOrderings.size !== orderings.length) {
    return "routes.stops.errors.duplicateOrdering";
  }

  return null;
};

const ManageRouteStops = ({ route }: ManageRouteStopsProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedStops, setSelectedStops] = useState<SelectedRouteStop[]>([]);
  const [search, setSearch] = useState("");

  const stops = useStops({
    limit: 100,
  });

  const routeDetails = useRoute(open ? route.id : undefined);
  const updateRouteStops = useUpdateRouteStops(route.id);

  const stopsData = useMemo<Stop[]>(() => {
    return stops.data?.data ?? [];
  }, [stops.data?.data]);

  const initialStops = useMemo(() => {
    return getInitialStopsFromRoute(routeDetails.data);
  }, [routeDetails.data]);

  useEffect(() => {
    if (!open || routeDetails.isLoading || routeDetails.isError) {
      return;
    }

    setSelectedStops(initialStops);
  }, [open, routeDetails.isLoading, routeDetails.isError, initialStops]);

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
    return selectedStops.find((item) => item.stopId === stopId)?.ordering ?? "1";
  };

  const toggleStop = (stopId: string) => {
    setSelectedStops((current) => {
      const exists = current.some((item) => item.stopId === stopId);

      if (exists) {
        return current.filter((item) => item.stopId !== stopId);
      }

      const maxOrdering = current.reduce((max, item) => {
        const ordering = parseOrdering(item.ordering);

        return Math.max(max, ordering ?? 0);
      }, 0);

      return [
        ...current,
        {
          stopId,
          ordering: String(maxOrdering + 1),
        },
      ];
    });
  };

  const updateOrdering = (stopId: string, ordering: string) => {
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

  const handleOpen = () => {
    setSearch("");
    setSelectedStops([]);
    setOpen(true);
  };

  const handleClose = () => {
    if (updateRouteStops.isPending) {
      return;
    }

    setOpen(false);
  };

  const handleSave = async () => {
    if (orderingError) {
      return;
    }

    const payload = selectedStops
      .map((item) => ({
        stopId: item.stopId,
        ordering: Number(item.ordering),
      }))
      .sort((a, b) => a.ordering - b.ordering)
      .map((item) => ({
        stopId: item.stopId,
        ordering: item.ordering,
      }));

    await updateRouteStops.mutateAsync({
      stops: payload,
    });

    setOpen(false);
  };

  const loading = stops.isLoading || routeDetails.isLoading || updateRouteStops.isPending;

  const hasError = stops.isError || routeDetails.isError;

  const orderingError = useMemo(() => {
    return getOrderingError(selectedStops);
  }, [selectedStops]);

  return (
    <>
      <Tooltip title={t("routes.stops.manage")}>
        <IconButton
          color="primary"
          onClick={(event) => {
            event.currentTarget.blur();
            handleOpen();
          }}
        >
          <AltRouteRoundedIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
              disabled={loading}
            />

            {orderingError ? <Alert severity="error">{t(orderingError)}</Alert> : null}

            {loading ? (
              <Box
                sx={{
                  minHeight: 180,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : hasError ? (
              <LoadingDataError
                refetch={() => {
                  if (stops.isError) {
                    void stops.refetch();
                  }

                  if (routeDetails.isError) {
                    void routeDetails.refetch();
                  }
                }}
                loading={stops.isRefetching || routeDetails.isRefetching}
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
                        borderColor: checked ? "primary.main" : "divider",
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

                          <Typography noWrap variant="caption" color="text.secondary">
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
                          updateOrdering(stop.id, event.target.value);
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
              <Typography color="text.secondary">{t("stops.empty")}</Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClose}
            disabled={updateRouteStops.isPending}
          >
            {t("common.cancel")}
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || hasError || Boolean(orderingError)}
          >
            {updateRouteStops.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageRouteStops;
