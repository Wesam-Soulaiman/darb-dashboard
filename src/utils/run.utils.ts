import type { Run, RunStatus } from "../types/run.types";

const FINISHED_RUN_STATUSES = new Set<RunStatus>(["completed", "cancelled"]);

export const gtfsTimeToSeconds = (value: string): number => {
  const parts = value.split(":");

  if (parts.length !== 3) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hours, minutes, seconds] = parts.map(Number);

  const isValid =
    Number.isFinite(hours) &&
    Number.isFinite(minutes) &&
    Number.isFinite(seconds) &&
    hours >= 0 &&
    minutes >= 0 &&
    minutes < 60 &&
    seconds >= 0 &&
    seconds < 60;

  if (!isValid) {
    return Number.MAX_SAFE_INTEGER;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

export const compareRunsByOperatingTime = (first: Run, second: Run): number => {
  const timeDifference =
    gtfsTimeToSeconds(first.operatingTime) - gtfsTimeToSeconds(second.operatingTime);

  if (timeDifference !== 0) {
    return timeDifference;
  }

  return first.id - second.id;
};

export const sortRunsByOperatingTime = (runs: Run[]): Run[] => {
  return [...runs].sort(compareRunsByOperatingTime);
};

export const isFinishedRun = (run: Run): boolean => {
  return FINISHED_RUN_STATUSES.has(run.status);
};

export const filterRunsByFinishedStatus = (runs: Run[], showFinished: boolean): Run[] => {
  if (showFinished) {
    return runs;
  }

  return runs.filter((run) => !isFinishedRun(run));
};

export const groupRunsByRoute = (runs: Run[]): Map<string, Run[]> => {
  const groupedRuns = new Map<string, Run[]>();

  runs.forEach((run) => {
    const routeId = run.trip.routeId;

    const routeRuns = groupedRuns.get(routeId) ?? [];

    routeRuns.push(run);

    groupedRuns.set(routeId, routeRuns);
  });

  groupedRuns.forEach((routeRuns, routeId) => {
    groupedRuns.set(routeId, sortRunsByOperatingTime(routeRuns));
  });

  return groupedRuns;
};

export const runLocationToLeafletPosition = (
  coordinates: [number, number],
): [number, number] => {
  const [longitude, latitude] = coordinates;

  return [latitude, longitude];
};
