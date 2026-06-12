import { useEffect, type RefObject } from "react";
import FullCalendar from "@fullcalendar/react";

export const useFullCalendarResize = (
  calendarRef: RefObject<FullCalendar | null>,
  calendarWrapperRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    let frameId: number | null = null;
    const timeouts: number[] = [];

    const updateCalendarSize = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        calendarRef.current?.getApi().updateSize();
      });
    };

    const updateCalendarSizeAfterLayoutChange = () => {
      updateCalendarSize();

      timeouts.push(window.setTimeout(updateCalendarSize, 80));
      timeouts.push(window.setTimeout(updateCalendarSize, 180));
      timeouts.push(window.setTimeout(updateCalendarSize, 320));
    };

    updateCalendarSizeAfterLayoutChange();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateCalendarSizeAfterLayoutChange)
        : null;

    const wrapper = calendarWrapperRef.current;

    if (wrapper) {
      resizeObserver?.observe(wrapper);

      if (wrapper.parentElement) {
        resizeObserver?.observe(wrapper.parentElement);
      }
    }

    const mainElement = document.querySelector("main");

    if (mainElement instanceof HTMLElement) {
      resizeObserver?.observe(mainElement);
    }

    window.addEventListener("resize", updateCalendarSizeAfterLayoutChange);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCalendarSizeAfterLayoutChange);
    };
  }, [calendarRef, calendarWrapperRef]);
};
