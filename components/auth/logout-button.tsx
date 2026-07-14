"use client";

import { useAuth } from "./auth-provider";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button type="button" className="jp-sidebar-link jp-logout-link" onClick={logout}>
      <i className="bi bi-box-arrow-right" />
      Logout
    </button>
  );
}
