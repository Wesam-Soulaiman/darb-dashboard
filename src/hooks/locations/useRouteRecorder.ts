import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createRecordedRoutePoint,
  getDistanceMeters,
  getRecordedRouteDistanceMeters,
  simplifyRecordedPoints,
  type RecordedRoutePoint,
  type RouteRecorderOptions,
  type RouteRecorderStatus,
} from "../../utils/routeRecorder.utils";

const DEFAULT_OPTIONS: RouteRecorderOptions = {
  accuracyThresholdMeters: 60,
  minDistanceMeters: 12,
  simplifyToleranceMeters: 10,
};

const GEOLOCATION_PERMISSION_DENIED = 1;
const GEOLOCATION_POSITION_UNAVAILABLE = 2;
const GEOLOCATION_TIMEOUT = 3;

const getGeolocationErrorTranslationKey = (code: number): string => {
  if (code === GEOLOCATION_PERMISSION_DENIED) {
    return "routes.recorder.errors.permissionDenied";
  }

  if (code === GEOLOCATION_POSITION_UNAVAILABLE) {
    return "routes.recorder.errors.positionUnavailable";
  }

  if (code === GEOLOCATION_TIMEOUT) {
    return "routes.recorder.errors.timeout";
  }

  return "routes.recorder.errors.unknown";
};

const getIsGeolocationSupported = (): boolean => {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
};

const getIsSecureGeolocationContext = (): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  return (
    window.isSecureContext ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

export const useRouteRecorder = (initialOptions?: Partial<RouteRecorderOptions>) => {
  const [status, setStatus] = useState<RouteRecorderStatus>("idle");
  const [points, setPoints] = useState<RecordedRoutePoint[]>([]);
  const [lastRejectedPoint, setLastRejectedPoint] = useState<RecordedRoutePoint | null>(
    null,
  );
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [options, setOptionsState] = useState<RouteRecorderOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });

  const watchIdRef = useRef<number | null>(null);
  const pointsRef = useRef<RecordedRoutePoint[]>([]);
  const optionsRef = useRef<RouteRecorderOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });

  const elapsedBeforeSegmentRef = useRef(0);
  const activeSegmentStartedAtRef = useRef<number | null>(null);

  const isSupported = getIsGeolocationSupported();
  const isSecureContext = getIsSecureGeolocationContext();

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const clearWatch = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== "undefined" &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const acceptPosition = useCallback((position: GeolocationPosition) => {
    const point = createRecordedRoutePoint(position);

    const currentOptions = optionsRef.current;

    if (
      point.accuracy !== null &&
      point.accuracy > currentOptions.accuracyThresholdMeters
    ) {
      setLastRejectedPoint(point);
      return;
    }

    const previousPoint = pointsRef.current.at(-1);

    if (
      previousPoint &&
      getDistanceMeters(previousPoint, point) < currentOptions.minDistanceMeters
    ) {
      setLastRejectedPoint(point);
      return;
    }

    setErrorKey(null);
    setLastRejectedPoint(null);

    setPoints((currentPoints) => {
      const nextPoints = [...currentPoints, point];
      pointsRef.current = nextPoints;

      return nextPoints;
    });
  }, []);

  const handlePositionError = useCallback(
    (error: GeolocationPositionError) => {
      setErrorKey(getGeolocationErrorTranslationKey(error.code));
      clearWatch();
      setStatus("error");
    },
    [clearWatch],
  );

  const startWatching = useCallback(() => {
    if (!getIsGeolocationSupported()) {
      setErrorKey("routes.recorder.geolocationUnsupported");
      return false;
    }

    if (!getIsSecureGeolocationContext()) {
      setErrorKey("routes.recorder.insecureContext");
      return false;
    }

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        acceptPosition,
        handlePositionError,
        {
          enableHighAccuracy: true,
          maximumAge: 1_000,
          timeout: 15_000,
        },
      );

      return true;
    } catch {
      setErrorKey("routes.recorder.errors.unknown");
      return false;
    }
  }, [acceptPosition, handlePositionError]);

  const start = useCallback(() => {
    clearWatch();

    setPoints([]);
    pointsRef.current = [];
    setLastRejectedPoint(null);
    setErrorKey(null);

    elapsedBeforeSegmentRef.current = 0;
    activeSegmentStartedAtRef.current = Date.now();
    setElapsedMs(0);

    const started = startWatching();

    setStatus(started ? "recording" : "error");
  }, [clearWatch, startWatching]);

  const pause = useCallback(() => {
    if (status !== "recording") {
      return;
    }

    clearWatch();

    if (activeSegmentStartedAtRef.current !== null) {
      elapsedBeforeSegmentRef.current += Date.now() - activeSegmentStartedAtRef.current;
    }

    activeSegmentStartedAtRef.current = null;
    setElapsedMs(elapsedBeforeSegmentRef.current);
    setStatus("paused");
  }, [clearWatch, status]);

  const resume = useCallback(() => {
    if (status !== "paused") {
      return;
    }

    const resumed = startWatching();

    if (!resumed) {
      setStatus("error");
      return;
    }

    activeSegmentStartedAtRef.current = Date.now();
    setStatus("recording");
  }, [startWatching, status]);

  const finish = useCallback(() => {
    if (status === "recording" && activeSegmentStartedAtRef.current !== null) {
      elapsedBeforeSegmentRef.current += Date.now() - activeSegmentStartedAtRef.current;
    }

    clearWatch();

    activeSegmentStartedAtRef.current = null;
    setElapsedMs(elapsedBeforeSegmentRef.current);
    setStatus("finished");
  }, [clearWatch, status]);

  const reset = useCallback(() => {
    clearWatch();

    setStatus("idle");
    setPoints([]);
    pointsRef.current = [];
    setLastRejectedPoint(null);
    setErrorKey(null);
    setElapsedMs(0);

    elapsedBeforeSegmentRef.current = 0;
    activeSegmentStartedAtRef.current = null;
  }, [clearWatch]);

  const removeLastPoint = useCallback(() => {
    setPoints((currentPoints) => {
      const nextPoints = currentPoints.slice(0, -1);
      pointsRef.current = nextPoints;

      return nextPoints;
    });
  }, []);

  const setOptions = useCallback((patch: Partial<RouteRecorderOptions>) => {
    setOptionsState((currentOptions) => ({
      ...currentOptions,
      ...patch,
    }));
  }, []);

  useEffect(() => {
    if (status !== "recording") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (activeSegmentStartedAtRef.current === null) {
        setElapsedMs(elapsedBeforeSegmentRef.current);
        return;
      }

      setElapsedMs(
        elapsedBeforeSegmentRef.current + Date.now() - activeSegmentStartedAtRef.current,
      );
    }, 1_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [status]);

  useEffect(() => {
    return () => {
      clearWatch();
    };
  }, [clearWatch]);

  const simplifiedPoints = useMemo(() => {
    return simplifyRecordedPoints(points, options.simplifyToleranceMeters);
  }, [options.simplifyToleranceMeters, points]);

  const distanceMeters = useMemo(() => {
    return getRecordedRouteDistanceMeters(points);
  }, [points]);

  const lastPoint = points.at(-1) ?? null;

  return {
    status,
    points,
    simplifiedPoints,
    lastPoint,
    lastRejectedPoint,
    errorKey,
    elapsedMs,
    distanceMeters,
    options,
    isSupported,
    isSecureContext,
    isRecording: status === "recording",
    isPaused: status === "paused",
    canSave: simplifiedPoints.length >= 2,
    start,
    pause,
    resume,
    finish,
    reset,
    removeLastPoint,
    setOptions,
  };
};
