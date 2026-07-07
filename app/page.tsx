import { AppSidebar } from "@/components/trips/app-sidebar";
import { TripDirectoryClient } from "@/components/trips/trip-directory-client";
import { getTrips } from "@/lib/api-server";

export default async function HomePage() {
  const trips = await getTrips();

  return (
    <div className="journey-shell">
      <AppSidebar trips={trips} />
      <main className="jp-main">
        <section className="jp-header">
          <h1 className="jp-page-title">My Trips</h1>
          <p className="jp-subtitle">
            Plan faster with a timeline-driven itinerary and logistics side panel.
          </p>
        </section>
        <TripDirectoryClient trips={trips} />
      </main>
    </div>
  );
}

