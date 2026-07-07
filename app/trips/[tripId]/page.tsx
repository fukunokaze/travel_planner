import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/trips/app-sidebar";
import { ResourceManager } from "@/components/trips/resource-manager";
import { Timeline } from "@/components/trips/timeline";
import { TripPageActions } from "@/components/trips/trip-page-actions";
import { getTrip, getTrips } from "@/lib/api-server";
import { formatTripRange } from "@/lib/date-utils";

interface TripPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const [trips, trip] = await Promise.all([getTrips(), getTrip(tripId)]);

  if (!trip) {
    notFound();
  }

  return (
    <div className="journey-shell">
      <AppSidebar trips={trips} activeTripId={trip.id} />
      <main className="jp-main">
        <section className="jp-header">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="jp-page-title">{trip.title}</h1>
              <p className="jp-subtitle">
                {formatTripRange(trip.startDate, trip.endDate)}
                {" \u00b7 "}
                <i className="bi bi-geo-alt me-1" />
                {trip.destination}
              </p>
            </div>
            <TripPageActions trip={trip} />
          </div>
        </section>
        <div className="row g-4">
          <div className="col-12 col-xxl-8">
            <Timeline trip={trip} />
          </div>
          <div className="col-12 col-xxl-4">
            <ResourceManager trip={trip} />
          </div>
        </div>
      </main>
    </div>
  );
}
