"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteFlight, deleteLodging, deleteTripEvent } from "@/lib/api-client";

interface DeleteEntityButtonProps {
  tripId: string;
  itemId: string;
  entity: "event" | "flight" | "lodging";
  label: string;
  className?: string;
}

export function DeleteEntityButton({
  tripId,
  itemId,
  entity,
  label,
  className
}: DeleteEntityButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    const okay = window.confirm(`Remove this ${label.toLowerCase()}?`);

    if (!okay) {
      return;
    }

    try {
      setBusy(true);

      if (entity === "event") {
        await deleteTripEvent(tripId, itemId);
      } else if (entity === "flight") {
        await deleteFlight(tripId, itemId);
      } else {
        await deleteLodging(tripId, itemId);
      }

      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={className ?? "btn btn-sm btn-outline-danger"}
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete ${label}`}
    >
      <i className="bi bi-trash" />
    </button>
  );
}

