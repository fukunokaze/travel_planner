"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCalendarDay } from "@/lib/api-client";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-utils";
import { CalendarDayDetail } from "@/lib/types";

interface CalendarDayModalProps {
  date: string;
  timeZoneId: string;
  onClose: () => void;
}

function entryIcon(source: string) {
  return source === "GoogleEvent" ? "bi-google" : "bi-signpost";
}

function entryIconClass(source: string) {
  return source === "GoogleEvent" ? "google" : "trip";
}

export function CalendarDayModal({ date, timeZoneId, onClose }: CalendarDayModalProps) {
  const [detail, setDetail] = useState<CalendarDayDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCalendarDay(date, timeZoneId)
      .then((result) => {
        if (!cancelled) {
          setDetail(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load this day.");
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
  }, [date, timeZoneId]);

  return (
    <>
      <div className="modal fade show d-block jp-modal" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header jp-modal-header">
              <h2 className="modal-title h4 mb-0">{formatDisplayDate(date)}</h2>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              {loading ? <p className="jp-meta mb-0">Loading events...</p> : null}
              {error ? <p className="jp-notice">{error}</p> : null}
              {!loading && !error && detail?.entries.length === 0 ? (
                <p className="jp-meta mb-0">No events on this day.</p>
              ) : null}
              {!loading && !error && detail && detail.entries.length > 0 ? (
                <div className="d-grid gap-2">
                  {detail.entries.map((entry) => (
                    <div key={entry.id} className="jp-cal-entry">
                      <span className={`jp-cal-entry-icon ${entryIconClass(entry.source)}`}>
                        <i className={`bi ${entryIcon(entry.source)}`} />
                      </span>
                      <div>
                        <p className="jp-cal-entry-title mb-0">{entry.title}</p>
                        <p className="jp-cal-entry-time mb-0">
                          {entry.isAllDay ? "All day" : formatDisplayDateTime(entry.start)}
                          {!entry.isAllDay && entry.end ? ` – ${formatDisplayDateTime(entry.end)}` : ""}
                        </p>
                        {entry.location ? <p className="jp-cal-entry-meta mb-0">{entry.location}</p> : null}
                        {entry.tripId ? (
                          <Link className="jp-cal-entry-link" href={`/trips/${entry.tripId}`}>
                            View trip
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
