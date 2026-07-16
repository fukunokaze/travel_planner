import { AppSidebar } from "@/components/trips/app-sidebar";
import { CalendarView } from "@/components/calendar/calendar-view";
import { getTrips } from "@/lib/api-server";

export default async function CalendarPage() {
  const trips = await getTrips();

  return (
    <div className="journey-shell">
      <AppSidebar trips={trips} activeNavHref="/calendar" />
      <main className="jp-main">
        <section className="jp-header">
          <h1 className="jp-page-title">My Calendar</h1>
          <p className="jp-subtitle">
            Events from your Google Calendar alongside the days you have trips planned.
          </p>
        </section>
        <CalendarView />
      </main>
    </div>
  );
}
