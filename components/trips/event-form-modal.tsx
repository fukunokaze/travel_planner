"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createTripEvent } from "@/lib/api-client";
import { TripDetail, TripEventType } from "@/lib/types";

interface EventFormModalProps {
  trip: TripDetail;
  show: boolean;
  onClose: () => void;
}

const eventTypeOptions: Array<{ value: TripEventType; label: string }> = [
  { value: "activity", label: "Activity" },
  { value: "flight", label: "Flight checkpoint" },
  { value: "lodging", label: "Lodging checkpoint" }
];

export function EventFormModal({ trip, show, onClose }: EventFormModalProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "activity" as TripEventType,
    title: "",
    date: trip.startDate,
    startTime: "10:00",
    endTime: "12:00",
    location: "",
    notes: "",
    bookingCode: ""
  });
  const [travelerIds, setTravelerIds] = useState<string[]>([]);
  const [relatedItemIds, setRelatedItemIds] = useState<string[]>([]);

  const logisticalItems = useMemo(
    () => [
      ...trip.flights.map((flight) => ({
        id: flight.id,
        label: `${flight.airline} ${flight.route}`
      })),
      ...trip.lodgings.map((lodging) => ({
        id: lodging.id,
        label: `${lodging.name} (${lodging.nights} nights)`
      }))
    ],
    [trip.flights, trip.lodgings]
  );

  if (!show) {
    return null;
  }

  const toggleListValue = (
    currentValues: string[],
    nextValue: string,
    setter: (value: string[]) => void
  ) => {
    if (currentValues.includes(nextValue)) {
      setter(currentValues.filter((id) => id !== nextValue));
      return;
    }

    setter([...currentValues, nextValue]);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await createTripEvent(trip.id, {
        ...form,
        travelerIds,
        relatedItemIds
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block jp-modal" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <form className="modal-content" onSubmit={onSubmit}>
            <div className="modal-header jp-modal-header">
              <h2 className="modal-title h3 mb-0">Add New Event ({trip.title})</h2>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              {error ? <p className="jp-notice">{error}</p> : null}
              <div className="mb-3">
                <label className="form-label" htmlFor="event-title">
                  Event Title
                </label>
                <input
                  id="event-title"
                  className="form-control form-control-lg"
                  value={form.title}
                  placeholder="e.g., Senso-ji Temple Visit"
                  onChange={(input) => setForm({ ...form, title: input.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="event-type">
                    Type
                  </label>
                  <select
                    id="event-type"
                    className="form-select"
                    value={form.type}
                    onChange={(input) =>
                      setForm({ ...form, type: input.target.value as TripEventType })
                    }
                  >
                    {eventTypeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="event-date">
                    Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(input) => setForm({ ...form, date: input.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label" htmlFor="event-start">
                    Start
                  </label>
                  <input
                    id="event-start"
                    type="time"
                    className="form-control"
                    value={form.startTime}
                    onChange={(input) => setForm({ ...form, startTime: input.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label" htmlFor="event-end">
                    End
                  </label>
                  <input
                    id="event-end"
                    type="time"
                    className="form-control"
                    value={form.endTime}
                    onChange={(input) => setForm({ ...form, endTime: input.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="event-location">
                  Location
                </label>
                <input
                  id="event-location"
                  className="form-control"
                  value={form.location}
                  placeholder="Asakusa, Tokyo"
                  onChange={(input) => setForm({ ...form, location: input.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="event-notes">
                  Notes
                </label>
                <textarea
                  id="event-notes"
                  className="form-control"
                  rows={3}
                  value={form.notes}
                  onChange={(input) => setForm({ ...form, notes: input.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="event-booking-code">
                  Confirmation/Booking #
                </label>
                <input
                  id="event-booking-code"
                  className="form-control"
                  value={form.bookingCode}
                  onChange={(input) => setForm({ ...form, bookingCode: input.target.value })}
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Assigned Travelers</label>
                  <div className="d-grid gap-2">
                    {trip.travelers.map((traveler) => (
                      <label
                        key={traveler.id}
                        className="d-flex align-items-center gap-2 border rounded p-2"
                      >
                        <input
                          type="checkbox"
                          checked={travelerIds.includes(traveler.id)}
                          onChange={() =>
                            toggleListValue(travelerIds, traveler.id, setTravelerIds)
                          }
                        />
                        {traveler.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Related Logistical Items</label>
                  <div className="d-grid gap-2">
                    {logisticalItems.map((item) => (
                      <label key={item.id} className="d-flex align-items-center gap-2 border rounded p-2">
                        <input
                          type="checkbox"
                          checked={relatedItemIds.includes(item.id)}
                          onChange={() =>
                            toggleListValue(relatedItemIds, item.id, setRelatedItemIds)
                          }
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Adding..." : "Add Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

