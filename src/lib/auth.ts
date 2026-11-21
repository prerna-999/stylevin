"use client";

import { useEffect, useState } from "react";

export type AuthUser = { id: number; name: string; email: string; role: string };

const TOKEN_KEY = "stylevin_token";
const USER_KEY = "stylevin_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function notify() {
  window.dispatchEvent(new Event("auth-change")); // tells header/pages to refresh
}

export function saveSession(token: string, user: AuthUser, remember: boolean) {
  [localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY);
    s.removeItem(USER_KEY);
  });
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
  notify();
}

export function clearSession() {
  [localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY);
    s.removeItem(USER_KEY);
  });
  notify();
}

// React hook: use it in any component to know who is logged in
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setReady(true);
    };
    sync();
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, ready };
}