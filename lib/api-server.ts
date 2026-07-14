import "server-only";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./auth-constants";
import { mockTripDetails, mockTrips } from "./mock-data";
import { TripDetail, TripSummary } from "./types";

const API_BASE_URL =
  (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000")
    .replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`API call failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getTrips(): Promise<TripSummary[]> {
  try {
    return await request<TripSummary[]>("/api/trips");
  } catch {
    return mockTrips;
  }
}

export async function getTrip(tripId: string): Promise<TripDetail | null> {
  try {
    return await request<TripDetail>(`/api/trips/${tripId}`);
  } catch {
    return mockTripDetails[tripId] ?? null;
  }
}

