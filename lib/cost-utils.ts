import { TripDetail } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function calculateTripCost(trip: TripDetail): number {
  const flightsCost = trip.flights.reduce((total, flight) => total + (flight.cost || 0), 0);
  const lodgingsCost = trip.lodgings.reduce((total, lodging) => total + (lodging.cost || 0), 0);
  const activitiesCost = trip.events
    .filter((event) => event.type === "activity")
    .reduce((total, event) => total + (event.cost || 0), 0);

  return flightsCost + lodgingsCost + activitiesCost;
}
