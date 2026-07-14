import { ACCESS_TOKEN_COOKIE } from "./auth-constants";

const MAX_AGE_SECONDS = 60 * 60 * 12;

export function getClientAccessToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCESS_TOKEN_COOKIE}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export function setClientAccessToken(token: string) {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

export function clearClientAccessToken() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
