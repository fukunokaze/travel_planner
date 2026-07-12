export type TripEventType = "activity" | "flight" | "lodging";

export interface Traveler {
  id: string;
  name: string;
}

export interface TripSummary {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  emoji?: string;
}

export interface TripUpsertRequest {
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  emoji?: string;
}

export interface TripEvent {
  id: string;
  type: TripEventType;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  notes?: string;
  bookingCode?: string;
  imageUrl?: string;
  tags?: string[];
  travelerIds?: string[];
  relatedItemIds?: string[];
  cost?: number;
}

export interface TripEventUpsertRequest {
  type: TripEventType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
  bookingCode?: string;
  travelerIds?: string[];
  relatedItemIds?: string[];
  cost?: number;
}

export interface FlightItem {
  id: string;
  route: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  seat?: string;
  confirmationCode?: string;
  cost?: number;
}

export interface FlightUpsertRequest {
  route: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  seat?: string;
  confirmationCode?: string;
  cost?: number;
}

export interface LodgingItem {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  confirmationCode?: string;
  cost?: number;
}

export interface LodgingUpsertRequest {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  confirmationCode?: string;
  cost?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  icon: string;
}

export interface TripDetail extends TripSummary {
  travelers: Traveler[];
  events: TripEvent[];
  flights: FlightItem[];
  lodgings: LodgingItem[];
  documents: DocumentItem[];
  notes?: string;
}

