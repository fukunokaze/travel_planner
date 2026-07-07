"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTrip } from "@/lib/api-client";
import { formatTripRange } from "@/lib/date-utils";
import { TripSummary } from "@/lib/types";
import { TripFormModal } from "./trip-form-modal";

interface TripDirectoryClientProps {
  trips: TripSummary[];
}

export function TripDirectoryClient({ trips }: TripDirectoryClientProps) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripSummary | null>(null);
  const [busyTripId, setBusyTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDeleteTrip = async (tripId: string) => {
    const okay = window.confirm("Delete this trip and all itinerary data?");

    if (!okay) {
      return;
    }

    try {
      setBusyTripId(tripId);
      setError(null);
      await deleteTrip(tripId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete trip.");
    } finally {
      setBusyTripId(null);
    }
  };

  return (
    <section className="jp-panel">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="jp-panel-title mb-0">Trip Directory</h2>
        <button className="btn btn-primary" type="button" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-lg me-2" />
          New Trip
        </button>
      </div>

      {error ? <p className="jp-notice">{error}</p> : null}

      <div className="jp-trip-grid">
        {trips.map((trip) => (
          <article key={trip.id} className="jp-trip-card">
            <h3>
              {trip.emoji ?? "\ud83d\udccd"} {trip.title}
            </h3>
            <p className="text-muted mb-2">{formatTripRange(trip.startDate, trip.endDate)}</p>
            <p className="mb-3">{trip.description}</p>
            <p className="jp-meta">
              <i className="bi bi-geo-alt me-1" />
              {trip.destination}
            </p>
            <div className="d-flex gap-2 flex-wrap mt-3">
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                onClick={() => router.push(`/trips/${trip.id}`)}
              >
                Open
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => setEditingTrip(trip)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                type="button"
                onClick={() => onDeleteTrip(trip.id)}
                disabled={busyTripId === trip.id}
              >
                {busyTripId === trip.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <TripFormModal
        mode="create"
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmitted={(newTripId) => {
          setShowCreateModal(false);
          router.refresh();

          if (newTripId) {
            router.push(`/trips/${newTripId}`);
          }
        }}
      />

      <TripFormModal
        mode="edit"
        show={Boolean(editingTrip)}
        trip={editingTrip}
        onClose={() => setEditingTrip(null)}
        onSubmitted={(updatedTripId) => {
          setEditingTrip(null);
          router.refresh();

          if (updatedTripId) {
            router.push(`/trips/${updatedTripId}`);
          }
        }}
      />
    </section>
  );
}

