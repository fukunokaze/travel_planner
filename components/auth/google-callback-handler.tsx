"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

interface GoogleCallbackHandlerProps {
  code?: string;
  error?: string;
  state?: string;
}

export function GoogleCallbackHandler({ code, error, state }: GoogleCallbackHandlerProps) {
  const { loginWithGoogleCode } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in...");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) {
      return;
    }
    handled.current = true;

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      router.replace("/login");
      return;
    }

    loginWithGoogleCode(code)
      .then(() => {
        router.replace(state || "/");
        router.refresh();
      })
      .catch(() => {
        setMessage("We couldn't sign you in. Redirecting...");
        router.replace("/login?error=exchange_failed");
      });
  }, [code, error, state, loginWithGoogleCode, router]);

  return (
    <div className="jp-auth-shell">
      <div className="jp-auth-card">
        <p className="jp-subtitle">{message}</p>
      </div>
    </div>
  );
}
