import Image from "next/image";
import { formatDisplayDate, formatDisplayTime } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/cost-utils";
import { TripDetail, TripEvent } from "@/lib/types";
import { DeleteEntityButton } from "./delete-entity-button";

interface TimelineProps {
  trip: TripDetail;
}

interface DayGroup {
  date: string;
  dayNumber: number;
  events: TripEvent[];
}

const iconByType: Record<TripEvent["type"], string> = {
  activity: "bi-signpost-2-fill",
  flight: "bi-airplane-fill",
  lodging: "bi-building"
};

function getDayGroups(trip: TripDetail): DayGroup[] {
  const sorted = [...trip.events].sort((left, right) => {
    const leftDate = `${left.date}T${left.startTime ?? "00:00"}`;
    const rightDate = `${right.date}T${right.startTime ?? "00:00"}`;
    return leftDate.localeCompare(rightDate);
  });

  const startDate = new Date(trip.startDate);
  const groups = new Map<string, DayGroup>();

  for (const event of sorted) {
    const dayDate = new Date(event.date);
    const dayNumber =
      Math.floor((dayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (!groups.has(event.date)) {
      groups.set(event.date, {
        date: event.date,
        dayNumber: Math.max(dayNumber, 1),
        events: []
      });
    }

    groups.get(event.date)?.events.push(event);
  }

  return [...groups.values()];
}

export function Timeline({ trip }: TimelineProps) {
  const dayGroups = getDayGroups(trip);

  return (
    <section className="jp-panel">
      <h2 className="jp-panel-title">Itinerary</h2>

      {dayGroups.map((group) => (
        <section className="jp-day-group" key={group.date}>
          <div className="jp-day-row">
            <div className="jp-day-label">
              <h3>Day {group.dayNumber}</h3>
              <p>{formatDisplayDate(group.date)}</p>
            </div>
            <div className="jp-event-stack">
              {group.events.map((event) => (
                <article key={event.id} className="jp-event-card">
                  <div className="jp-event-time">{formatDisplayTime(event.startTime)}</div>
                  <div className={`jp-event-icon ${event.type}`}>
                    <i className={`bi ${iconByType[event.type]}`} />
                  </div>
                  <div>
                    <h4 className="jp-event-title">{event.title}</h4>
                    {event.location ? (
                      <p className="jp-event-subline">
                        <i className="bi bi-geo-alt me-1 text-primary" />
                        {event.location}
                      </p>
                    ) : null}
                    {event.bookingCode ? (
                      <p className="jp-event-subline">Reservation: {event.bookingCode}</p>
                    ) : null}
                    {event.cost != null ? (
                      <p className="jp-event-subline">Cost: {formatCurrency(event.cost)}</p>
                    ) : null}
                    {event.tags?.length ? (
                      <div className="jp-tag-wrap">
                        {event.tags.map((tag) => (
                          <span key={tag} className="badge text-bg-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                    <div className="d-flex flex-column align-items-end gap-2">
                      {event.imageUrl ? (
                      <Image
                        className="jp-thumb"
                        src={event.imageUrl}
                        alt={event.title}
                        width={130}
                        height={76}
                      />
                      ) : null}
                    <DeleteEntityButton
                      tripId={trip.id}
                      itemId={event.id}
                      entity="event"
                      label="Event"
                      className="btn btn-sm btn-outline-danger"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}
