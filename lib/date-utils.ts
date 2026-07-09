function parseDate(rawDate: string) {
  const safe = rawDate.includes("T") ? rawDate : `${rawDate}T00:00:00`;
  return new Date(safe);
}

export function formatDisplayDate(rawDate: string): string {
  const date = parseDate(rawDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatDisplayDateTime(rawDateTime: string): string {
  const date = new Date(rawDateTime);

  if (Number.isNaN(date.getTime())) {
    return rawDateTime;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatTripRange(startDate: string, endDate: string): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return `${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric"
  }).format(start)} - ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(end)}`;
}

export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function formatDisplayTime(rawTime?: string): string {
  if (!rawTime) {
    return "Anytime";
  }

  const [hours, minutes] = rawTime.split(":").map((value) => Number(value));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return rawTime;
  }

  const normalizedDate = new Date();
  normalizedDate.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(normalizedDate);
}

