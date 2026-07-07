"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTrip } from "@/lib/api-client";
import { TripDetail } from "@/lib/types";
import { EventFormModal } from "./event-form-modal";
import { TripFormModal } from "./trip-form-modal";

interface TripPageActionsProps {
  trip: TripDetail;
}

export function TripPageActions({ trip }: TripPageActionsProps) {
  const router = useRouter();
  const [showTripModal, setShowTripModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const okay = window.confirm("Delete this trip?");

    if (!okay) {
      return;
    }

    try {
      setDeleting(true);
      await deleteTrip(trip.id);
      router.push("/");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="d-flex jp-toolbar gap-2 flex-wrap">
        <button className="btn btn-outline-secondary" type="button" onClick={() => setShowTripModal(true)}>
          <i className="bi bi-pencil me-2" />
          Edit Trip
        </button>
        <button className="btn btn-outline-secondary" type="button" disabled>
          <i className="bi bi-share me-2" />
          Share
        </button>
        <button className="btn btn-primary" type="button" onClick={() => setShowEventModal(true)}>
          <i className="bi bi-plus-lg me-2" />
          New Event
        </button>
        <button className="btn btn-outline-secondary" type="button" disabled>
          <i className="bi bi-people me-2" />
          Manage Travelers
        </button>
        <button className="btn btn-outline-danger" type="button" onClick={onDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Trip"}
        </button>
      </div>

      <TripFormModal
        mode="edit"
        trip={trip}
        show={showTripModal}
        onClose={() => setShowTripModal(false)}
        onSubmitted={() => {
          setShowTripModal(false);
          router.refresh();
        }}
      />

      <EventFormModal trip={trip} show={showEventModal} onClose={() => setShowEventModal(false)} />
    </>
  );
}

