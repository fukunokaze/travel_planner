import "server-only";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./auth-constants";
import { TripDetail, TripSummary } from "./types";

const API_BASE_URL =
  (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000")
    .replace(/\/$/, "");

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

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
    throw new ApiError(response.status, `API call failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getTrips(): Promise<TripSummary[]> {
  return request<TripSummary[]>("/api/trips");
}

export async function getTrip(tripId: string): Promise<TripDetail | null> {
  try {
    return await request<TripDetail>(`/api/trips/${tripId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

