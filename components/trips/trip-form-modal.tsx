"use client";

import { FormEvent, useEffect, useState } from "react";
import { createTrip, updateTrip } from "@/lib/api-client";
import { TripSummary, TripUpsertRequest } from "@/lib/types";

interface TripFormModalProps {
  mode: "create" | "edit";
  show: boolean;
  trip?: TripSummary | null;
  onClose: () => void;
  onSubmitted: (tripId?: string) => void;
}

const initialState: TripUpsertRequest = {
  title: "",
  description: "",
  destination: "",
  startDate: "",
  endDate: "",
  emoji: ""
};

export function TripFormModal({
  mode,
  show,
  trip,
  onClose,
  onSubmitted
}: TripFormModalProps) {
  const [form, setForm] = useState<TripUpsertRequest>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) {
      return;
    }

    if (mode === "edit" && trip) {
      setForm({
        title: trip.title,
        description: trip.description,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        emoji: trip.emoji ?? ""
      });
      return;
    }

    setForm(initialState);
  }, [mode, show, trip]);

  if (!show) {
    return null;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (mode === "create") {
        const created = await createTrip(form);
        onSubmitted(created.id);
      } else if (trip) {
        const updated = await updateTrip(trip.id, form);
        onSubmitted(updated.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block jp-modal" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg">
          <form className="modal-content" onSubmit={onSubmit}>
            <div className="modal-header jp-modal-header">
              <h2 className="modal-title h3 mb-0">
                {mode === "create" ? "Create Trip" : `Edit Trip (${trip?.title})`}
              </h2>
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
                <label className="form-label" htmlFor="trip-title">
                  Title
                </label>
                <input
                  id="trip-title"
                  className="form-control"
                  value={form.title}
                  onChange={(input) => setForm({ ...form, title: input.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="trip-destination">
                  Destination
                </label>
                <input
                  id="trip-destination"
                  className="form-control"
                  value={form.destination}
                  onChange={(input) => setForm({ ...form, destination: input.target.value })}
                  required
                />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="trip-start">
                    Start Date
                  </label>
                  <input
                    id="trip-start"
                    type="date"
                    className="form-control"
                    value={form.startDate}
                    onChange={(input) => setForm({ ...form, startDate: input.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="trip-end">
                    End Date
                  </label>
                  <input
                    id="trip-end"
                    type="date"
                    className="form-control"
                    value={form.endDate}
                    onChange={(input) => setForm({ ...form, endDate: input.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="trip-description">
                  Description
                </label>
                <textarea
                  id="trip-description"
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(input) => setForm({ ...form, description: input.target.value })}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="trip-emoji">
                  Emoji Marker
                </label>
                <input
                  id="trip-emoji"
                  className="form-control"
                  placeholder="\ud83c\uddef\ud83c\uddf5"
                  value={form.emoji}
                  onChange={(input) => setForm({ ...form, emoji: input.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

