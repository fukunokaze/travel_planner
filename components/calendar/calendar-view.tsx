"use client";

import { useEffect, useMemo, useState } from "react";
import { getCalendarMonth } from "@/lib/api-client";
import { formatIsoDate } from "@/lib/date-utils";
import { CalendarDayMarker } from "@/lib/types";
import { CalendarDayModal } from "./calendar-day-modal";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarCell {
  date: Date;
  isoDate: string;
  inCurrentMonth: boolean;
}

function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - leadingBlanks + 1;
    const date = new Date(year, month - 1, dayOffset);

    return {
      date,
      isoDate: formatIsoDate(date),
      inCurrentMonth: dayOffset >= 1 && dayOffset <= daysInMonth
    };
  });
}

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const timeZoneId = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [markers, setMarkers] = useState<Record<string, CalendarDayMarker>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCalendarMonth(year, month, timeZoneId)
      .then((result) => {
        if (cancelled) {
          return;
        }

        const byDate: Record<string, CalendarDayMarker> = {};
        for (const marker of result) {
          byDate[marker.date] = marker;
        }
        setMarkers(byDate);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load the calendar.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year, month, timeZoneId]);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(year, month - 1, 1)
      ),
    [year, month]
  );
  const todayIso = useMemo(() => formatIsoDate(today), [today]);

  const goToMonth = (delta: number) => {
    const zeroIndexed = month - 1 + delta;
    const nextYear = year + Math.floor(zeroIndexed / 12);
    const nextMonth = ((zeroIndexed % 12) + 12) % 12;
    setYear(nextYear);
    setMonth(nextMonth + 1);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  return (
    <section className="jp-panel">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="jp-panel-title mb-0">{monthLabel}</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" type="button" onClick={() => goToMonth(-1)}>
            <i className="bi bi-chevron-left" />
          </button>
          <button className="btn btn-outline-secondary" type="button" onClick={goToToday}>
            Today
          </button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => goToMonth(1)}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>

      {error ? <p className="jp-notice">{error}</p> : null}

      <div className="jp-cal-grid jp-cal-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="jp-cal-weekday">
            {label}
          </div>
        ))}
      </div>

      <div className={`jp-cal-grid ${loading ? "jp-cal-loading" : ""}`}>
        {cells.map((cell) => {
          const marker = markers[cell.isoDate];

          return (
            <button
              key={cell.isoDate}
              type="button"
              className={[
                "jp-cal-cell",
                cell.inCurrentMonth ? "" : "outside",
                cell.isoDate === todayIso ? "today" : "",
                marker?.isTripDay ? "trip-day" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedDate(cell.isoDate)}
            >
              <span className="jp-cal-daynum">{cell.date.getDate()}</span>
              <span className="jp-cal-markers">
                {marker?.isTripDay ? <span className="jp-cal-dot trip" title="Trip day" /> : null}
                {marker?.hasEvents ? <span className="jp-cal-dot event" title="Has events" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate ? (
        <CalendarDayModal
          date={selectedDate}
          timeZoneId={timeZoneId}
          onClose={() => setSelectedDate(null)}
        />
      ) : null}
    </section>
  );
}
