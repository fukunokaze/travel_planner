import { getClientAccessToken } from "./auth-cookie";
import {
  AuthResponse,
  FlightItem,
  FlightUpsertRequest,
  GoogleAuthRequest,
  LodgingItem,
  LodgingUpsertRequest,
  TripDetail,
  TripEvent,
  TripEventUpsertRequest,
  TripSummary,
  TripUpsertRequest
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit, options?: { skipAuth?: boolean }): Promise<T> {
  const accessToken = options?.skipAuth ? null : getClientAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function loginWithGoogle(idToken: string) {
  return request<AuthResponse>(
    "/api/Auth/google",
    {
      method: "POST",
      body: JSON.stringify({ idToken } satisfies GoogleAuthRequest)
    },
    { skipAuth: true }
  );
}

export function createTrip(payload: TripUpsertRequest) {
  return request<TripSummary>("/api/trips", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTrip(tripId: string, payload: TripUpsertRequest) {
  return request<TripSummary>(`/api/trips/${tripId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteTrip(tripId: string) {
  return request<void>(`/api/trips/${tripId}`, {
    method: "DELETE"
  });
}

export function createTripEvent(tripId: string, payload: TripEventUpsertRequest) {
  return request<TripEvent>(`/api/trips/${tripId}/events`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteTripEvent(tripId: string, eventId: string) {
  return request<void>(`/api/trips/${tripId}/events/${eventId}`, {
    method: "DELETE"
  });
}

export function createFlight(tripId: string, payload: FlightUpsertRequest) {
  return request<FlightItem>(`/api/trips/${tripId}/flights`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteFlight(tripId: string, flightId: string) {
  return request<void>(`/api/trips/${tripId}/flights/${flightId}`, {
    method: "DELETE"
  });
}

export function createLodging(tripId: string, payload: LodgingUpsertRequest) {
  return request<LodgingItem>(`/api/trips/${tripId}/lodgings`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteLodging(tripId: string, lodgingId: string) {
  return request<void>(`/api/trips/${tripId}/lodgings/${lodgingId}`, {
    method: "DELETE"
  });
}

export function getTripClient(tripId: string) {
  return request<TripDetail>(`/api/trips/${tripId}`, {
    method: "GET"
  });
}

