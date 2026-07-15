"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly"
].join(" ");

export function GoogleLoginButton() {
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  const error = searchParams.get("error");

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return (
      <p className="text-danger small mb-0">
        Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_REDIRECT_URI in
        your environment.
      </p>
    );
  }

  const handleSignIn = () => {
    setRedirecting(true);

    const authUrl = new URL(GOOGLE_AUTH_ENDPOINT);
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", GOOGLE_SCOPES);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", searchParams.get("redirect") || "/");

    window.location.href = authUrl.toString();
  };

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <button
        type="button"
        className="btn btn-outline-dark d-flex align-items-center gap-2"
        onClick={handleSignIn}
        disabled={redirecting}
      >
        <i className="bi bi-google" />
        {redirecting ? "Redirecting to Google..." : "Sign in with Google"}
      </button>
      {error && <span className="text-danger small">We couldn&apos;t sign you in. Please try again.</span>}
    </div>
  );
}
