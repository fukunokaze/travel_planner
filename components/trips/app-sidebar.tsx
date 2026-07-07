import Link from "next/link";
import { TripSummary } from "@/lib/types";

const navLinks = [
  { icon: "bi-grid", label: "Dashboard", href: "/" },
  { icon: "bi-signpost", label: "My Trips", href: "/" },
  { icon: "bi-calendar4-event", label: "Calendar", href: "/" },
  { icon: "bi-wallet2", label: "Budget", href: "/" },
  { icon: "bi-gear", label: "Settings", href: "/" }
];

interface AppSidebarProps {
  trips: TripSummary[];
  activeTripId?: string;
}

export function AppSidebar({ trips, activeTripId }: AppSidebarProps) {
  return (
    <aside className="jp-sidebar">
      <div className="jp-brand">
        <span className="jp-brand-badge">
          <i className="bi bi-airplane-engines" />
        </span>
        JourneyPlanner
      </div>

      <nav aria-label="Sidebar navigation">
        {navLinks.map((link) => (
          <Link key={link.label} className="jp-sidebar-link" href={link.href}>
            <i className={`bi ${link.icon}`} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="jp-sidebar-section">Trips</div>
      <div className="d-grid gap-1">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            className={`jp-sidebar-link ${trip.id === activeTripId ? "active" : ""}`}
            href={`/trips/${trip.id}`}
          >
            <span>{trip.emoji ?? "\ud83e\uddf3"}</span>
            {trip.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}

