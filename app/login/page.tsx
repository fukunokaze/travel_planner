import { Suspense } from "react";
import { GoogleLoginButton } from "@/components/auth/google-login-button";

export default function LoginPage() {
  return (
    <div className="jp-auth-shell">
      <div className="jp-auth-card">
        <span className="jp-brand-badge">
          <i className="bi bi-airplane-engines" />
        </span>
        <h1 className="jp-page-title">JourneyPlanner</h1>
        <p className="jp-subtitle">Sign in with Google to start planning your next trip.</p>
        <Suspense fallback={null}>
          <GoogleLoginButton />
        </Suspense>
      </div>
    </div>
  );
}
