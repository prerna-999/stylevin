// import { RecaptchaVerifier, signInWithPhoneNumber, signOut, ConfirmationResult } from "firebase/auth";
// import { auth } from "./firebase"; // <- change if your firebase file is elsewhere

// let verifier: RecaptchaVerifier | null = null;

// /** Ask Firebase to SMS an OTP to a 10-digit Indian number. */
// export async function sendFirebaseOtp(phone10: string, containerId = "recaptcha-container"): Promise<ConfirmationResult> {
//   if (verifier) {
//     verifier.clear();
//     verifier = null;
//   }
//   verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
//   try {
//     return await signInWithPhoneNumber(auth, `+91${phone10}`, verifier);
//   } catch (e) {
//     verifier?.clear();
//     verifier = null;
//     throw e;
//   }
// }

// /** Check the OTP and return a Firebase ID token for our backend. */
// export async function confirmFirebaseOtp(confirmation: ConfirmationResult, otp: string): Promise<string> {
//   const cred = await confirmation.confirm(otp);
//   const idToken = await cred.user.getIdToken();
//   await signOut(auth); // we use our own JWT session, so Firebase session isn't needed
//   return idToken;
// }

// export function firebaseErrorMessage(err: any): string {
//   switch (err?.code) {
//     case "auth/invalid-phone-number": return "Invalid mobile number";
//     case "auth/too-many-requests": return "Too many attempts. Please try again later";
//     case "auth/invalid-verification-code": return "Incorrect OTP";
//     case "auth/code-expired": return "OTP expired. Please resend";
//     case "auth/quota-exceeded": return "SMS limit reached. Please try later";
//     case "auth/captcha-check-failed": return "Verification failed. Refresh and try again";
//     default: return err?.message || "Something went wrong";
//   }
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

export function firebaseErrorMessage(err: { code?: string; message?: string } | null | undefined): string {
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