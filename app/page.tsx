import { AppSidebar } from "@/components/trips/app-sidebar";
import { TripDirectoryClient } from "@/components/trips/trip-directory-client";
import { GoogleCallbackHandler } from "@/components/auth/google-callback-handler";
import { getTrips } from "@/lib/api-server";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const state = typeof params.state === "string" ? params.state : undefined;

  if (code || error) {
    return <GoogleCallbackHandler code={code} error={error} state={state} />;
  }

  const trips = await getTrips();

  return (
    <div className="journey-shell">
      <AppSidebar trips={trips} activeNavHref="/" />
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

