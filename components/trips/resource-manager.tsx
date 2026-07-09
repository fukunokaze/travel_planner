"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createFlight,
  createLodging
} from "@/lib/api-client";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-utils";
import { TripDetail } from "@/lib/types";
import { DeleteEntityButton } from "./delete-entity-button";

interface ResourceManagerProps {
  trip: TripDetail;
}

export function ResourceManager({ trip }: ResourceManagerProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showLodgingForm, setShowLodgingForm] = useState(false);
  const [flightForm, setFlightForm] = useState({
    route: "",
    airline: "",
    flightNumber: "",
    departureDateTime: `${trip.startDate}T00:00`,
    arrivalDateTime: `${trip.startDate}T00:00`,
    seat: "",
    confirmationCode: ""
  });
  const [lodgingForm, setLodgingForm] = useState({
    name: "",
    address: "",
    startDate: trip.startDate,
    endDate: trip.endDate,
    nights: "1",
    confirmationCode: ""
  });

  const onCreateFlight = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await createFlight(trip.id, {
        ...flightForm
      });
      router.refresh();
      setShowFlightForm(false);
      setFlightForm({
        route: "",
        airline: "",
        flightNumber: "",
        departureDateTime: `${trip.startDate}T00:00`,
        arrivalDateTime: `${trip.startDate}T00:00`,
        seat: "",
        confirmationCode: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add flight.");
    } finally {
      setBusy(false);
    }
  };

  const onCreateLodging = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await createLodging(trip.id, {
        ...lodgingForm,
        nights: Number(lodgingForm.nights)
      });
      router.refresh();
      setShowLodgingForm(false);
      setLodgingForm({
        name: "",
        address: "",
        startDate: trip.startDate,
        endDate: trip.endDate,
        nights: "1",
        confirmationCode: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add lodging.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="jp-panel">
      {error ? <p className="jp-notice">{error}</p> : null}

      <section className="jp-side-section">
        <div className="jp-side-title">
          <h3>Flights</h3>
          <button
            className="btn btn-sm btn-outline-primary"
            type="button"
            onClick={() => setShowFlightForm((value) => !value)}
          >
            {showFlightForm ? "Close" : "Add Flight"}
          </button>
        </div>
        {showFlightForm ? (
          <form className="border rounded p-3 mb-3" onSubmit={onCreateFlight}>
            <div className="row g-2">
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Route (SFO -> NRT)"
                  value={flightForm.route}
                  onChange={(input) => setFlightForm({ ...flightForm, route: input.target.value })}
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  placeholder="Airline"
                  value={flightForm.airline}
                  onChange={(input) =>
                    setFlightForm({ ...flightForm, airline: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  placeholder="Flight #"
                  value={flightForm.flightNumber}
                  onChange={(input) =>
                    setFlightForm({ ...flightForm, flightNumber: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="flight-departure">
                  Departure date/time
                </label>
                <input
                  id="flight-departure"
                  className="form-control"
                  type="datetime-local"
                  value={flightForm.departureDateTime}
                  onChange={(input) =>
                    setFlightForm({ ...flightForm, departureDateTime: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="flight-arrival">
                  Arrival date/time
                </label>
                <input
                  id="flight-arrival"
                  className="form-control"
                  type="datetime-local"
                  value={flightForm.arrivalDateTime}
                  onChange={(input) =>
                    setFlightForm({ ...flightForm, arrivalDateTime: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  placeholder="Seat"
                  value={flightForm.seat}
                  onChange={(input) => setFlightForm({ ...flightForm, seat: input.target.value })}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Confirmation #"
                  value={flightForm.confirmationCode}
                  onChange={(input) =>
                    setFlightForm({ ...flightForm, confirmationCode: input.target.value })
                  }
                />
              </div>
            </div>
            <button className="btn btn-primary btn-sm mt-3" type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save Flight"}
            </button>
          </form>
        ) : null}

        <div className="row g-3">
          {trip.flights.map((flight) => (
            <div key={flight.id} className="col-12 col-md-6 col-xl-12">
              <article className="jp-mini-card">
                <h4>
                  {flight.airline} ({flight.route})
                </h4>
                <p>
                  airline: {flight.airline}
                  <br />
                  Flight #: {flight.flightNumber}
                  <br />
                  Departs: {formatDisplayDateTime(flight.departureDateTime)}
                  <br />
                  Arrives: {formatDisplayDateTime(flight.arrivalDateTime)}
                  <br />
                  Seat: {flight.seat || "TBD"}
                </p>
                <p className="jp-meta">Confirmation #: {flight.confirmationCode || "-"}</p>
                <div className="jp-action-inline">
                  <span className="jp-meta">Details</span>
                  <DeleteEntityButton
                    tripId={trip.id}
                    itemId={flight.id}
                    entity="flight"
                    label="Flight"
                  />
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="jp-side-section">
        <div className="jp-side-title">
          <h3>Lodging</h3>
          <button
            className="btn btn-sm btn-outline-primary"
            type="button"
            onClick={() => setShowLodgingForm((value) => !value)}
          >
            {showLodgingForm ? "Close" : "Add Lodging"}
          </button>
        </div>
        {showLodgingForm ? (
          <form className="border rounded p-3 mb-3" onSubmit={onCreateLodging}>
            <div className="row g-2">
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Lodging name"
                  value={lodgingForm.name}
                  onChange={(input) => setLodgingForm({ ...lodgingForm, name: input.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Address"
                  value={lodgingForm.address}
                  onChange={(input) =>
                    setLodgingForm({ ...lodgingForm, address: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  type="date"
                  value={lodgingForm.startDate}
                  onChange={(input) =>
                    setLodgingForm({ ...lodgingForm, startDate: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  type="date"
                  value={lodgingForm.endDate}
                  onChange={(input) =>
                    setLodgingForm({ ...lodgingForm, endDate: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  value={lodgingForm.nights}
                  onChange={(input) =>
                    setLodgingForm({ ...lodgingForm, nights: input.target.value })
                  }
                  required
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  placeholder="Confirmation #"
                  value={lodgingForm.confirmationCode}
                  onChange={(input) =>
                    setLodgingForm({ ...lodgingForm, confirmationCode: input.target.value })
                  }
                />
              </div>
            </div>
            <button className="btn btn-primary btn-sm mt-3" type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save Lodging"}
            </button>
          </form>
        ) : null}

        <div className="row g-3">
          {trip.lodgings.map((lodging) => (
            <div key={lodging.id} className="col-12 col-md-6 col-xl-12">
              <article className="jp-mini-card">
                <h4>{lodging.name}</h4>
                <p>
                  ({lodging.nights} nights)
                  <br />
                  address: {lodging.address}
                  <br />
                  Dates: {formatDisplayDate(lodging.startDate)} - {formatDisplayDate(lodging.endDate)}
                </p>
                <p className="jp-meta">Confirmation #: {lodging.confirmationCode || "-"}</p>
                <div className="jp-action-inline">
                  <span className="jp-meta">Details</span>
                  <DeleteEntityButton
                    tripId={trip.id}
                    itemId={lodging.id}
                    entity="lodging"
                    label="Lodging"
                  />
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="jp-side-section">
        <div className="jp-side-title">
          <h3>Activities</h3>
          <span className="jp-meta">Overview</span>
        </div>
        <p className="jp-meta mb-0">
          {trip.events.filter((event) => event.type === "activity").length} activity checkpoints in
          this itinerary.
        </p>
      </section>

      <section className="jp-side-section">
        <div className="jp-side-title">
          <h3>Documents</h3>
        </div>
        <div className="d-grid gap-2">
          {trip.documents.map((document) => (
            <article key={document.id} className="jp-doc-card">
              <i className={`bi ${document.icon} me-2`} />
              {document.title}
            </article>
          ))}
        </div>
      </section>

      <section className="jp-side-section">
        <div className="jp-side-title">
          <h3>Notes</h3>
        </div>
        <p className="jp-meta mb-0">{trip.notes || "No notes yet."}</p>
      </section>
    </section>
  );
}

