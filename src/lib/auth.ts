// "use client";

// import { useEffect, useState } from "react";

// export type AuthUser = { id: number; name: string; email: string; role: string };

// const TOKEN_KEY = "stylevin_token";
// const USER_KEY = "stylevin_user";

// export function getToken() {
//   return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
// }

// export function getUser(): AuthUser | null {
//   const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
//   if (!raw) return null;
//   try { return JSON.parse(raw); } catch { return null; }
// }

// function notify() {
//   window.dispatchEvent(new Event("auth-change")); // tells header/pages to refresh
// }

// export function saveSession(token: string, user: AuthUser, remember: boolean) {
//   [localStorage, sessionStorage].forEach((s) => {
//     s.removeItem(TOKEN_KEY);
//     s.removeItem(USER_KEY);
//   });
//   const store = remember ? localStorage : sessionStorage;
//   store.setItem(TOKEN_KEY, token);
//   store.setItem(USER_KEY, JSON.stringify(user));
//   notify();
// }

// export function clearSession() {
//   [localStorage, sessionStorage].forEach((s) => {
//     s.removeItem(TOKEN_KEY);
//     s.removeItem(USER_KEY);
//   });
//   notify();
// }

// // React hook: use it in any component to know who is logged in
// export function useAuth() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const sync = () => {
//       setUser(getUser());
//       setReady(true);
//     };
//     sync();
//     window.addEventListener("auth-change", sync);
//     window.addEventListener("storage", sync);
//     return () => {
//       window.removeEventListener("auth-change", sync);
//       window.removeEventListener("storage", sync);
//     };
//   }, []);

//   return { user, ready };
// }

// /** Authorization header for calls to the backend API */
// export function authHeaders(): Record<string, string> {
//   const token = getToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// /**
//  * Reads ?redirect=/some/path from the current URL.
//  * Only same-site paths are accepted (blocks open redirects like //evil.com).
//  */
// export function getRedirectTarget(fallback: string | null = null): string | null {
//   if (typeof window === "undefined") return fallback;
//   const target = new URLSearchParams(window.location.search).get("redirect");
//   if (target && target.startsWith("/") && !target.startsWith("//") && !target.includes("\\")) {
//     return target;
//   }
//   return fallback;
// }

import { RecaptchaVerifier, signInWithPhoneNumber, signOut, ConfirmationResult } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

let verifier: RecaptchaVerifier | null = null;

/** Ask Firebase to SMS an OTP to a 10-digit Indian number. */
export async function sendFirebaseOtp(phone10: string, containerId = "recaptcha-container"): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  if (verifier) {
    verifier.clear();
    verifier = null;
  }
  verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  try {
    return await signInWithPhoneNumber(auth, `+91${phone10}`, verifier);
  } catch (e) {
    verifier?.clear();
    verifier = null;
    throw e;
  }
}

/** Check the OTP and return a Firebase ID token for our backend. */
export async function confirmFirebaseOtp(confirmation: ConfirmationResult, otp: string): Promise<string> {
  const cred = await confirmation.confirm(otp);
  const idToken = await cred.user.getIdToken();
  await signOut(getFirebaseAuth()); // we use our own JWT session, so Firebase session isn't needed
  return idToken;
}

export function firebaseErrorMessage(err: any): string {
  switch (err?.code) {
    case "auth/invalid-phone-number": return "Invalid mobile number";
    case "auth/too-many-requests": return "Too many attempts. Please try again later";
    case "auth/invalid-verification-code": return "Incorrect OTP";
    case "auth/code-expired": return "OTP expired. Please resend";
    case "auth/quota-exceeded": return "SMS limit reached. Please try later";
    case "auth/captcha-check-failed": return "Verification failed. Refresh and try again";
    default: return err?.message || "Something went wrong";
  }
}