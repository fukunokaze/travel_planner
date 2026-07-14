"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "./auth-provider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleLoginButton() {
  const { loginWithGoogleIdToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-danger small mb-0">
        Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment.
      </p>
    );
  }

  const onSuccess = async (credential: CredentialResponse) => {
    if (!credential.credential) {
      setError("Google did not return an ID token. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await loginWithGoogleIdToken(credential.credential);
      router.push(searchParams.get("redirect") || "/");
      router.refresh();
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="d-flex flex-column align-items-center gap-3">
        <GoogleLogin onSuccess={onSuccess} onError={() => setError("Google sign-in failed. Please try again.")} />
        {loading && <span className="text-muted small">Signing you in...</span>}
        {error && <span className="text-danger small">{error}</span>}
      </div>
    </GoogleOAuthProvider>
  );
}
